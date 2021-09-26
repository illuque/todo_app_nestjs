import { BaseValueObject } from './BaseValueObject';

export abstract class StringValueObject extends BaseValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  toString() {
    return this.value;
  }
}
