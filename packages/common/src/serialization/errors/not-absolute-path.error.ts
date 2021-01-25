export class NotAbsolutePathError extends Error {
  constructor (path: string) {
    super(`Path = <${path}> is not absolute! Please use absolute path.`);
  }
}
