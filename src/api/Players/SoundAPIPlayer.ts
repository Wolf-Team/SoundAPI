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
	protected radius: number = 0;
	protected volumeModify: number = 1;
	private prepared: boolean = false;
	private paused: boolean = false;

	constructor(protected readonly options: Meta) {
		this.volume(options.defaultVolume);
		SoundAPIPlayer.players.push(this);
	}


	public at(entity: number, radius: number): this;
	public at(position: Position, radius: number): this;
	public at(target: Target, radius: number): this;
	public at(target: Target, radius: number): this {
		if (this.prepared) throw new ReferenceError("Player was prepared.")
		this.target = target;
		this.radius = radius;
		return this;
	}

	public volume(volume: number): this {
		if (this.prepared) throw new ReferenceError("Player was prepared.")
		// if (volume < this.options.clampVolume.min || volume > this.options.clampVolume.max) {
		// 	throw new RangeError("Can't set volume because not in clamp");
		// }
		this.volumeModify = volume;
		return this;
	}

	protected _prepare(): void { };
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

	public play(): void {
		if (!this.prepared)
			this.prepare();

		if (this.paused)
			this._resume();
		else
			this._play();
	}
	public pause(): void {
		this.paused = true;

	}
	public stop(): void {
		this.prepared = false;
		this.paused = false;
		this._stop();
	}

	protected calcVolume(): number[] {
		const volume = [1, 1];
		if (!this.target)
			return volume.map(e => e * this.volumeModify);

		const source: Position = typeof this.target == "number" ? {
			...Entity.getPosition(this.target),
			dimension: Entity.getDimension(this.target)
		} : this.target;

		if (source.dimension != Player.getDimension())
			return [0, 0];

		const listenerVector = Player.getPosition();

		const distance = Math.max(0, Vector.getDistance(source, listenerVector) - MIN_RADIUS);
		const dVolume = Math.max(0, 1 - (distance / this.radius));
		return volume.map(e => e * dVolume * this.volumeModify);
	}

	protected abstract _tick(leftVolume: number, rightVolume: number);
	public tick(): void {
		if (this.paused) return;
		const volume = this.calcVolume();
		this._tick(volume[0], volume[1]);
	}
}

Callback.addCallback("tick", SoundAPIPlayer.tick)
