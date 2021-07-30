(() => {
    const pool = SoundPool.init(10);
    pool.register("soundapitest.shoot", folder + "shoot_1.ogg");

    Callback.addCallback("ItemUseLocalServer", (coords) => {
        const player = pool.getPlayer("soundapitest.shoot");
        player.attachToCoord(coords, Player.getDimension());
        player.play();
    });
})()
