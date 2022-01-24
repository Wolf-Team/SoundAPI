/// <reference path="SoundAPI.ts" />

interface SoundAPI {
	registerSound(uid: string, options: SoundOptions): void;
	select(uid: string): SoundAPIPlayer;
}
namespace ModAPI {
	export declare function addAPICallback(apiName: "SoundAPI", callback: (api: SoundAPI) => void): void;
}
