export abstract class BaseGenericError extends Error {
  protected constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BaseGenericError.prototype);
  }
}
