const express = require("express");
const { tryCatchWrapper } = require('../../helpers/index');
const { getContact, getContacts, createContact, deleteContact, putContact, updateStatusContact} = require("../../controllers/contacts.controller");
const { validateBody } = require("../../middlewares");
const { createContactSchema, updateContactSchema, updateStatusContactSchema } = require("../../schemas/contacts")

const router = express.Router()

router.get('/', tryCatchWrapper(getContacts));
router.get('/:contactId', tryCatchWrapper(getContact));
router.post('/', validateBody(createContactSchema), tryCatchWrapper(createContact));
router.delete('/:contactId', tryCatchWrapper(deleteContact));
router.put('/:contactId', validateBody(updateContactSchema), tryCatchWrapper(putContact));
router.patch('/:contactId/favorite', validateBody(updateStatusContactSchema), tryCatchWrapper(updateStatusContact));

module.exports = router
