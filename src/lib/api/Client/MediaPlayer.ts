/* https://developer.android.com/reference/android/media/MediaPlayer */

/// <reference path="Player.ts" />

const jMediaPlayer = android.media.MediaPlayer;
type jMediaPlayer = android.media.MediaPlayer;

class MediaPlayer extends SoundAPI.Player {
    private static list: Dict<string> = {};
    public static register(sid: string, path: string): void {
        if (this.list.hasOwnProperty(sid))
            throw new Error(`Path "${sid}" was been registered!`);

        this.list[sid] = path;
    }
    public static get(sid: string): string {
        if (!this.list.hasOwnProperty(sid))
            throw new Error(`Path "${sid} " is not registered!`);

        return this.list[sid];
    }

    protected media = new jMediaPlayer();
    protected path: string = null;
    protected sid: string = null;
    protected setSource(src: string) {
        this.media.reset();
        this.path = src;
        Utils.Logger.LogA("Path: " + this.path, "MediaPlayer");
        this.media.setDataSource(this.path);
        this.media.prepare();
    }

    public play(sid?: string) {
        if (sid)
            this.setSid(sid);

        if (this.path === null)
            throw new Error("Sourse not set");

        const volume = this.calcVolume();
        this.media.setVolume(volume.left, volume.right);

        this.media.start();
        return super.play();
    }
    public pause() {
        this.media.pause();
        return super.pause();
    }
    public stop() {
        this.media.stop();
        this.media.prepare();
        return super.stop();
    }

    public setLooping(looping: boolean) {
        this.media.setLooping(looping);
    }

        this.media.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener({
            onCompletion: () => {
                action.apply(this);
            }
        }))
    public setOnCompletion(action: PlayerComplateListener<this>) {
    }

    public getSid() {
        return this.sid;
    }
    public setSid(sid: string) {
        this.sid = sid;
        this.setSource(MediaPlayer.get(sid));
    }

    public release() {
        this.stop();
        this.remove = true;
        this.media.release();
    }

    protected calcVolume() {
        let volume: Utils.Volume = Utils.getMusicVolume(this.getVolume());

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

    protected tick(): void {
        if (this.getState() != PlayerState.PLAY) return;

        const volume = this.calcVolume();
        this.media.setVolume(volume.left, volume.right);
    }
}

EXPORT("MediaPlayer", MediaPlayer);
