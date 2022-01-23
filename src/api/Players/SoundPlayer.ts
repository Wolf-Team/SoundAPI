// https://developer.android.com/reference/android/media/SoundPool

class SoundPlayer extends SoundAPIPlayer {
	private static SoundPool: android.media.SoundPool = null;
	private static initFunctions: Dict<(maxStreams: number) => android.media.SoundPool> = {
		21: function (maxStreams: number) {
			const SoundPoolBuilder = new android.media.SoundPool.Builder();
			SoundPoolBuilder.setMaxStreams(maxStreams);
			SoundPoolBuilder.setAudioAttributes(buildAudioAttributes());

			return SoundPoolBuilder.build();
		},
		1: function (maxStreams: number) {
			return new android.media.SoundPool(maxStreams, android.media.AudioManager.STREAM_MUSIC, 0);
		}
	}

	private static getMaxStreams(): number {
		const maxStreams = __config__.getNumber("sound.maxStreams");
		if (maxStreams <= 0) return 10;
	}
	public static init(): void {
		if (this.SoundPool) return;
		let initFunction = 1;
		if (android.os.Build.VERSION.SDK_INT >= 21) initFunction = 21;
		this.SoundPool = this.initFunctions[initFunction](this.getMaxStreams());
	}

	public static load(file: string): number {
		return this.SoundPool.load(file, 0)
	}


	private streamId: number;
	protected options: PoolMeta;

	protected _play(): void {
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
	protected _resume(): void {
		const volume = this.calcVolume();
		SoundPlayer.SoundPool.setVolume(this.streamId, volume[0], volume[1]);
		SoundPlayer.SoundPool.resume(this.streamId);
	}
	protected _pause(): void {
		SoundPlayer.SoundPool.pause(this.streamId);
	}
	protected _stop(): void {
		SoundPlayer.SoundPool.stop(this.streamId);
	}

	protected _tick(leftVolume: number, rightVolume: number): void {
		SoundPlayer.SoundPool.setVolume(this.streamId, leftVolume, rightVolume);
	}
}

SoundPlayer.init();
