MediaPlayer.register("soundapitest.music", folder + "LikeMe.mp3");
(() => {
    const player = new MediaPlayer();
    player.play("soundapitest.music");

    Callback.addCallback("LevelDisplayed", () => {
        player.stop();
    });

    Callback.addCallback("LevelLeft", () => {
        player.play();
    });
})()
