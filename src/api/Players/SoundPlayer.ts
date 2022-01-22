// https://developer.android.com/reference/android/media/SoundPool

class SoundPlayer extends SoundAPIPlayer {
	private static SoundPool: android.media.SoundPool = null;
	private static initFunctions: Dict<(maxStreams: number) => android.media.SoundPool> = {
		21: function (maxStreams: number) {
			const AudioAttributesBuilder = new android.media.AudioAttributes.Builder();
			AudioAttributesBuilder.setUsage(android.media.AudioAttributes.USAGE_GAME)
			AudioAttributesBuilder.setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION);



			const SoundPoolBuilder = new android.media.SoundPool.Builder();
			SoundPoolBuilder.setMaxStreams(maxStreams);
			SoundPoolBuilder.setAudioAttributes(AudioAttributesBuilder.build());

			return SoundPoolBuilder.build();
		},
		1: function (maxStreams: number) {
			return new android.media.SoundPool(maxStreams, android.media.AudioManager.STREAM_MUSIC, 0);
		}
	}

	public static init(maxStreams: number) {
		if (this.SoundPool) return;
		let initFunction = 1;
		if (android.os.Build.VERSION.SDK_INT >= 21) initFunction = 21;
		this.SoundPool = this.initFunctions[initFunction](maxStreams);
	}

	public static load(file: string) {
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

SoundPlayer.init(__config__.getNumber("sound.maxStreams") || 10);
