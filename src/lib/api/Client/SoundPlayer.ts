/// <reference path="SoundPool.ts" />


class SoundPlayer extends SoundAPIPlayer {
    protected streamId: number;
    protected startTime: number;
    protected pauseTime: number;
    protected loop: number;
    protected timer = new Utils.Timer({
        endTimer: () => {
            this.stop();
        }
    });
    private completionEvent: PlayerComplateListener<this> = () => { };
    private duration: number = 0;


    constructor(protected soundPool: jSoundPool, protected soundInfo: SoundInfo) {
        super();
    }

    public play(loop: number = SoundLoop.NONE) {
        if (this.startTime == null) {
            const volume = this.calcVolume();
            const priority = loop == SoundLoop.INFINITE ? 2 : loop == SoundLoop.NONE ? 0 : 1;
            this.streamId = this.soundPool.play(this.soundInfo.id, volume.left, volume.right, priority, loop, 1);
            this.startTime = Debug.sysTime();
            this.loop = loop;
            this.duration = this.soundInfo.duration * (this.loop + 1);
            this.timer.start(this.duration);
        } else {
            this.timer.start(this.duration - this.startTime + this.pauseTime);
            this.startTime += Debug.sysTime() - this.pauseTime;
            this.soundPool.resume(this.streamId);
        }

        return super.play();
    }
    public pause() {
        this.soundPool.pause(this.streamId);
        this.pauseTime = Debug.sysTime();
        this.timer.stop();
        return super.pause();
    }
    public stop() {
        this.soundPool.stop(this.streamId);
        this.startTime = this.streamId = this.pauseTime = 0;
        this.timer.stop();
        this.completionEvent();
        return super.stop();
    }

    public setOnCompletion(action: PlayerComplateListener<this>): this {
        this.completionEvent = action;
        return this;
    };

    protected calcVolume() {
        let volume: Utils.Volume = Utils.getSoundVolume(this.getVolume());

        const attach = this.getAttach();
        switch (attach) {
            case Attach.ENTITY:
                volume = Utils.calcVolume(volume, this.getRadius(), this.getEntity());
                break;
            case Attach.COORDS:
                volume = Utils.calcVolume(volume, this.getRadius(), this.getPosition());
                break;
        }

        return volume;
    }

    protected tick(time: number): void {
        if (!this.streamId || this.getState() != PlayerState.PLAY) return;

        const volume = this.calcVolume();
        this.soundPool.setVolume(this.streamId, volume.left, volume.right);
    }
}

EXPORT("SoundPlayer", SoundPlayer);
