import statusCodes from '../constants/statusCodes';

export default class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.INTERNAL_SERVER_ERROR;
  }
}
