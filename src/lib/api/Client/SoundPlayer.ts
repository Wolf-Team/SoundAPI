/// <reference path="SoundPool.ts" />


class SoundPlayer extends SoundAPI.Player {
    protected streamId: number;
    protected startTime: number;
    protected pauseTime: number;
    protected loop: number;
    private completionEvent: PlayerComplateListener<this> = () => { };


    constructor(protected soundPool: jSoundPool, protected soundInfo: SoundInfo) {
        super();
    }

    public play(loop: number = SoundLoop.NONE) {
        if (this.startTime == null) {
            const volume = this.calcVolume();
            const priority = loop == SoundLoop.INFINITE ? 2 : loop == SoundLoop.NONE ? 0 : 1;
            this.streamId = this.soundPool.play(this.soundInfo.id, volume.left, volume.right, priority, loop, 1);
            this.startTime = Debug.sysTime();
            this.remove = false;
            this.loop = loop;
        } else {
            this.startTime += Debug.sysTime() - this.pauseTime;
            this.soundPool.resume(this.streamId);
        }

        if (Utils.inWorld())
            this.registerUpdatable();

        return super.play();
    }
    public pause() {
        this.soundPool.pause(this.streamId);
        this.pauseTime = Debug.sysTime();
        return super.pause();
    }
    public stop() {
        this.soundPool.stop(this.streamId);
        this.startTime = this.streamId = this.pauseTime = null;
        this.remove = true;
        this.completionEvent();
        return super.stop();
    }

    public setOnCompletion(action: PlayerComplateListener<this>): void {
        this.completionEvent = action;
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
        if (this.getState() != PlayerState.PLAY) return;

        if (this.loop != SoundLoop.INFINITE) {
            const duration = this.soundInfo.duration * (this.loop + 1);
            if (duration <= time - this.startTime)
                return <null>this.stop();
        }

        const volume = this.calcVolume();
        this.soundPool.setVolume(this.streamId, volume.left, volume.right);
    }
}

EXPORT("SoundPlayer", SoundPlayer);
