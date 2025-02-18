export class ExpireError extends Error {
  readonly type: string = 'ExpireError';
  constructor(message: string) {
    super(message);
    this.cause = 'expire';
  }
}
