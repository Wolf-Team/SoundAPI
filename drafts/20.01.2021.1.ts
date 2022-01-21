const SoundPool: any = null;
const MediaPlyer: any = null;

/** SoundPool */
const pool = SoundPool.getPool("poolName");
pool.registerSound("uid", "path"); // Register sound for multiplayer
pool.playSound("path");// -> play sound from path
pool.playSoundFromUId("uid");// -> play sound from UID
pool.playSoundForAll("uid");// -> play sound and send Network Packet

/* MediaPlayer */
const player = MediaPlyer.get("uid"); // UID - used for multiplayer connect
player.registerSound("uid", "path"); // Register sound for multiplayer
player.playSound("path");// -> play sound from path
player.playSoundFromUId("uid");// -> play sound from UID
player.playSoundForAll("uid");// -> play sound and send Network Packet
