interface SoundPlayerInfo {
    name: string,

    attach: Attach,
    position?: Vector,
    entity?: number,
    dimension?: number,
    radius: number,
    sid: string,
    state: PlayerState
}

type NetworkSoundPlayerEntityType = NetworkEntityType<NetworkSoundPlayer, SoundPlayerInfo, SoundPlayer>;


namespace NetworkSoundPlayer.Packets {
    export type Play = { loop: number }
}
@exportModule
class NetworkSoundPlayer extends NetworkPlayer<NetworkSoundPlayer>{
    protected static readonly entityType: NetworkSoundPlayerEntityType = (() => {
        const type: NetworkSoundPlayerEntityType = new NetworkEntityType("network_sound_player");

        type.setClientListSetupListener((list, target, entity) => {
            const coords = target.getPosition();
            list.setupDistancePolicy(coords.x, coords.y, coords.z, target.getDimension(), target.getRadius());
        });

        type.setClientAddPacketFactory(target => {
            return {
                name: target.name,
                attach: target.getAttach(),
                position: target.getPosition(),
                entity: target.getEntity(),
                dimension: target.getDimension(),
                radius: target.getRadius(),
                sid: target.sid,
                state: target.getState()
            }
        });
        type.setClientEntityAddedListener((entity, target) => {
            return NetworkSoundPlayer.getPlayer(target).setOnCompletion(() => {
                entity.send("stop", {});
            })
        })

        type.setClientEntityRemovedListener((target) => {
            target.stop();
        })

        type.addClientPacketListener<NetworkSoundPlayer.Packets.Play>("play", (target, e, data) => {
            target.play(data.loop);
        })

        type.addServerPacketListener("stop", (target, entity) => {
            entity.remove();
        })

        return type;
    })();

    protected static getPlayer(info: SoundPlayerInfo): SoundPlayer {
        const player = NetworkSoundPool.getSoundPool(info.name).getPlayer(info.sid);
        switch (info.attach) {
            case Attach.ENTITY:
            case Attach.PLAYER:
                player.attachToEntity(info.entity, info.radius);
                break;
            case Attach.COORDS:
                player.attachToCoord(info.position, info.dimension, info.radius);
                break;
        }
        return player;
    }

    constructor(protected name: string, protected sid: string) {
        super();
    }

    public play(loop: number = SoundLoop.NONE) {
        this.send<NetworkSoundPlayer.Packets.Play>("play", { loop });
        return super.play();
    }

    protected getNetworkEntity(): NetworkEntity<this> {
        return new NetworkEntity(NetworkSoundPlayer.entityType, this);
    }
    public setOnCompletion(action: PlayerComplateListener<this>) {
        throw new Error("Method not implemented.");
        return this;
    }

}
