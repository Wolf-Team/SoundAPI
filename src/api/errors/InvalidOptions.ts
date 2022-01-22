class InvalidOptions extends Error {
	constructor(public readonly uid: string, message: string) {
		super(message);
	}
}
