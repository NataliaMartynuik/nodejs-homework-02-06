
const express = require("express");

const { register, login, logout, getCurrent, updateSubscription, uploadAvatar, verifyEmail, resendVerify } = require("../../controllers/auth.controller");
const { tryCatchWrapper } = require("../../helpers/index");
const { createUserSchema, emailSchema } = require("../../schemas/user");
const { validateBody } = require("../../middlewares/index");
const { auth, upload } = require("../../middlewares/auth")

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), tryCatchWrapper(register));
authRouter.post("/login", tryCatchWrapper(login));
authRouter.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));
authRouter.get("/current",  tryCatchWrapper(auth), tryCatchWrapper(getCurrent));
authRouter.patch("/:userId/subscription", tryCatchWrapper(updateSubscription));
authRouter.patch("/avatars", tryCatchWrapper(auth), tryCatchWrapper(upload.single("avatar")), tryCatchWrapper(uploadAvatar));
authRouter.get("/verify/:token", tryCatchWrapper(verifyEmail));
authRouter.post("/verify", validateBody(emailSchema), tryCatchWrapper(resendVerify));

module.exports = {
  authRouter,
};