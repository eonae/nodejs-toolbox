/**
 * For serializing and deserializing objects with methods.
 * See more in https://clck.ru/Qc3e4
 * */
export class RevivingSerializer {
  public static serialize<T> (obj: T): string {
    return JSON.stringify(obj, (key: string, value: unknown): unknown => {
      if (typeof value === 'function') {
        return value.toString();
      }
      return value;
    });
  }

  public static deserialize<T> (serializedObject: string): T {
    return JSON.parse(serializedObject, (key: string, value: unknown): unknown => {
      if (typeof value === 'string' && value.indexOf('function') === 0) {
        const functionTemplate = `(${value})`;
        // eval is the best the best way to revive function from serialized object.
        // eslint-disable-next-line no-eval
        return eval(functionTemplate) as unknown;
      }
      return value;
    }) as T;
  }
}
