const CONFIG: { maxStreams: number, forceOneChannel: boolean } = (() => {
	const configFile = __packdir__ + "/innercore/config.json";
	const config = FileTools.ReadJSON(configFile);

	if (config.hasOwnProperty("soundapi")) {
		if (config.soundapi.hasOwnProperty("maxStreams") &&
			config.soundapi.hasOwnProperty("forceOneChannel")
		)
			return config.soundapi;

		config.soundapi = {
			maxStreams: 10,
			forceOneChannel: false,
			...config.soundapi
		}
	} else {
		config.soundapi = {
			maxStreams: 10,
			forceOneChannel: false
		}
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
	configInfo.properties['soundapi.forceOneChannel'] = {
		name: {
			ru: "Принудительно расчитывать громкость для одного канала",
			en: "Forcibly calculate the volume for one channel"
		}
	}
	FileTools.WriteJSON(configInfoFile, configInfo, true);

	return config.soundapi;
})()
