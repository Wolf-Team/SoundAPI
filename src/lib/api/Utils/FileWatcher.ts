/**
 * Don't export namespace
 */
namespace Utils {
    const File = java.io.File;
    type File = java.io.File;

    export interface FileWatcherModifyEvent {
        (newModifyTime: number, oldModifyTime: number): void
    }
    export class FileWatcherModify implements TimerHandler {
        protected _lastModifed: number;
        protected _file: File;
        protected _timer: Timer;
        protected _event: FileWatcherModifyEvent = () => { };

        protected lastModified() {
            return this._file.lastModified();
        }

        public constructor(protected path: string) {
            this._file = new File(this.path);
            this._lastModifed = this.lastModified();
            this._timer = new Timer(this)
        }

        public endTimer = () => {
            const lastModifed = this.lastModified();

            if (lastModifed != this._lastModifed)
                this._event(lastModifed, this._lastModifed);

            this._lastModifed = lastModifed;
        }


        public setOnEvent(action: FileWatcherModifyEvent) {
            this._event = action;
        }

        public start() {
            this._timer.start(1000, TimerLoop.INFINITE);
        }

        public stop() {
            this._timer.stop();
        }
    }
}
