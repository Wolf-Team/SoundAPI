/// <reference path="index.ts" />
namespace SoundAPINetwork {
	type DataFromServer<T> = T & { sender: number };


	class NetworkSoundPlayerMap {
		private players: Dict<Dict<SoundAPIPlayer>> = {};

		public getPlayer(sender: number, id: number) {

		}

		public addPlayer(sender: number, id: number, player: SoundAPIPlayer) {
			if (!this.players.hasOwnProperty(sender))
				this.players[sender] = {};

			this.players[sender][id] = player;
			return this.players[sender][id];
		}

		public release() {
			for (const sender in this.players)
				for (const playerID in this.players[sender]) {
					const player = this.players[sender][playerID];
					player.stop();
				}
		}
	}

	export enum NetworkPacket {
		Play = "soundapi.play"
	}

	export interface PlayData {
		/* ID soundplayer */
		id: number;

		uid: string;
		target: Target;
		distance: number;
		volume: number;
		loop: boolean;
	};

	let networkSoundPlayerMap = new NetworkSoundPlayerMap();

	Network.addServerPacket<PlayData>(NetworkPacket.Play, (client, data) => {
		const sender = client.getPlayerUid();

		alert(`[Server] Receive from ${sender}: ${JSON.stringify(data)}`);

		Network.sendToAllClients<DataFromServer<PlayData>>(NetworkPacket.Play, {
			...data, sender
		});
	});

	Network.addClientPacket<DataFromServer<PlayData>>(NetworkPacket.Play, (data) => {
		alert(`[Client] Receive from Server: ${JSON.stringify(data)}`);
		alert(`[Client] ${data.sender} == ${Player.get()}`);

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
}
