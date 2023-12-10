import statusCodes from '../constants/statusCodes';

export default class ForbiddenRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.FORBIDDEN_REQUEST;
  }
}
