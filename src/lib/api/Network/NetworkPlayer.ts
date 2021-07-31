interface WorldSource {
    position: Vector,
    dimension: number
}

abstract class NetworkPlayer<Server> extends SoundAPIPlayer {
    protected nEntity: NetworkEntity<Server>;

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

EXPORT("NetworkPlayer", NetworkPlayer);
