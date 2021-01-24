export class UnknownFileExtensionError extends Error {
  constructor (ext: string) {
    super(`Unknown file extension: <${ext}>.`);
  }
}
