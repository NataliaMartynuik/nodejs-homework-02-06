const Joi = require("joi");

const createUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valueOf('starter', 'pro', 'business'),
});

const emailSchema = Joi.object({
  email: Joi.string().required(),
})

module.exports = {
  createUserSchema,
  emailSchema,
}