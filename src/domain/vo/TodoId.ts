import { NumberValueObject } from './common/NumberValueObject';

export class TodoId extends NumberValueObject {
  toString(): string {
    return this.value.toString(10);
  }
}
