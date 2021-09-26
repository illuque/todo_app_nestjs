export abstract class BaseValueObject<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  equals(compareTo: BaseValueObject<T>): boolean {
    return this.value === compareTo.value;
  }
}
