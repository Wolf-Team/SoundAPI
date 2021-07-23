namespace SoundAPI {
    export enum Attach { PLAYER, ENTITY, COORDS };

    export enum PlayerState { PLAY, PAUSE, STOP };

    export const MIN_RADUIS = 2;

    export abstract class Player extends Utils.Updatable {
        protected attach: Attach = Attach.PLAYER;
        protected entity: number = 0;
        protected coords: Vector = { x: 0, y: 0, z: 0 };
        protected dimension: number = 0;
        protected radius: number = 5;
        protected volume: number = 1;
        protected state: PlayerState = PlayerState.STOP;


        public play(): void {
            this.state = PlayerState.PLAY;
        }
        public pause(): void {
            this.state = PlayerState.PAUSE;
        }
        public stop(): void {
            this.state = PlayerState.STOP;
        }

        public getState() {
            return this.state;
        }

        public setVolume(volume: number): void { this.volume = volume; };
        public getVolume(): number { return this.volume; };

        public attachToCoord(pos: Vector, dimension: number, radius: number = 5): void {
            if (!World.isWorldLoaded())
                throw new Error("You can attach the Player to the coordinates only in the world.");

            this.attach = Attach.COORDS;
            this.coords = pos;
            this.dimension = dimension;
            this.radius = radius;
            this.registerUpdatable();
        }
        public attachToEntity(ent: number, radius: number = 5): void {
            if (!World.isWorldLoaded())
                throw new Error("You can attach the Player to an entity only in the world.");

            if (ent == IC.Player.get()) return this.attachToPlayer();

            this.attach = Attach.ENTITY;
            this.entity = ent;
            this.radius = radius;
            this.registerUpdatable();
        }
        public attachToPlayer(): void {
            this.attach = Attach.PLAYER;
            if (World.isWorldLoaded())
                this.entity = IC.Player.get();
        }

        public getAttach() { return this.attach; }
        public getPosition() {
            return this.attach == Attach.ENTITY ? Entity.getPosition(this.entity) : this.coords;
        }
        public getDimension() {
            return this.attach == Attach.ENTITY ? Entity.getDimension(this.entity) : this.dimension;
        }
        public getEntity() { return this.entity; }
        public getRadius() { return Math.max(this.radius, MIN_RADUIS); }

        //Updatable
        protected abstract tick(): void;

        protected update(): void {
            this.tick();
        };

        public registerUpdatable() {
            this.addClientUpdatable();
        }
    }
}
