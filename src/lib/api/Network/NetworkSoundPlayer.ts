interface SoundPlayerInfo {
    name: string,
    sid: string
}

type NetworkSoundPlayerEntityType = NetworkEntityType<NetworkSoundPlayer, SoundPlayerInfo, SoundPlayer>;


namespace NetworkSoundPlayer.Packets {
    export type Play = { loop: number }
}

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
                sid: target.sid
            }
        });
        type.setClientEntityAddedListener((entity, target) => {
            return NetworkSoundPool.get(target.name).getPlayer(target.sid)
        })

        type.setClientEntityRemovedListener((target) => {
            target.stop();
        })

        type.addClientPacketListener<NetworkSoundPlayer.Packets.Play>("play", (target, e, data) => {
            target.play(data.loop);
        })

        return type;
    })();

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
    public setOnCompletion(action: PlayerComplateListener<this>): void {
        throw new Error("Method not implemented.");
    }

}
