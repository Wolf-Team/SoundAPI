/**
 * @alias MediaPlayer.register without exception
 * @param sid 
 * @param path 
 * @returns true if register, else false
 */
function tryRegister(sid: string, path: string): boolean {
    try {
        MediaPlayer.register(sid, path);
        return true;
    } catch (e) {
        return false;
    }
}
