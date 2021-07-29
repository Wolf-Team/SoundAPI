namespace Utils {
    export namespace Volume {
        const settings_path = FileTools.root + "/games/com.mojang/minecraftpe/options.txt";

        let SoundVolume: number = 1;
        let MusicVolume: number = 1;
        function resetMCPEVolume() {
            const settings = FileTools.ReadKeyValueFile(settings_path);
            const GlobalVolume = parseFloat(settings["audio_main"]);
            SoundVolume = parseFloat(settings['audio_sound']) * GlobalVolume;
            MusicVolume = parseFloat(settings['audio_music']) * GlobalVolume;
            alert(`reset: ${SoundVolume} | ${MusicVolume}`);
        }
        resetMCPEVolume();


        const watcher = new FileWatcherModify(settings_path);
        watcher.setOnEvent(resetMCPEVolume);
        watcher.start();

        export function getSoundVolume() {
            return SoundVolume;
        }

        export function getMusicVolume() {
            return MusicVolume;
        }
    }
    export interface Volume {
        left: number;
        right: number;
    }

    export function getVolume(volume: number) {
        return { left: volume, right: volume };
    }

    export function getMusicVolume(volumePlayer: number) {
        return getVolume(Volume.getMusicVolume() * volumePlayer);
    }
    export function getSoundVolume(volumePlayer: number): Volume {
        return getVolume(Volume.getSoundVolume() * volumePlayer);
    }
}
