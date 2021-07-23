IMPORT("SoundAPI");
const folder = __dir__ + "/sounds/";
const MediaPlayer = SoundAPI.MediaPlayer;
MediaPlayer.register("soundapitest.music", folder + "LikeMe.mp3");

// const player = new MediaPlayer();
// player.setVolume(.5);
// // player.play("soundapitest.music");

// // const pool = SoundAPI.SoundPool.init(10, {
// //     content_type: android.media.AudioAttributes.CONTENT_TYPE_MUSIC
// // });
// // pool.register("soundapitest.shoot", folder + "shoot_1.ogg");
// // pool.register("soundapitest.sound", folder + "sound_1.ogg");

// Callback.addCallback("LevelDisplayed", () => {
//     // player.stop();
//     // pool.play("soundapitest.sound");
// });

// // Callback.addCallback("LevelLeft", () => {
// //     player.play();
// // });

// // Callback.addCallback("ItemUseLocalServer", () => {
// //     pool.play("soundapitest.shoot");
// // // });
// function _alert(msg) {
//     alert(msg);
//     Logger.Log(msg, "SoundAPI][NE")
// }
// // Callback.addCallback("ItemUse", function () {
// //     const ne = new NetworkEntity(net, [3]);
// //     Updatable.addUpdatable({
// //         update: function () {
// //             ne.refreshClients();
// //         }
// //     });
// //     _alert("ItemUse");
// // })
// Callback.addCallback("LocalTick", function () {
//     Game.tipMessage("" + World.getWorldTime())
// })
var player: SoundAPI.NetworkMediaPlayer;
var __inited = false;
Callback.addCallback("tick", () => {
    if (!__inited) {
        __inited = true;
        player = new SoundAPI.NetworkMediaPlayer({
            position: Player.getPosition(),
            dimension: Player.getDimension()
        }, 5);
        player.init();
    }
});

Callback.addCallback("ItemUse", () => {
    switch (player.getState()) {
        case SoundAPI.PlayerState.STOP:
            player.play("soundapitest.music");
            break;
        case SoundAPI.PlayerState.PAUSE:
            player.play();
            break;
        case SoundAPI.PlayerState.PLAY:
            player.pause();
            break;
    }
})

Callback.addCallback("LevelLeft", () => player.destroy());

Callback.addCallback("ItemUseLocalServer", function (coords, item, block, player) {
    alert(World.isWorldLoaded());
})
