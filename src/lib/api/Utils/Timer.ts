namespace Utils {
    const Thread = java.lang.Thread;
    type Thread = java.lang.Thread;
    const Runnable = java.lang.Runnable;

    export interface TimerHundler {
        startTimer?: () => void,
        endTimer: () => void
    }

    export enum TimerLoop { INFINITE = -1, NONE = 0 }



    export class Timer {
        protected _thread: Thread;
        protected _loop: number = 1;

        constructor(hundler: TimerHundler);
        constructor(protected _hundler: TimerHundler) { }

        public start(time: number, loop: number = TimerLoop.NONE) {
            this._loop = loop == TimerLoop.INFINITE ? loop : loop + 1;
            this._thread = new Thread(new Runnable({
                run: () => {
                    while (this._loop--) {
                        if (this._hundler.startTimer)
                            this._hundler.startTimer();

                        Thread.sleep(time);
                        this._hundler.endTimer();
                    }
                }
            }));
            this._thread.start();
        }
        public stop() {
            this._loop = 0;
            this._thread.interrupt();
        }
    }
}
