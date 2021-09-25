export abstract class BaseForbiddenError extends Error {
  protected constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BaseForbiddenError.prototype);
  }
}
