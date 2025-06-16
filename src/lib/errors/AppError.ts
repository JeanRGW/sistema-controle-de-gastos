export default class AppError {
  public readonly msg: string;
  public readonly status: number;

  constructor(msg: string, status: number = 400) {
    this.msg = msg;
    this.status = status;
  }
}
