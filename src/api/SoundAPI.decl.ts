/// <reference path="SoundAPI.ts" />

declare namespace SoundAPI {
	function registerSound(uid: string, options: SoundOptions): void;
	function select(uid: string): SoundAPIPlayer;
}
namespace ModAPI {
	export declare function addAPICallback(apiName: "SoundAPI", callback: (api: SoundAPI) => void): void;
}
