/// <reference path="NetworkPlayer.ts" />

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
    export class NetworkMediaPlayer extends NetworkPlayer<MediaPlayerInfo, MediaPlayer> {
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

            type.addClientPacketListener<{ sid: string }>("play", (target, e, packet) => {
                target.play(packet.sid);
            });

            type.addClientPacketListener<{}>("pause", (target) => {
                target.pause();
            });

            type.addClientPacketListener<{}>("stop", (target) => {
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

        protected remove: boolean = false;
        protected sid: string = null;

        public getSid() {
            return this.sid;
        }

        public play(sid?: string) {
            if (sid)
                this.sid = sid
            else if (this.sid === null)
                throw new Error("Sourse not set");

            this.nEntity.send<{ sid: string }>("play", { sid });
            super.play();
        }

        public pause() {
            this.nEntity.send<{}>("pause", {});
            super.pause();
        }
        public stop() {
            this.nEntity.send<{}>("stop", {});
            super.stop();
        }

        protected getNetworkEntity() {
            return new NetworkEntity<MediaPlayerInfo>(NetworkMediaPlayer.entityType, {
                attach: this.getAttach(),
                position: this.getPosition(),
                entity: this.getEntity(),
                dimension: this.getDimension(),
                radius: this.getRadius(),
                sid: this.getSid(),
                state: this.getState()
            });
        }
    }
}
