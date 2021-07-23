/// <reference path="NetworkPlayer.ts" />

namespace SoundAPI {
    interface MediaPlayerInfo {
        attach: Attach,
        position?: Vector,
        entity?: number,
        dimension?: number,
        radius: number,
        sid: string,
        state: PlayerState
    }

    type MediaPlayerEntityType = NetworkEntityType<NetworkMediaPlayer, MediaPlayerInfo, MediaPlayer>;
    export class NetworkMediaPlayer extends NetworkPlayer<MediaPlayerInfo> {
        protected static entityType: MediaPlayerEntityType = (() => {
            const type: MediaPlayerEntityType = new NetworkEntityType("network_media_player");
            type.setClientListSetupListener((list, target, entity) => {
                //target = From new NetworkEntity(type, target)
                const coords = target.getPosition();
                list.setupDistancePolicy(coords.x, coords.y, coords.z, target.getDimension(), target.getRadius());
            });
            type.setClientAddPacketFactory((target, entity, client): MediaPlayerInfo => {
                //target = From new NetworkEntity(type, target)
                return {
                    attach: target.getAttach(),
                    position: target.getPosition(),
                    entity: target.getEntity(),
                    dimension: target.getDimension(),
                    radius: target.getRadius(),
                    sid: target.getSid(),
                    state: target.getState()
                };
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
            if (info.sid)
                player.setSid(info.sid);
            if (info.state == PlayerState.PLAY)
                player.play();

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
            return new NetworkEntity<NetworkMediaPlayer>(NetworkMediaPlayer.entityType, this);
        }
    }
}
