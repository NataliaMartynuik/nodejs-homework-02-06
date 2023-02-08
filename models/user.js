const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true, 
      match: [/[a-z0-9]+@[a-z0-9]+/, "user email is not valid!"], 
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      minLength: [6, "password should be at least 6 characters long"],
      required: [true, 'Set password for user'],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
    },

    token: String,
    verify: {
    type: Boolean,
    default: false,
  },
    verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },

  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

const User = mongoose.model("user", schema);

module.exports = {
  User,
};