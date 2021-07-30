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

    /**
     * 
     * @param volume - Initial volume
     * @param radius - The radius of the source's audibility
     * @param source - Coordinates of the sound source
     * @param listener - Pointer of the audio listener entity
     */
    export function calcVolume(volume: Volume, radius: number, source: Vector, listener?: number): Volume;
    /**
     * 
     * @param volume - Initial volume
     * @param radius - The radius of the source's audibility
     * @param source - Pointer of the audio source entity
     * @param listener - Pointer of the audio listener entity
     */
    export function calcVolume(volume: Volume, radius: number, source: number, listener?: number): Volume;
    export function calcVolume(volume: Volume, radius: number, source: number | Vector, listener: number = Player.get()): Volume {
        radius -= MIN_RADUIS;

        if (typeof source == "number")
            source = Entity.getPosition(source);

        const listenerPosition = Entity.getPosition(listener);

        const distance = Math.max(0, Vector.getDistance(source, listenerPosition) - MIN_RADUIS);
        const dVolume = Math.max(0, 1 - (distance / radius));
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
