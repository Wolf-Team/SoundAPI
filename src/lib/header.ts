/*
  ____                        _     _     ____   ___ 
 / ___|  ___  _   _ _ __   __| |   / \   |  _ \ |_ _|
 \___ \ / _ \| | | | '_ \ / _` |  / _ \  | |_) | | | 
  ___) | (_) | |_| | | | | (_| | / ___ \ |  __/  | | 
 |____/ \___/ \__,_|_| |_|\__,_|/_/   \_\|_|    |___|
                                                                
    SoundAPI 3.0 ©WolfTeam ( https://vk.com/wolf___team )
 */
LIBRARY({
  name: "SoundAPI",
  version: 30,
  api: "CoreEngine",
  shared: true
});

const jSoundPool = android.media.SoundPool;
type jSoundPool = android.media.SoundPool;

const jMediaPlayer = android.media.MediaPlayer;
type jMediaPlayer = android.media.MediaPlayer;

const AudioAttributes = android.media.AudioAttributes;
const AudioManager = android.media.AudioManager;

const IC = this;
