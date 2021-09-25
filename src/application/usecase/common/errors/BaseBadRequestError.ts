export abstract class BaseBadRequestError extends Error {
  protected constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BaseBadRequestError.prototype);
  }
}
