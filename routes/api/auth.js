
const express = require("express");

const { register, login, logout, getCurrent, updateSubscription } = require("../../controllers/auth.controller");
const { tryCatchWrapper } = require("../../helpers/index");
const { createUserSchema } = require("../../schemas/user");
const { validateBody } = require("../../middlewares/index");
const auth = require("../../middlewares/auth")

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), tryCatchWrapper(register));
authRouter.post("/login", tryCatchWrapper(login));
authRouter.post("/logout", auth, tryCatchWrapper(logout));
authRouter.get("/current", auth, tryCatchWrapper(getCurrent));
authRouter.patch("/:userId/subscription", tryCatchWrapper(updateSubscription));

module.exports = {
  authRouter,
};