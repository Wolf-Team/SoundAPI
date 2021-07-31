/// <reference path="NetworkPlayer.ts" />

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
class NetworkMediaPlayer extends NetworkPlayer<NetworkMediaPlayer> {
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
        type.setClientEntityAddedListener((entity, packet) => {
            //packet = From setClientAddPacketFactory((...) => packet)
            const player = NetworkMediaPlayer.getPlayer(packet);
            player.setOnCompletion(() => {
                entity.send("stop", {});
            })
            return player;
        });


        type.setClientEntityRemovedListener((target, entity, object) => {
            alert(object);
            //target = From setClientEntityAddedListener((...) => target)
            target.release();
        })


        type.addClientPacketListener<{ sid: string }>("play", (target, e, packet) => {
            target.play(packet.sid);
        });
        type.addClientPacketListener<{}>("pause", (target) => {
            target.pause();
        });
        type.addClientPacketListener<{}>("stop", (target) => {
            target.stop();
        });

        type.addServerPacketListener("stop", (target, entity, client, data, meta) => {
            target.pause();
            target.OnCompletion();
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

        this.send("play", { sid });
        return super.play();
    }

    public pause() {
        this.send("pause", {});
        return super.pause();
    }
    public stop() {
        this.send("stop", {});
        return super.stop();
    }

    public send<Data = any>(name: string, data: Data) {
        this.nEntity.send<Data>(name, data);
    }

    private completionEvent: PlayerComplateListener<this> = () => { };
    public setOnCompletion(action: PlayerComplateListener<this>): void {
        this.completionEvent = action;
    }

    private OnCompletion() {
        this.completionEvent();
    }

    protected getNetworkEntity() {
        return new NetworkEntity<NetworkMediaPlayer>(NetworkMediaPlayer.entityType, this);
    }
}
EXPORT("NetworkMediaPlayer", NetworkMediaPlayer);
