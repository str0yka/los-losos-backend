class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static unexpected(message) {
    return new ApiError(500, message);
  }
}

export default ApiError;
