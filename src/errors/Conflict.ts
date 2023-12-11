import statusCodes from '../constants/statusCodes';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.CONFLICT;
  }
}
