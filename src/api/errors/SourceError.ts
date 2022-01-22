class SourceError extends Error {
	constructor(public readonly uid: string) {
		super("Source not assigned.");
	}
}
