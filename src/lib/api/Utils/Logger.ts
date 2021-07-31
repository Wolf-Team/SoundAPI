/**
 * Don't export namespace
 */
namespace Utils.Logger {
    const TAG = "SoundAPI";

    export function Log(message: string, tag?: string) {
        if (!tag)
            tag = TAG;
        else
            tag = TAG + "][" + tag;

        IC.Logger.Log(message, tag);
    }

    export function LogA(message: string, tag?: string) {
        Log(message, tag);
        if (Game.isDeveloperMode) alert(message);
    }
}
