namespace SoundAPI {
    export interface WorldSource {
        position: Vector,
        dimension: number
    }

    export abstract class NetworkPlayer<Server> extends Player {
        protected nEntity: NetworkEntity<Server>;

        constructor(world: WorldSource, radius?: number);
        constructor(entity: number, radius?: number);
        constructor(source: WorldSource | number, radius: number = 5) {
            super();
            if (typeof source == "number")
                this.attachToEntity(source);
            else
                this.attachToCoord(source.position, source.dimension);

            this.radius = radius;
        }

        protected abstract getNetworkEntity(): NetworkEntity<Server>;

        public init() {
            this.nEntity = this.getNetworkEntity();
        }
        protected update(time: number) {
            if (this.getAttach() == Attach.ENTITY) {
                const coords = this.getPosition();
                this.nEntity.getClients().
                    setupDistancePolicy(coords.x, coords.y, coords.z, this.getDimension(), this.radius);
            }
            this.tick(time);
        }

        public destroy() {
            this.nEntity.remove();
            this.remove = true;
        }
        public registerUpdatable(): this {
            this.addServerUpdatable();
            return this;
        }
    }

    // NetworkPlayer.init();
}
