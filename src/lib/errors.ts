export class ArgumentError extends Error {
  status: number;

  constructor(message: string = "Invalid arguments provided.") {
    super(message);
    this.name = "ArgumentError";
    this.status = 400;
  }
}

export class UnauthorizedError extends Error {
  status: number;

  constructor(message: string = "Unauthorized.") {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

export class PermissionError extends Error {
  status: number;

  constructor(message: string = "Permission denied.") {
    super(message);
    this.name = "PermissionError";
    this.status = 403;
  }
}

export class NotFoundError extends Error {
  status: number;

  constructor(message: string = "Resource not found.") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class ConflictError extends Error {
  status: number;

  constructor(message: string = "Resource conflict.") {
    super(message);
    this.name = "ConflictError";
    this.status = 409;
  }
}

export class ServerError extends Error {
  status: number;

  constructor(message: string = "Internal server error.") {
    super(message);
    this.name = "ServerError";
    this.status = 500;
  }
}
