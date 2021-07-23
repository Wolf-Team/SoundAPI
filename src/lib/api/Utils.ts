namespace SoundAPI.Utils {
    export interface Volume {
        left: number;
        right: number;
    }
    export function getVolume(): Volume {
        return { left: 1, right: 1 };
    }

    export function inWorld() {
        return World.isWorldLoaded() || Network.inRemoteWorld();
    }

    export abstract class Updatable {
        protected remove: boolean = false;
        protected abstract update(): void;

        public getUpdatable(): globalThis.Updatable {
            const _this = this;
            return {
                remove: false,
                update: function () {
                    if (_this.remove)
                        return <null>(this.remove = _this.remove);

                    _this.update();
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
