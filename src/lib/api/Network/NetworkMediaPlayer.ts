namespace SoundAPI {
    export interface WorldSource {
        position: Vector,
        dimension: number
    }

    interface MediaPlayerInfo {
        attach: Attach,
        position?: Vector,
        entity?: number,
        dimension?: number,
        radius: number,
        sid: string,
        state: PlayerState
    }

    type MediaPlayerEntityType = NetworkEntityType<MediaPlayerInfo, MediaPlayerInfo, MediaPlayer>;
    export class NetworkMediaPlayer {
        protected static entityType: MediaPlayerEntityType = (() => {
            const type: MediaPlayerEntityType = new NetworkEntityType("network_media_player");
            type.setClientListSetupListener((list, target, entity) => {
                //target = From new NetworkEntity(type, target)
                const coords = target.position;
                list.setupDistancePolicy(coords.x, coords.y, coords.z, target.dimension, target.radius);
            });
            type.setClientAddPacketFactory((target, entity, client): MediaPlayerInfo => {
                //target = From new NetworkEntity(type, target)
                return target;
            });
            type.setClientEntityRemovedListener((target, entity) => {
                //target = From setClientEntityAddedListener((...) => target)
                target.release();
            })
            type.setClientEntityAddedListener((entity, packet) => {
                //packet = From setClientAddPacketFactory((...) => packet)
                const player = NetworkMediaPlayer.getPlayer(packet);
                player.registerUpdatable();
                return player;
            });

            type.addClientPacketListener<string>("play", (target, e, sid) => {
                target.play(sid);
            });

            type.addClientPacketListener<string>("pause", (target) => {
                target.pause();
            });

            type.addClientPacketListener<string>("stop", (target) => {
                target.stop();
            });

            return type;
        })();

        protected static getPlayer(info: MediaPlayerInfo) {
            const player = new MediaPlayer();
            switch (info.attach) {
                case Attach.ENTITY:
                case Attach.PLAYER:
                    player.attachToEntity(info.entity, info.radius);
                    break;
                case Attach.COORDS:
                    player.attachToCoord(info.position, info.dimension, info.radius);
                    break;
            }
            if (info.state == PlayerState.PLAY)
                player.play(info.sid);

            return player;
        }

        protected entity: NetworkEntity;
        protected player: MediaPlayerInfo;
        protected remove: boolean = false;

        constructor(world: WorldSource, radius?: number);
        constructor(entity: number, radius?: number);
        constructor(source: WorldSource | number, radius: number = 5) {
            this.player = {
                attach: typeof source == "number" ? Attach.ENTITY : Attach.COORDS,
                dimension: typeof source == "number" ? Entity.getDimension(source) : source.dimension,
                radius: radius,
                sid: null,
                state: PlayerState.STOP
            };

            if (typeof source == "number")
                this.player.entity = source;
            else
                this.player.position = source.position;

        }

        public getPosition() {
            return this.player.attach == Attach.ENTITY ? Entity.getPosition(this.player.entity) : this.player.position;
        }
        public getDimension() {
            return this.player.attach == Attach.ENTITY ? Entity.getDimension(this.player.entity) : this.player.dimension;
        }
        public getState() {
            return this.player.state;
        }

        public play(sid?: string) {
            this.entity.send<string>("play", sid);
            this.player.state = PlayerState.PLAY;
        }

        public pause() {
            this.entity.send<null>("pause", null);
            this.player.state = PlayerState.PAUSE;
        }
        public stop() {
            this.entity.send<null>("stop", null);
            this.player.state = PlayerState.STOP;
        }


        public init() {
            this.entity = new NetworkEntity<MediaPlayerInfo>(NetworkMediaPlayer.entityType, this.player);
        }
        public tick() {
            const coords = this.getPosition();
            this.entity.getClients().
                setupDistancePolicy(coords.x, coords.y, coords.z, this.getDimension(), this.player.radius);
        }
        public destroy() {
            this.entity.remove();
            this.remove = true;
        }
        protected update() {
            this.tick();
        }
        public registerUpdatable() {
            Updatable.addUpdatable(<any>this);
        }
    }
}
