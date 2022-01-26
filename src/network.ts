/// <reference path="index.ts" />
namespace SoundAPINetwork {
	type DataFromServer<T> = T & { sender: number };


	class NetworkSoundPlayerMap {
		private players: Dict<Dict<SoundAPIPlayer>> = {};

		public getPlayer(sender: number, id: number): SoundAPIPlayer {
			if (!this.players.hasOwnProperty(sender))
				throw new RangeError("Unknown sender " + sender);
			if (!this.players[sender].hasOwnProperty(id))
				throw new RangeError(`Unknown player ${id} from sender ${sender}`);

			return this.players[sender][id];
		}

		public addPlayer(sender: number, id: number, player: SoundAPIPlayer): SoundAPIPlayer {
			if (!this.players.hasOwnProperty(sender))
				this.players[sender] = {};

			this.players[sender][id] = player;
			return this.players[sender][id];
		}

		public release() {
			for (const sender in this.players) {
				for (const playerID in this.players[sender]) {
					const player = this.players[sender][playerID];
					player.stop();
					delete this.players[sender][playerID];
				}
				delete this.players[sender];
			}
		}
	}

	export enum NetworkPacket {
		Play = "soundapi.play",
		Pause = "soundapi.pause",
		Stop = "soundapi.stop",
	}

	export interface SoundData {
		/* ID soundplayer */
		id: number;
	};
	export interface PlayData extends SoundData {
		uid: string;
		target: Target;
		distance: number;
		volume: number;
		loop: boolean;
	};


	const networkSoundPlayerMap = new NetworkSoundPlayerMap();
	Callback.addCallback("LevelLeft", networkSoundPlayerMap.release);

	Network.addServerPacket<PlayData>(NetworkPacket.Play, (client, data) => {
		const sender = client.getPlayerUid();
		Network.sendToAllClients<DataFromServer<PlayData>>(NetworkPacket.Play, {
			...data, sender
		});
	});

	Network.addServerPacket<SoundData>(NetworkPacket.Pause, (client, data) => {
		const sender = client.getPlayerUid();
		Network.sendToAllClients<DataFromServer<SoundData>>(NetworkPacket.Play, {
			...data, sender
		});
	});

	Network.addServerPacket<SoundData>(NetworkPacket.Stop, (client, data) => {
		const sender = client.getPlayerUid();
		Network.sendToAllClients<DataFromServer<SoundData>>(NetworkPacket.Play, {
			...data, sender
		});
	});

	Network.addClientPacket<DataFromServer<PlayData>>(NetworkPacket.Play, (data) => {
		if (data.sender == Player.get()) return;
		networkSoundPlayerMap.addPlayer(data.sender, data.id,
			SoundAPI.select(data.uid)
				.at(data.target)
				.distance(data.distance)
				.volume(data.volume)
				.loop(data.loop)
				.sync(false)
		).play();
	});

	Network.addClientPacket<DataFromServer<SoundData>>(NetworkPacket.Pause, (data) => {
		if (data.sender == Player.get()) return;
		networkSoundPlayerMap.getPlayer(data.sender, data.id).pause();
	});

	Network.addClientPacket<DataFromServer<SoundData>>(NetworkPacket.Stop, (data) => {
		if (data.sender == Player.get()) return;
		networkSoundPlayerMap.getPlayer(data.sender, data.id).stop();
	});
}
