function buildAudioAttributes(): android.media.AudioAttributes | false {
	if (android.os.Build.VERSION.SDK_INT < 21) return false;
	return new android.media.AudioAttributes.Builder()
		.setUsage(android.media.AudioAttributes.USAGE_GAME)
		.setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
		.build();
}
