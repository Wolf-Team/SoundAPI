/// <reference path="./SoundAPIPlayer.ts" />
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


	protected streamId: number = 0;
	protected get SoundPool() {
		return SoundPlayer.SoundPool
	};
	protected options: PoolMeta;

	protected _play(): void {
		const volume = this.calcVolume();
		this.streamId = this.SoundPool.play(
			this.options.soundId,
			volume.left,
			volume.right,
			0,
			this.looped ? -1 : 0,
			1
		)
	}
	protected _resume(): void {
		const volume = this.calcVolume();
		this.SoundPool.setVolume(this.streamId, volume[0], volume[1]);
		this.SoundPool.resume(this.streamId);
	}
	protected _pause(): void {
		this.SoundPool.pause(this.streamId);
	}
	protected _stop(): void {
		this.SoundPool.stop(this.streamId);
	}

	protected _tick(volume: Volume): void {
		if (this.streamId)
			this.SoundPool.setVolume(this.streamId, volume.left, volume.right);
	}
}

SoundPlayer.init();
