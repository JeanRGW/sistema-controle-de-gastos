export default class AppError extends Error {
  code: number;

  constructor(message = 'An error ocourred.', code = 400) {
    super(message);
    this.code = code;
  }
}
