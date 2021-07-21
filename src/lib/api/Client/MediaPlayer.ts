/* https://developer.android.com/reference/android/media/MediaPlayer */

/// <reference path="Player.ts" />

namespace SoundAPI {
    export class MediaPlayer extends Player {
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
            Logger.LogA("Path: " + this.path, "MediaPlayer");
            this.media.setDataSource(this.path);
            this.media.prepare();
        }

        public setVolume(volume: number) {
            super.setVolume(volume);

            if (this.attach == Attach.PLAYER)
                this.media.setVolume(volume, volume);
        }
        public getVolume() {
            return this.volume;
        }

        public play(sid?: string): void {
            if (sid) {
                this.sid = sid;
                this.setSource(MediaPlayer.get(sid));
            }

            if (this.path === null)
                throw new Error("Sourse not set");

            this.media.start();
            super.play();
        }
        public pause(): void {
            this.media.pause();
            super.pause();
        }
        public stop(): void {
            this.media.stop();
            this.media.prepare();
            super.stop();
        }

        public getSid() {
            return this.sid;
        }

        public release() {
            this.media.release();
        }

        protected tick(): void {
            const volume = Utils.getVolume();
            this.media.setVolume(volume.left, volume.right);
        }
    }
}


EXPORT("SoundAPI", SoundAPI);
