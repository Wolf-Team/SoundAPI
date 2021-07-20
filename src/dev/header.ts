IMPORT("SoundAPI");
const MediaPlayer = SoundAPI.MediaPlayer;
MediaPlayer.register("soundapitest.music", __dir__ + "/sounds/LikeMe.mp3");

const player = new MediaPlayer();
player.setVolume(.5);
player.play("soundapitest.music");
