export class TodoNotFoundError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TodoNotFoundError.prototype);
  }
}

export class TodoNotOwnedByUserError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TodoNotOwnedByUserError.prototype);
  }
}

export class TodoNotUpdatableError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TodoNotUpdatableError.prototype);
  }
}

export class TodoUnknownError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TodoUnknownError.prototype);
  }
}
