/* MediaPlayer.register */
tryRegister("soundapitest.music", folder + "LikeMe.mp3");

(() => {
    var player: NetworkMediaPlayer;
    var __inited = false;
    Callback.addCallback("tick", () => {
        if (!__inited) {
            __inited = true;
            player = new NetworkMediaPlayer({
                position: Player.getPosition(),
                dimension: Player.getDimension()
            }, 5);
            player.init();
        }
    });

    Callback.addCallback("ItemUse", (coords, item) => {
        if (item.id != 280) return;
        switch (player.getState()) {
            case PlayerState.STOP:
                player.play("soundapitest.music");
                break;
            case PlayerState.PAUSE:
                player.play();
                break;
            case PlayerState.PLAY:
                player.pause();
                break;
        }

    })
})()
