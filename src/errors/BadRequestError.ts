import statusCodes from '../constants/statusCodes';

export default class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.BAD_REQUEST;
  }
}
