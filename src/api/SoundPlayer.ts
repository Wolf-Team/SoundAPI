// https://developer.android.com/reference/android/media/SoundPool

class SoundPlayer extends SoundAPIPlayer {
	private static SoundPool: android.media.SoundPool = null;
	public static init() {
		if (this.SoundPool) return;
	}
	public static load(file: string) {
		return this.SoundPool.load(file, 0)
	}


	private streamId: number;
	protected options: PoolMeta;
	constructor(options: PoolMeta) {
		super(options);
	}

	public prepare(): this {
		return this;
	}
	public play(): void {
		const volume = this.calcVolume();
		this.streamId = SoundPlayer.SoundPool.play(
			this.options.soundId,
			volume[0],
			volume[1],
			0,
			this.options.loop ? -1 : 0,
			1
		)
	}
	public pause(): void {
		SoundPlayer.SoundPool.pause(this.streamId);
	}
	public stop(): void {
		SoundPlayer.SoundPool.stop(this.streamId);
	}

	public tick(): void {
		const volume = this.calcVolume();
		SoundPlayer.SoundPool.setVolume(this.streamId, volume[0], volume[1]);
	}
}
SoundPlayer.init();
