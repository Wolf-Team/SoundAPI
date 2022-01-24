declare namespace SettingsManager {
	function getSetting(name: string): string | null;

	function getRenderDistance(): number;

	function getPlayerName(): string;

	function getLanguage(): string;

	function isLeftHanded(): string;

	function getSoundsVolume(): string;

	function getMusicVolume(): string;

	function getUiProfile(): string;

	function load(): void;
}
