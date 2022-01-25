# SoundAPI
![SoundAPI Dark Logo](git/dark.png#gh-dark-mode-only)
![SoundAPI Light Logo](git/light.png#gh-light-mode-only)

A mod-library for working with sound.

## Changelog
Read [Changelog.md](CHANGELOG.md)

## Usage

### Init
Write your launch file
```js
ModAPI.addAPICallback("SoundAPI", function (SoundAPI) {
	Launch({ SoundAPI: SoundAPI.init(MOD_ID) });
});
```
Where `MOD_ID` is the mod string code used to distinguish mods.

### Register Sound
To register a sound, the Sound.registerSound method is used.
```js
SoundAPI.registerSound("sound_name", {
	//Path to sound file
	source: __dir__ + "path/to/file.ogg",

	// The parameters below are standard values
	// Sound hearing distance
	defaultDistance: 16,
	//Default sound volume
	defaultVolume: 1,
	//Clamp sound volume
	clampVolume: {mix:0, max:1},
	//Set default mode looping
	loop: false,
	//Type sound. Used for setting volume from game settings.
	type: SoundAPI.Type.SOUND,
	//Sync player in multiplayer
	sync: true,
	//Mote sound in solid block
	muteInSolidBlock: false
});
```
To register a sound with standard settings, instead of options, you can specify the path to the file.
```js
SoundAPI.registerSound("sound_name", __dir__ + "path/to/file.ogg");
```

### Play sound
```js
SoundAPI.select("sound_name")
	// Set source sound in coordinates
	.at({ x:1, y:1, z:1, dimension:Player.getDimension() }) 
	// Set source sound in entity
	.at(Player.get()) 
	// Set the distance to be different from the standard distance specified during registration
	.distance(5)
	// Set the volume to be different from the standard volume specified during registration
	.volume(.5)
	// Set the loop mode to be different from the standard loop mode specified during registration
	.loop(false)
	// Disable multiplayer sync
	.sync(false)
	// Play sound
	.play()
```

### Demo
[Demo SoundAPI](https://github.com/Wolf-Team/Demo-SoundAPI)

## Older versions:
* [SoundAPI v2.3](https://github.com/Wolf-Team/Libraries/blob/master/SoundAPI.js)
* [SoundAPI v2.2](https://github.com/Wolf-Team/Libraries/blob/60a1247edc14fabfb3cc1c01dc3fe52ab398acd1/SoundAPI.js)
* [SoundAPI v2.1](https://github.com/Wolf-Team/Libraries/blob/d4542eee83422197f21e5c333d6737ee2319b4c0/SoundAPI.js)
* [SoundAPI v2.0](https://github.com/Wolf-Team/Libraries/blob/887d38ee300a609825efaf18a974f9df00710cf2/SoundAPI.js)
* [SoundAPI v1.0](https://github.com/Wolf-Team/Libraries/blob/65e5ccc82be93dd8f6909e8686457c838b361027/SoundAPI.js)
