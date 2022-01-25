/// <reference path="../utils/File.ts" />
/// <reference path="../utils/Object.ts" />
/// <reference path="errors/InvalidOptions.ts" />
/// <reference path="errors/SourceError.ts" />
/// <reference path="players/MediaPlayer.ts" />
/// <reference path="players/SoundPlayer.ts" />

type Range = { min: number; max: number; };
interface Dict<value> {
	[key: string]: value
}

interface SoundAdditiveOptions {
	/**
	 * Sound hearing distance.
	 * @default 16
	 */
	defaultDistance: number;
	/**
	* Default sound volume
	* @default 1
	*/
	defaultVolume: number;

	/**
	 * Clamp sound volume,
	 * @default (0,1)
	 */
	clampVolume: Range;

	/**
	 * Set default mode looping
	 * @default false
	 */
	loop: boolean;

	/**
	 * Type sound. Used for setting volume from game settings.
	 * @default "sound"
	 */
	type: SoundAPI.Type;

	/**
	 * Sync player in multiplayer
	 * @default true
	 */
	sync: boolean;

	/**
	 * @default false
	 */
	muteInSolidBlock: boolean;
}
interface SoundOptions extends Partial<SoundAdditiveOptions> {
	/**
	 * Path to file
	 */
	source: string;
}

interface SoundMeta extends SoundOptions {
	typePlayer: "pool" | "player";
}

interface MediaMeta extends SoundMeta {
	typePlayer: "player";
}

interface PoolMeta extends SoundMeta {
	typePlayer: "pool",
	soundId: number;
}

function isPoolMeta(meta: Meta): meta is PoolMeta {
	return meta.typePlayer == "pool";
}

type Meta = PoolMeta | MediaMeta;

class SoundAPI {
	public constructor(protected readonly mod_id: string) { }

	private static readonly sounds: Dict<Meta> = {};

	private static getSoundOptions(options: SoundOptions): SoundOptions {
		options = { ...defaultOptions, ...options };
		if (!options.source || typeof options.source !== "string")
			throw new ReferenceError("Source not assigned");

		if (
			typeof options.defaultVolume != "number" ||
			options.defaultVolume < 0 ||
			options.defaultVolume > 1
		)
			throw new ReferenceError("defaultVolume was been number >=0 and <= 1");

		if (
			typeof options.clampVolume != "object" ||
			options.clampVolume.min === undefined ||
			options.clampVolume.max === undefined ||
			options.clampVolume.min < 0 ||
			options.clampVolume.max > 1 ||
			options.clampVolume.min > options.clampVolume.max
		)
			throw new ReferenceError("clampVolume was been object {min:(>=0 and <=max), max:(<=1 and >=min)>}");

		if (typeof options.loop != "boolean")
			throw new ReferenceError("loop was been boolean");

		const types = Object.values(SoundAPI.Type);
		if (!options.type || typeof options.type !== "string" || types.indexOf(options.type) == -1)
			throw new ReferenceError(`type was been one from ${types.join(", ")}`);

		return options;
	}

	private getUid(uid: string) {
		return this.mod_id + "." + uid;
	}

	/**
	 * Register sound in system with default settings
	 * @param {string} uid - Unical ID for sound
	 * @param {string} source - path to sound
	 */
	public registerSound(uid: string, source: string): void;
	/**
	 * Register sound in system
	 * @param {string} uid - Unical ID for sound
	 * @param {SoundOptions} options - Options sound
	 */
	public registerSound(uid: string, options: SoundOptions): void;
	public registerSound(uid: string, options: SoundOptions | string) {
		if (SoundAPI.sounds.hasOwnProperty(this.getUid(uid))) throw new RangeError(`Sound "${uid}" was been registered.`);
		uid = this.getUid(uid);

		try {
			options = SoundAPI.getSoundOptions(typeof options == "string" ? { source: options } : options);
		} catch (e) {
			if (e instanceof Error)
				throw new InvalidOptions(uid, e.message);
			else
				throw e
		}

		const sourceFile = new File(options.source);
		if (!sourceFile.exists())
			throw new java.io.FileNotFoundException(`File ${options.source} not found`);

		const size = sourceFile.length();
		if (size <= 0xFFFFF) {
			SoundAPI.sounds[uid] = {
				typePlayer: "pool",
				soundId: SoundPlayer.load(options.source),
				...options
			}
		} else {
			SoundAPI.sounds[uid] = {
				typePlayer: "player",
				...options
			}
		}
	}

	public select(uid: string): SoundAPIPlayer {
		if (!SoundAPI.sounds.hasOwnProperty(this.getUid(uid)))
			throw new RangeError(`Sound "${uid}" not been registered.`);
		uid = this.getUid(uid);

		const sound = SoundAPI.sounds[uid];
		if (isPoolMeta(sound)) {
			return new SoundPlayer(uid, sound);
		} else {
			return new MediaPlayer(uid, sound);
		}
	}
}

namespace SoundAPI {
	export enum Type {
		SOUND = "sound",
		MUSIC = "music",
		AMBIENT = "ambient",
		BLOCK = "block",
		HOSTILE = "hostile",
		NEUTRAL = "neutral",
		RECORD = "record",
		PLAYER = "player",
		WEATHER = "weather"
	};
}

const defaultOptions: Readonly<SoundAdditiveOptions> = {
	defaultVolume: 1,
	clampVolume: { min: 0, max: 1 },
	loop: false,
	type: SoundAPI.Type.SOUND,
	defaultDistance: 16,
	sync: true,
	muteInSolidBlock: false
}

ModAPI.registerAPI("SoundAPI", SoundAPI);
