export class BadRequestResponse extends Response {
  constructor(message?: string) {
    super(message || "Bad Request", { status: 400 });
  }
}

export class UnauthorizedResponse extends Response {
  constructor(message?: string) {
    super(message || "Unauthorized", { status: 401 });
  }
}

export class ForbiddenResponse extends Response {
  constructor(message?: string) {
    super(message || "Forbidden", { status: 403 });
  }
}

export class NotFoundResponse extends Response {
  constructor(message?: string) {
    super(message || "Resource Not Found", { status: 404 });
  }
}

export class ConflictResponse extends Response {
  constructor(message?: string) {
    super(message || "Conflict", { status: 409 });
  }
}

export class UnprocessableEntityResponse extends Response {
  constructor(message?: string) {
    super(message || "Invalid Request Data", { status: 422 });
  }
}

export class InternalServerErrorResponse extends Response {
  constructor(message?: string) {
    super(message || "Internal Server Error", { status: 500 });
  }
}

export class NotImplementedResponse extends Response {
  constructor(message?: string) {
    super(message || "Not Implemented Error", { status: 501 });
  }
}
