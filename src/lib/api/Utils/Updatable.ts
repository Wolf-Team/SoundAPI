namespace Utils {
    export abstract class Updatable {
        protected remove: boolean = false;
        protected abstract update(time: number): void;

        public getUpdatable(): globalThis.Updatable {
            const _this = this;
            return {
                remove: false,
                update: function () {
                    if (_this.remove)
                        return <null>(this.remove = _this.remove);

                    _this.update(Debug.sysTime());
                }
            }
        }

        public addServerUpdatable() {
            IC.Updatable.addUpdatable(this.getUpdatable())
        }
        public addClientUpdatable() {
            IC.Updatable.addLocalUpdatable(this.getUpdatable())
        }
    }
}
