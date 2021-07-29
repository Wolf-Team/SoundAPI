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

    export function getVolume(volume: Volume, radius: number, sourcePosition: Vector, listenerPosition: Vector): Volume {
        radius -= MIN_RADUIS;
        const distance = Vector.getDistance(sourcePosition, listenerPosition) - MIN_RADUIS;
        const dVolume = distance / radius;
        return { left: volume.left * dVolume, right: volume.right * dVolume };
    }

    export function getMusicVolume(volumePlayer: number): Volume {
        const volume = Volume.getMusicVolume() * volumePlayer;
        return { left: volume, right: volume };
    }
    export function getSoundVolume(volumePlayer: number): Volume {
        const volume = Volume.getSoundVolume() * volumePlayer;
        return { left: volume, right: volume };
    }
}
