@exportModule
class NetworkSoundPool {
    protected static pools: Dict<SoundPool> = {};
    protected static list: Dict<NetworkSoundPool> = {};

    public static getSoundPool(name): SoundPool {
        return this.pools[name]
    }

    public static register(name: string, streams: number, settings?: SoundPoolSettings): NetworkSoundPool {
        if (this.pools.hasOwnProperty(name))
            throw new Error(`NetworkSoundPool with name "${name}" was been register.`);

        // Create SoundPool
        this.pools[name] = SoundPool.init(streams, settings);
        return this.list[name] = new NetworkSoundPool(name, this.pools[name]);
    }

    public static get(name: string): NetworkSoundPool {
        return this.list[name] || null;
    }

    public static getOrRegister(name: string, streams: number, settings?: SoundPoolSettings) {
        return this.get(name) || this.register(name, streams, settings);
    }

    protected constructor(protected name: string, protected soundPool: SoundPool) { }

    public getPlayer(sid: string) {
        return new NetworkSoundPlayer(this.name, sid);
    }

    public play(sid: string, entity: number, radius?: number, loop?: number): NetworkSoundPlayer;
    public play(sid: string, world: WorldSource, radius?: number, loop?: number): NetworkSoundPlayer;
    public play(sid: string, source: WorldSource | number, radius: number = 5, loop: number = SoundLoop.NONE) {
        const player = this.getPlayer(sid)
        if (typeof source == "number")
            player.attachToEntity(source, radius);
        else
            player.attachToCoord(source.position, source.dimension, radius);

        player.play(loop);
        return player;
    }

    public register(sid: string, path: string, priority: number = 1) {
        this.soundPool.register(sid, path, priority);
    }

    public unregister(sid: string) {
        this.soundPool.unregister(sid);
    }
}
