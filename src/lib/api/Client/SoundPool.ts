interface SoundPoolSettings {
    /**
     * For SoundPool before Android API 21
     */
    stream_type?: number;
    /**
     * For SoundPool before Android API 21
     */
    srcQuality?: number;

    /**
     * For SoundPool after Android API 21
     */
    content_type?: number;
    /**
     * For SoundPool after Android API 21
     */
    flags?: number;
}
const defaultSettings: SoundPoolSettings = {
    stream_type: AudioManager.STREAM_MUSIC,
    srcQuality: 0,

    content_type: AudioAttributes.CONTENT_TYPE_SONIFICATION
}
interface SoundInfo {
    id: number;
    sid: string;
    file: string;
    duration: number;
}

enum SoundLoop {
    INFINITE = -1, NONE = 0
}
class SoundPool {
    protected static initAudioAttributes(type: number = AudioAttributes.CONTENT_TYPE_SONIFICATION, flags?: number) {
        const builder = new AudioAttributes.Builder();
        builder.setUsage(AudioAttributes.USAGE_GAME)
        builder.setContentType(type);

        if (flags)
            builder.setFlags(flags);


        return builder.build();
    }
    protected static init_21(maxStreams: number, type?: number, flags?: number) {
        const builder = new jSoundPool.Builder();
        builder.setMaxStreams(maxStreams);
        builder.setAudioAttributes(this.initAudioAttributes(type, flags));

        return builder.build();
    }
    protected static init_1(maxStreams: number, streamType: number = AudioManager.STREAM_MUSIC, srcQuality: number = 0) {
        return new jSoundPool(maxStreams, streamType, srcQuality);
    }

    public static init(maxStreams: number, settings: SoundPoolSettings = defaultSettings) {
        return new SoundPool(android.os.Build.VERSION.SDK_INT >= 21 ?
            this.init_21(maxStreams, settings.content_type, settings.flags) :
            this.init_1(maxStreams, settings.stream_type, settings.srcQuality));
    }


    protected soundPool: jSoundPool;
    protected list: Dict<SoundInfo> = {};

    protected constructor(soundPool: jSoundPool) {
        this.soundPool = soundPool;
    }

    public register(sid: string, file: string, priority: number = 1) {
        if (this.list.hasOwnProperty(sid))
            throw new Error(`Path "${sid}" was been registered!`);

        this.list[sid] = {
            id: this.soundPool.load(file, priority),
            sid,
            file,
            duration: Utils.getDuration(file)
        }
    }
    public getPlayer(sid: string) {
        return new SoundPlayer(this.soundPool, this.list[sid])
    }
    public play(sid: string, loop: number = SoundLoop.NONE) {
        return this.getPlayer(sid).play(loop);
    }

    public pause() {
        this.soundPool.autoPause();
    }
    public resume() {
        this.soundPool.autoResume();
    }
    public release() {
        this.soundPool.release();
    }
}

EXPORT("SoundLoop", SoundLoop);
EXPORT("SoundPool", SoundPool);
