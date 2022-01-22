/// <reference path="./SoundAPIPlayer.ts" />
// https://developer.android.com/reference/android/media/MediaPlayer

class MediaPlayer extends SoundAPIPlayer {

	protected options: MediaMeta;
	protected media: android.media.MediaPlayer;

	constructor(options: MediaMeta) {
		super(options);
		this.media = new android.media.MediaPlayer();
		this.media.setDataSource(options.file);
	}
	protected _prepare(): this {
		this.media.prepare();
		return super.prepare();
	}
	protected _play(): void {
		const volume = this.calcVolume();
		this.media.setVolume(volume[0], volume[1]);
		this.media.start();
	}
	protected _resume(): void {
		this._play();
	}
	protected _pause(): void {
		this.media.pause();
	}
	protected _stop(): void {
		this.media.stop();
	}
	protected _tick(leftVolume: number, rightVolume: number): void {
		this.media.setVolume(leftVolume, rightVolume);
	}

}
