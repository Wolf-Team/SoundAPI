namespace SoundAPI {
    export enum Attach { PLAYER, ENTITY, COORDS };

    export abstract class Player {
        protected attach: Attach = Attach.PLAYER;
        protected entity: number = 0;
        protected coords: Vector = { x: 0, y: 0, z: 0 };
        protected radius: number = 5;
        protected volume: number = 1;

        public abstract play(): void;
        public abstract pause(): void;
        public abstract stop(): void;

        public setVolume(volume: number): void { this.volume = volume; };
        public getVolume(): number { return this.volume; };

        public attachToCoord(pos: Vector, radius: number = 5): void {
            if (!World.isWorldLoaded())
                throw new Error("You can attach the Player to the coordinates only in the world.");

            this.attach = Attach.COORDS;
            this.coords = pos;
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
        }

        //Updatable
        protected remove: boolean = false;
        protected abstract tick(): void;

        private update(): void {
            if (this.attach == Attach.PLAYER)
                return <null>(this.remove = true);

            this.tick();
        };

        protected registerUpdatable() {
            Updatable.addLocalUpdatable(<any>this);
        }
    }
}
