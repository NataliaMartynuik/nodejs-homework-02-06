const nodemailer = require("nodemailer");
require('dotenv').config()

const { EMAIL_PASS } = process.env;

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

async function sendMail({ to, html, subject }) {
  const email = {
    from: "jannika11121@meta.ua",
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: "jannika11121@meta.ua",
      pass: EMAIL_PASS,
    },
  });

  await transport.sendMail(email);
}

module.exports = {
  tryCatchWrapper,
  HttpError,
  sendMail,
};