const { User } = require("../models/user");

const { HttpError, sendMail } = require("../helpers");

const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const jimp = require('jimp');
const gravatar = require('gravatar');
const { v4 } = require("uuid");


const bcrypt = require("bcrypt");

const { JWT_SECRET }  = process.env;

async function register(req, res, next) {
  const { email, subscription, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatarURL = gravatar.url(email)
  try {
    const verificationToken = v4();

    const savedUser = await User.create({
      email,
      password: hashedPassword,
      subscription,
      avatarURL,
      verificationToken,
      verify: false,
    });

    await sendMail({
      to: email,
      subject: 'Please verify your registration on our website',
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click this link for your verification approval </a>`,

    });

    res.status(201).json({
      user: {
        email,
        subscription,
        id: savedUser._id,
        verify,
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

  if (!storedUser.verify) {
    throw new HttpError (401, 'Email is not verified')
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  return res.status(200).json({
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

async function uploadAvatar(req, res) {
  const { _id } = req.user
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public/avatars", filename);
  jimp.read(tmpPath)
  .then(avatar => {
    return avatar
      .resize(250, 250) 
      .write(publicPath); 
  })
  .catch(err => {
    throw err
  });

  await fs.unlink(tmpPath);

  const updateUser = await User.findByIdAndUpdate(_id, req.body);
  updateUser.avatarURL = `/avatars/${filename}`;
  await updateUser.save();

  return res.json({
    avatarURL: updateUser.avatarURL,
  });

}

async function verifyEmail(req, res, next) {
  const { token } = req.params;
  const user = await User.findOne({
    verificationToken: token,
  });

  if (!user) {
    throw new HttpError (404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.status(200).json({
    message: "Verification successful",
  });
}

async function resendVerify(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email })
  if (!user) {
    throw new HttpError(404, "User not found")
  }
  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed")
  }
  await sendMail({
    to: email,
    subject: 'Please verify your registration on our website',
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click this link for your verification approval </a>`,
  })
  return res.status(200).json({
    message: "Verification email sent"
  })
}

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  uploadAvatar,
  verifyEmail,
  resendVerify,

};