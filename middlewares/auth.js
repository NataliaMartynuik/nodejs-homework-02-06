const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers/index");
const dotenv = require("dotenv");

dotenv.config(); 
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
    next()
  } catch (error) {
      next (new HttpError(401, `Not authorized`));
    }
  
  }

module.exports=auth