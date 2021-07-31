(() => {
    const pool = NetworkSoundPool.register("testsoundapi.pool", 10);
    pool.register("soundapitest.shoot", folder + "shoot_1.ogg");

    Callback.addCallback("ItemUse", (coords, item, block, isExternal, playerId) => {
        const player = pool.getPlayer("soundapitest.shoot");
        player.attachToCoord(coords, Player.getDimension());
        player.init();
        player.play();
    });
})()
