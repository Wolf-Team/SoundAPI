SoundAPI.registerSound("start", {
	source: "path/to/file.mp3",
	effects: bool,
	loop: bool, // зацикливание
	defaultVolume: 0.6, // модификатор громкости по умолчанию

	muteInSolidBlock: bool, // заглушает звуки, проигрываемые в твёрдых блоках
})

SoundAPI.registerPhases("phases", {
	start: "start",
	loop: "loop",
	end: "end"
})

type WorldPos = {
	x, y, z, dimension
}

let sound = SoundAPI.select("sound")
	.at(entity | WorldPos) // привязывает позицию проигрывания звука к сущности или координатам
	.volume(0.6) // устанавливает текущую громкость, если звук ambient, а если он позиционный - указывает модификатор громкости
	.clampVolume(0.1, 0.5) // ограничивает громкость указанными пределами, можно перенести в регистрацию
	.withEffects(Effects.UNDERWATER | Effects.REVERB) // накидывает эффекты
	.prepare() // вызывает подготовку пула или медиаплеера, на этом этапе определяется, каким способом будет проигрываться звук
	.play() // если не был вызван prepare, он вызывается тут

sound.play()

sound.setPosition(coords)
sound.setVelocity(velocity)
sound.setAcceleration(acceleration) // возможно нахуй не надо

sound.translate({
	volume: 0.6
}, 20 /* ticks */)

sound.pause()

sound.stop() // останавливает, проигрывая "end" по возможности
sound.stopNow() // совсем останавливает

sound.fadeOut() // затухает постепенно, проигрывая "end" по возможности
