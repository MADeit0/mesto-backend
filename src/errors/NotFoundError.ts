import statusCodes from '../constants/statusCodes';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.NOT_FOUND;
  }
}
