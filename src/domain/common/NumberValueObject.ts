import { BaseValueObject } from './BaseValueObject';

export abstract class NumberValueObject extends BaseValueObject<number> {
  constructor(value: number) {
    super(value);
  }

  toString() {
    return this.value.toString(10);
  }
}
