interface Position extends Vector {
	dimension: number;
}
type Target = number | Position;
const MIN_RADIUS = 2;

abstract class SoundAPIPlayer {
	private static players: SoundAPIPlayer[] = [];

	public static tick() {
		SoundAPIPlayer.players.forEach(player => player.tick());
	}

	protected target: Target = null;
	protected _distance: number = 16;
	protected _volume: number = 1;
	protected _loop: boolean = false;
	public get looped() {
		return this._loop;
	}
	private prepared: boolean = false;
	private paused: boolean = false;

	constructor(protected readonly options: Meta) {
		SoundAPIPlayer.players.push(this);

		this.volume(options.defaultVolume)
			.loop(options.loop)
			.distance(options.defaultDistance);
	}

	/**
	 * Set source at entity
	 * @param {number} entity - UID entity
	 * @returns {this} this player
	 */
	public at(entity: number): this;
	/**
	 * Set source at coordinates in dimension
	 * @param {Position} position - Coordinates with dimension
	 * @returns {this} this player
	 */
	public at(position: Position): this;
	/**
	 * Set source at entity or coordinates indimension
	 * @param {Target} target - UID entity or Coordinates with dimension
	 * @returns {this} this player
	 */
	public at(target: Target): this;
	public at(target: Target): this {
		if (this.prepared) throw new ReferenceError("Player was prepared.")
		this.target = target;
		return this;
	}

	/**
	 * Set sound distance
	 * @param {number} dist - sound distance
	 * @returns {this} this player
	 */
	public distance(dist: number): this {
		if (this.prepared) throw new ReferenceError("Player was prepared.");
		this._distance = dist;
		return this;
	}

	/**
	 * Set volume for player
	 * @param {number} volume - volume >= 0 and <= 1
	 * @returns {this} this player
	 */
	public volume(volume: number): this {
		if (this.prepared) throw new ReferenceError("Player was prepared.")
		if (volume > 1 || volume < 0) throw new RangeError("volume mast be >= 0 and <= 1.");

		// if (volume < this.options.clampVolume.min || volume > this.options.clampVolume.max) {
		// 	throw new RangeError("Can't set volume because not in clamp");
		// }
		this._volume = volume;
		return this;
	}
	/**
	 * Set looping
	 * @param {boolean} looping - if true, enables playback looping, otherwise disables.
	 * @returns {this} this player
	 */
	public loop(looping: boolean = true): this {
		if (this.prepared) throw new ReferenceError("Player was prepared.")
		this._loop = looping;
		return this;
	}

	protected _prepare(): void { };
	/**
	 * Prepare player.
	 */
	public prepare(): this {
		if (this.prepared) return this;
		this.prepared = true;
		this._prepare();
		return this;
	}

	protected abstract _play(): void;
	protected abstract _resume(): void;
	protected abstract _pause(): void;
	protected abstract _stop(): void;

	/**
	 * Start playing sound.
	 */
	public play(): void {
		if (!this.prepared)
			this.prepare();

		if (this.paused)
			this.resume();
		else
			this._play();
	}
	/**
	 * Pause playing sound.
	 */
	public pause(): void {
		if (!this.prepared || this.paused) return;
		this.paused = true;
		this._pause();
	}
	/**
	 * Resume playing sound.
	 */
	public resume() {
		if (!this.paused) return;
		this.paused = false;
		this._resume();
	}
	/**
	 * Stop playing sound.
	 */
	public stop(): void {
		if (!this.prepared) return;
		this.prepared = false;
		this.paused = false;
		this._stop();
	}

	protected calcVolume(): number[] {
		const volume = [1, 1];
		if (!this.target)
			return volume.map(e => e * this._volume);

		const source: Position = typeof this.target == "number" ? {
			...Entity.getPosition(this.target),
			dimension: Entity.getDimension(this.target)
		} : this.target;

		if (source.dimension != Player.getDimension())
			return [0, 0];

		const listenerVector = Player.getPosition();

		const distance = Math.max(0, Vector.getDistance(source, listenerVector));
		const dVolume = Math.max(0, 1 - (distance / this._distance));
		return volume.map(e => e * dVolume * this._volume);
	}

	protected abstract _tick(leftVolume: number, rightVolume: number);
	private tick(): void {
		if (!this.prepared || this.paused) return;
		const volume = this.calcVolume();
		this._tick(volume[0], volume[1]);
	}
}

Callback.addCallback("tick", SoundAPIPlayer.tick)
