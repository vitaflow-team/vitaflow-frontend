export class AppError extends Error {
  public readonly statusCode: number;
  /** Machine-readable reason sent by the backend (`{ code }`), when it has one. */
  public readonly code?: string;

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}
