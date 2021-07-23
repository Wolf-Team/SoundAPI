namespace SoundAPI {
    export class SoundPlayer extends Player {
        protected stream: number;
        protected soundPool: jSoundPool;

        constructor(soundPool: jSoundPool, stream: number) {
            super();
            this.soundPool = soundPool;
            this.stream = stream;
        }

        public play(): void {
            this.soundPool.resume(this.stream);
            super.play();
        }
        public pause(): void {
            this.soundPool.pause(this.stream);
            super.pause();
        }
        public stop(): void {
            this.soundPool.stop(this.stream);
            super.stop();
        }
        protected tick(): void {
            throw new Error("Method not implemented.");
        }
    }
}