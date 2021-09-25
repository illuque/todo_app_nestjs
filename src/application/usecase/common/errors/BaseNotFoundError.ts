export abstract class BaseNotFoundError extends Error {
  protected constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BaseNotFoundError.prototype);
  }
}
