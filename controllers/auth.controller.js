const { User } = require("../models/user");
const { HttpError } = require("../helpers");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
dotenv.config(); 

const { JWT_SECRET }  = process.env;

async function register(req, res, next) {
  const { email, subscription, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
      subscription,
    });

    res.status(201).json({
      user: {
        email,
        subscription,
        id: savedUser._id,
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw new HttpError(409, `User with this email already exists!`)
    }

    throw error;
  }
}

async function login(req, res, next) {
  const { email, password, subscription } = req.body;

  const storedUser = await User.findOne({
    email,
  });

  if (!storedUser) {
    throw new HttpError(401, "email is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  return res.json({
    token,
    user: {
        email,
        subscription,
    },
  });
}

async function logout(req, res) {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: '' })
  res.status(204).json({})
}

async function getCurrent(req, res) {
  const { email, subscription } = req.user
  res.status(200).json({
    email,
    subscription,
  })
}

async function updateSubscription(req, res) {
  const { userId } = req.params;
  const updateUser = await User.findByIdAndUpdate(userId, req.body, {new: true});
  if (!updateUser) {
    throw new HttpError(404, `User not found`)
  };
  res.status(200).json({ updateUser });
}

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
};