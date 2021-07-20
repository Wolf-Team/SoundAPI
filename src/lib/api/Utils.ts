namespace SoundAPI.Utils {
    export interface Volume {
        left: number;
        right: number;
    }
    export function getVolume(): Volume {
        return { left: 1, right: 1 };
    }
}
