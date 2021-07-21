IMPORT("SoundAPI");
const folder = __dir__ + "/sounds/";
const MediaPlayer = SoundAPI.MediaPlayer;
MediaPlayer.register("soundapitest.music", folder + "LikeMe.mp3");

const player = new MediaPlayer();
player.setVolume(.5);
player.play("soundapitest.music");

const pool = SoundAPI.SoundPool.init(10, {
    content_type: android.media.AudioAttributes.CONTENT_TYPE_MUSIC
});
pool.register("soundapitest.shoot", folder + "shoot_1.ogg");
pool.register("soundapitest.sound", folder + "sound_1.ogg");

Callback.addCallback("LevelDisplayed", () => {
    player.stop();
    pool.play("soundapitest.sound");
});

Callback.addCallback("LevelLeft", () => {
    player.play();
});

Callback.addCallback("ItemUseLocalServer", () => {
    pool.play("soundapitest.shoot");
});
