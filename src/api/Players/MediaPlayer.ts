/// <reference path="./SoundAPIPlayer.ts" />
// https://developer.android.com/reference/android/media/MediaPlayer

class MediaPlayer extends SoundAPIPlayer {

	protected options: MediaMeta;
	protected media = new android.media.MediaPlayer();

	protected _prepare(): void {
		const attributes = buildAudioAttributes();
		if (attributes)
			this.media.setAudioAttributes(attributes);
		this.media.setDataSource(this.options.file);
		this.media.prepare();
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
