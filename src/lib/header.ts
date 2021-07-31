/*
  ____                        _     _     ____   ___ 
 / ___|  ___  _   _ _ __   __| |   / \   |  _ \ |_ _|
 \___ \ / _ \| | | | '_ \ / _` |  / _ \  | |_) | | | 
  ___) | (_) | |_| | | | | (_| | / ___ \ |  __/  | | 
 |____/ \___/ \__,_|_| |_|\__,_|/_/   \_\|_|    |___|
                                                                
    SoundAPI 3.0 ©WolfTeam ( https://vk.com/wolf___team )
    GitHub: https://github.com/Wolf-Team/SoundAPI
*/
LIBRARY({
    name: "SoundAPI",
    version: 30,
    api: "CoreEngine",
    shared: true
});


const IC = this;

const MIN_RADUIS = 2;
const DEFAULT_RADIUS = 5;
EXPORT("DEFAULT_RADIUS", DEFAULT_RADIUS);
interface SoundAPIConfig {
    experementalCalculateVolume: boolean
}

function getConfig(): SoundAPIConfig {
    const dir = __packdir__ + "SoundAPI";
    const file = dir + "/config.json";

    if (FileTools.isExists(file))
        return FileTools.ReadJSON(file);

    if (!FileTools.isExists(dir)) FileTools.mkdir(dir);

    const defaultConfig: SoundAPIConfig = {
        experementalCalculateVolume: false
    };
    FileTools.WriteJSON(file, defaultConfig, true);
    return defaultConfig;
}

const config = getConfig();

function exportModule(constructor: Function) {
    alert("exportModule:" + constructor.name);
    EXPORT(constructor.name, constructor);
}
