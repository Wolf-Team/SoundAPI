/**
 * Don't export namespace
 */
namespace Utils {
    const Thread = java.lang.Thread;
    type Thread = java.lang.Thread;
    const Runnable = java.lang.Runnable;

    export interface TimerVoid { (): void }
    export interface TimerHandler {
        startTimer?: () => void,
        endTimer: () => void
    }

    export enum TimerLoop { INFINITE = -1, NONE = 0 }



    export class Timer {
        private _thread: Thread;
        private _loop: number = 1;
        private _time: number = 0;
        private _run: boolean = false;
        private _handler: TimerHandler;


        constructor(hundler: TimerHandler);
        constructor(hundler: TimerVoid);
        constructor(hundler: TimerHandler | TimerVoid) {
            if (typeof hundler == "function")
                hundler = { endTimer: hundler };

            this._handler = hundler;

            this._thread = new Thread(new Runnable({
                run: () => {
                    let time = Debug.sysTime();

                    while (this._run && (this._loop == TimerLoop.INFINITE || this._loop--)) {
                        if (this._handler.startTimer)
                            this._handler.startTimer();

                        while (this._run) {
                            if (Debug.sysTime() - time < this._time)
                                continue;


                            this._handler.endTimer();
                        }
                        if (this._loop == 0)
                            this._run = false;
                    }
                }
            }));
        }

        public start(time: number, loop: number = TimerLoop.NONE) {
            this._loop = loop == TimerLoop.INFINITE ? loop : loop + 1;
            this._run = true;
            this._time = time;
            this._thread.start();
        }
        public stop() {
            this._loop = 0;
            this._run = false;
        }
    }
}
