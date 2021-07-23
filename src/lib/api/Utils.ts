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
                update: () => {
                    _this.update();
                    this.remove = _this.remove;
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
