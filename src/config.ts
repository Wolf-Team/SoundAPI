const CONFIG: { maxStreams: number } = (() => {
	const configFile = __packdir__ + "/innercore/config.json";
	const config = FileTools.ReadJSON(configFile);
	if (!config.hasOwnProperty("soundapi")) {
		config.soundapi = {
			maxStreams: 10
		}

		FileTools.WriteJSON(configFile, config, true);

		const configInfoFile = __packdir__ + "/assets/res/config.info.json";
		const configInfo = FileTools.ReadJSON(configInfoFile);
		configInfo.properties['soundapi'] = {
			name: {
				ru: "Настройки SoundAPI",
				en: "Settings SoundAPI"
			},
			collapsible: false
		}
		configInfo.properties['soundapi.maxStreams'] = {
			name: {
				ru: "Максимум потоков для SoundPool",
				en: "Maximum streams for SoundPool"
			},
			type: "SeekBar",
			min: 1,
			max: 50
		}
		FileTools.WriteJSON(configInfoFile, configInfo, true);
	}

	return config.soundapi;
})()
