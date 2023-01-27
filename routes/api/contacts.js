const express = require("express");
const { tryCatchWrapper } = require('../../helpers/index');
const { getContact, getContacts, createContact, deleteContact, putContact, updateStatusContact} = require("../../controllers/contacts.controller");
const { validateBody } = require("../../middlewares/index");
const { createContactSchema, updateContactSchema, updateStatusContactSchema } = require("../../schemas/contacts");
const auth = require("../../middlewares/auth")

const contactsRouter = express.Router()

contactsRouter.get('/', auth, tryCatchWrapper(getContacts));
contactsRouter.get('/:contactId', auth, tryCatchWrapper(getContact));
contactsRouter.post('/', auth, validateBody(createContactSchema), tryCatchWrapper(createContact));
contactsRouter.delete('/:contactId', auth, tryCatchWrapper(deleteContact));
contactsRouter.put('/:contactId', auth, validateBody(updateContactSchema), tryCatchWrapper(putContact));
contactsRouter.patch('/:contactId/favorite', auth, validateBody(updateStatusContactSchema), tryCatchWrapper(updateStatusContact));

module.exports = contactsRouter

