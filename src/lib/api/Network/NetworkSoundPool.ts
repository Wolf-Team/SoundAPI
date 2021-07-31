@exportModule
class NetworkSoundPool {
    protected static list: Dict<SoundPool> = {};

    public static get(name): SoundPool {
        return this.list[name]
    }

    public static register(name: string, streams: number, settings?: SoundPoolSettings): NetworkSoundPool {
        if (this.list.hasOwnProperty(name))
            throw new Error(`NetworkSoundPool with name "${name}" was been register.`);

        // Create SoundPool
        this.list[name] = SoundPool.init(streams, settings);
        return new NetworkSoundPool(name, this.list[name]);
    }

    protected constructor(protected name: string, protected soundPool: SoundPool) { }

    public getPlayer(sid: string) {
        return new NetworkSoundPlayer(this.name, sid);
    }



    public register(sid: string, path: string, priority: number = 1) {
        this.soundPool.register(sid, path, priority);
    }
}
