function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

class HttpError extends Error {
  constructor(code, message) {
    super(message);
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.status = code
  }
statusCode() {
    return this.status
  }
}

module.exports = {
  tryCatchWrapper,
  HttpError,
};