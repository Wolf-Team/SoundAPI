/**
 * Don't export namespace
 */
namespace Utils {
    const cacheDurstion: Dict<number> = {}
    function readDuration(file: string) {
        const mmr = new android.media.MediaMetadataRetriever();
        mmr.setDataSource(file);
        const duration = parseInt(mmr.extractMetadata(android.media.MediaMetadataRetriever.METADATA_KEY_DURATION));
        return duration;
    }

    export function getDuration(file: string, ignoreCahce: boolean = false) {
        if (ignoreCahce || !cacheDurstion.hasOwnProperty(file))
            cacheDurstion[file] = readDuration(file);

        return cacheDurstion[file];
    }
    export function inWorld() {
        return World.isWorldLoaded() || Network.inRemoteWorld();
    }
}
