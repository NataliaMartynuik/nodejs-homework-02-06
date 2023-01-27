const { HttpError } = require("../helpers/index");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new HttpError(400, `Missing field or wrong data type`)
    }
    return next();
  };
}

module.exports = {
  validateBody,
}

