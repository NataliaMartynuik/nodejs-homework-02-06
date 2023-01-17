const Joi = require("joi");

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/).required()
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/),
}).min(1)

const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required()
});

module.exports = {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,

}