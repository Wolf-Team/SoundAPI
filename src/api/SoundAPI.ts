type Range = { min: number; max: number; };

interface SoundAdditiveOptions {
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
	 * @default "main"
	 */
	type: SoundAPI.Type;
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
	file: string;
}

interface PoolMeta extends SoundMeta {
	typePlayer: "pool",
	soundId: number;
}

function isPoolMeta(meta: Meta): meta is PoolMeta {
	return meta.typePlayer == "pool";
}

type Meta = PoolMeta | MediaMeta;

namespace SoundAPI {
	export enum Type {
		MAIN = "main",
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

	const defaultOptions: SoundAdditiveOptions = {
		defaultVolume: 1,
		clampVolume: { min: 0, max: 1 },
		loop: false,
		type: Type.MAIN
	}

	function getSoundOptions(options: SoundOptions): SoundOptions {
		options = Object.assign(defaultOptions, options);
		if (!options.source || typeof options.source !== "string")
			throw "Source not assigned";

		if (
			typeof options.defaultVolume != "number" ||
			options.defaultVolume < 0 ||
			options.defaultVolume > 1
		)
			throw "defaultVolume was been number >=0 and <= 1";

		if (
			typeof options.clampVolume != "object" ||
			options.clampVolume.min === undefined ||
			options.clampVolume.max === undefined ||
			options.clampVolume.min < 0 ||
			options.clampVolume.max > 1 ||
			options.clampVolume.min > options.clampVolume.max
		)
			throw "clampVolume was been object {min:(>=0 and <=max), max:(<=1 and >=min)>}";

		if (typeof options.loop != "boolean")
			throw "loop was been boolean";

		const types = Object.values(Type);
		if (!options.type || typeof options.type !== "string" || types.indexOf(options.type) == -1)
			throw `type was been one from ${types.join(", ")}`;

		return options;
	}


	const sounds: Dict<Meta> = {};
	/**
	 * Register sound in system
	 * @param {string} uid - Unical ID for sound
	 * @param {SoundOptions} options - Options sound
	 */
	export function registerSound(uid: string, options: SoundOptions) {
		if (sounds.hasOwnProperty(uid)) throw new RangeError(`Sound "${uid}" was been registered.`);

		try {
			options = getSoundOptions(options);
		} catch (e) {
			if (typeof e == "string")
				throw new InvalidOptions(uid, e);
			else
				throw e
		}

		const sourceFile = new File(options.source);
		if (!sourceFile.exists())
			throw new java.io.FileNotFoundException(`File ${options.source} not found`);

		const size = sourceFile.length();
		if (size <= 0xFFFFF) {
			//soundpool
			const pool: android.media.SoundPool = null;

			sounds[uid] = {
				typePlayer: "pool",
				soundId: SoundPlayer.load(options.source),
				...options
			}
		} else {
			//mediaplayer
			sounds[uid] = {
				typePlayer: "player",
				file: sourceFile.getAbsolutePath(),
				...options
			}
		}
	}

	export function select(uid: string): SoundAPIPlayer {
		if (!sounds.hasOwnProperty(uid))
			throw new RangeError(`Sound "${uid}" not been registered.`);

		const sound = sounds[uid];
		if (isPoolMeta(sound)) {
			return new SoundPlayer(sound);
		} else {
			return new MediaPlayer(sound);
		}
	}
}

EXPORT("SoundAPI", SoundAPI);
