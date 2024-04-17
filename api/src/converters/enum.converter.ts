export class Enum {
  static getKeyByValue<T, E>(enumObj: T, value: E): keyof T | undefined {
    for (const key in enumObj) {
      if (enumObj[key] == value) {
        return key as keyof T;
      }
    }
    return undefined;
  }
}
