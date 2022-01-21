interface Vector {
	x: number;
	y: number;
	z: number;
}
namespace Player {
	export function get(): number {
		return 0;
	}
}


interface Position extends Vector {
	dimension: number;
}

type Target = number | Position;

class Sound {

	public static getPool(type: Sound.Type): Sound { return };

	public registerSound(uid: string, path: string, priority: number): void { };
	/* play sound for only current client */
	public playSoundInClient(uid: string, target: Target = Player.get()): void { };
	/* Play sound for all players */
	public playSound(uid: string, target: Target = Player.get()): void { };

	public createPlayerForClient(uid: string, target: Target = Player.get()): SoundPlayer { return };
	public createPlayer(uid: string, target: Target = Player.get()): SoundPlayer { return };
}

namespace Sound {
	export enum Type {
		MAIN, MUSIC, SOUND, AMBIENT, // и тд
	};
}

interface SoundPlayer {
	looped(looped: boolean): this;
	setVolume(right: number, left: number): this; //mg (left, right)
	setTarget(target: Target): this;

	play(): this;
	pause(): this;
	stop(): this;
}
