import statusCodes from '../constants/statusCodes';

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.UNAUTHENTICATED;
  }
}
