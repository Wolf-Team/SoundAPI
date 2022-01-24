/// <reference path="./SoundAPIPlayer.ts" />
// https://developer.android.com/reference/android/media/MediaPlayer

class MediaPlayer extends SoundAPIPlayer {

	protected options: MediaMeta;
	protected media: android.media.MediaPlayer = null;

	protected _prepare(): void {
		this.media = new android.media.MediaPlayer();
		const attributes = buildAudioAttributes();
		if (attributes)
			this.media.setAudioAttributes(attributes);
		this.media.setDataSource(this.options.source);
		this.media.setLooping(this.looped);
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
		this.media.release();
		this.media = null;
	}
	protected _tick(volume: Volume): void {
		this.media.setVolume(volume.left, volume.right);
	}

}
