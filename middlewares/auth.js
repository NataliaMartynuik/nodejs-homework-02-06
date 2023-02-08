const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers/index");
const multer = require("multer");
const path = require("path");

const { JWT_SECRET } = process.env;

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    throw new HttpError(401, `Not authorized`);
  }

   if (!token) {
    throw new HttpError(401, `Not authorized`);
  }
  
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    req.user = user;

   } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      throw new HttpError(401, "Not authorized");
    }
    throw error;
  }
  next();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, Math.random() + file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = {
  auth,
  upload,
}