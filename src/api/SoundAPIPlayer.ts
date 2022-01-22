interface Position extends Vector {
	dimension: number;
}
type Target = number | Position;
const MIN_RADIUS = 2;

abstract class SoundAPIPlayer {
	private static players: SoundAPIPlayer[] = [];
	public static tick() {
		this.players.forEach(player => player.tick());
	}

	protected target: Target = null;
	protected radius: number = 0;
	protected volumeModify: number = 1;

	constructor(protected readonly options: Meta) {
		this.volume(options.defaultVolume);
		SoundAPIPlayer.players.push(this);
	}


	public at(entity: number, radius: number): this;
	public at(position: Position, radius: number): this;
	public at(target: Target, radius: number): this;
	public at(target: Target, radius: number): this {
		this.target = target;
		this.radius = radius;
		return this;
	}

	public volume(volume: number): this {
		// if (volume < this.options.clampVolume.min || volume > this.options.clampVolume.max) {
		// 	throw new RangeError("Can't set volume because not in clamp");
		// }
		this.volumeModify = volume;
		return this;
	}

	public abstract prepare(): this;//?
	public abstract play(): void;
	public abstract pause(): void;
	public abstract stop(): void;

	public calcVolume(): number[] {
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
	public abstract tick(): void;
}

Callback.addCallback("tick", SoundAPIPlayer.tick)
