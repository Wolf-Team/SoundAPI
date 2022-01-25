interface Position extends Vector {
	dimension: number;
}
type Target = number | Position;
const MIN_RADIUS = 2;
interface Volume {
	left: number;
	right: number;
}
abstract class SoundAPIPlayer {
	private static players: SoundAPIPlayer[] = [];

	public static tick() {
		SoundAPIPlayer.players.forEach(player => player.tick());
	}
	private static networkId = 1;
	protected networkId: number = 0;
	protected source: Target = null;
	protected _distance: number = 16;
	protected _volume: number = 1;
	protected _sync: boolean = true;
	protected _loop: boolean = false;
	public get looped() {
		return this._loop;
	}
	private prepared: boolean = false;
	private paused: boolean = false;

	constructor(protected readonly uid: string, protected readonly options: Meta) {
		SoundAPIPlayer.players.push(this);
		this.volume(options.defaultVolume)
			.loop(options.loop)
			.sync(options.sync)
			.distance(options.defaultDistance);
	}

	/**
	 * Enable sync player in multiplayer
	 * @returns {this} this player
	 */
	public sync(): this;
	/**
	 * Disable sync player in multiplayer
	 * @returns {this} this player
	 */
	public sync(sync: false): this;

	/**
	 * Enable/disable sync player in multiplayer
	 * @returns {this} this player
	 */
	public sync(sync: boolean): this;
	public sync(sync: boolean = true): this {
		if (this.prepared) throw new ReferenceError("Player was prepared.")
		this._sync = sync;
		if (this.networkId == 0)
			this.networkId = SoundAPIPlayer.networkId++;
		return this;
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
		this.source = target;
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

		this.send<SoundAPINetwork.PlayData>(SoundAPINetwork.NetworkPacket.Play, {
			id: this.networkId,
			uid: this.uid,
			loop: this._loop,
			volume: this._volume,
			distance: this._distance,
			target: this.source
		});

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

		this.send<SoundAPINetwork.SoundData>(SoundAPINetwork.NetworkPacket.Pause, {
			id: this.networkId
		});

		this.paused = true;
		this._pause();
	}
	/**
	 * Resume playing sound.
	 */
	private resume() {
		if (!this.paused) return;
		this.paused = false;
		this._resume();
	}
	/**
	 * Stop playing sound.
	 */
	public stop(): void {
		if (!this.prepared) return;

		this.send<SoundAPINetwork.SoundData>(SoundAPINetwork.NetworkPacket.Stop, {
			id: this.networkId
		});

		this.prepared = false;
		this.paused = false;
		this._stop();
	}

	protected simpleCalc(sourcePosition: Vector, listenerPosition: Vector, multiplyVolume: number): number {
		const distance = Math.max(0, Vector.getDistance(sourcePosition, listenerPosition));
		const dVolume = Math.max(0, 1 - (distance / this._distance));
		const volume = dVolume * multiplyVolume;
		return volume;
	}

	protected advancedCalc(sourcePosition: Vector, listenerPosition: Vector, lookVector: Vector, multiplyVolume: number): Volume {
		//https://stackoverflow.com/questions/41518021
		let angle = Math.atan2(sourcePosition.z - listenerPosition.z, sourcePosition.x - listenerPosition.x) - Math.atan2(lookVector.z, lookVector.x);
		if (angle > Math.PI) angle -= 2 * Math.PI;
		else if (angle < -Math.PI) angle += 2 * Math.PI;


		const x = angle / Math.PI;
		let k = Math.sqrt(0.25 - Math.pow(Math.abs(x) - 0.5, 2));
		if (x < 0) k *= -1;

		const left = .75 - .5 * k;
		const right = .75 + .5 * k;

		const volume = this.simpleCalc(sourcePosition, listenerPosition, multiplyVolume);

		return { left: left * volume, right: right * volume };
	}

	protected calcVolume(): Volume {
		const multiplyVolume = this._volume
			* parseFloat(SettingsManager.getSetting("audio_" + this.options.type))
			* parseFloat(SettingsManager.getSetting("audio_main"));

		if (!this.source) return { left: multiplyVolume, right: multiplyVolume }


		const sourceDimension = typeof this.source == "number" ? Entity.getDimension(this.source) : this.source.dimension;
		if (sourceDimension != Player.getDimension()) return { left: 0, right: 0 };

		const sourcePosition = typeof this.source == "number" ? Entity.getPosition(this.source) : this.source;
		const listenerPosition = Player.getPosition();

		// const volume = this.simpleCalc(position, listenerPosition, multiplyVolume);
		// return { left: volume, right: volume };

		const listenerLookVector = Entity.getLookVector(Player.get());
		return this.advancedCalc(sourcePosition, listenerPosition, listenerLookVector, multiplyVolume);
	}

	protected abstract _tick(volume: Volume): void;
	private tick(): void {
		if (!this.prepared || this.paused) return;
		this._tick(this.calcVolume());
	}

	protected send<D>(packet: SoundAPINetwork.NetworkPacket, data: D) {
		if (this._sync && (World.isWorldLoaded() || Network.inRemoteWorld()))
			Network.sendToServer<D>(packet, data)
	}
}

Callback.addCallback("tick", SoundAPIPlayer.tick)
