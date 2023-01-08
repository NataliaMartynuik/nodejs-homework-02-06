const contactsDb = require('../models/contacts');
const { HttpError } = require('../helpers/index');

async function getContacts (req, res) {
  const contacts = await contactsDb.listContacts();
  res.json(contacts);
}

async function getContact (req, res, next) {
  const { contactId } = req.params;
  const contact = await contactsDb.getContactById(contactId)
  if (!contact) {
    return next(HttpError(404, `Contact with ID ${contactId} not found!`))
  }
  return res.json(contact);
}

async function createContact (req, res) {
  const { name, email, phone } = req.body;
  const newContact = await contactsDb.addContact(name, email, phone);
  res.status(201).json(newContact);
}

async function deleteContact (req, res, next) {
  const { contactId } = req.params;
  const contact = await contactsDb.getContactById(contactId);
  if (!contact) {
    return next(HttpError(404, `Contact with ID ${contactId} not found!`))
  }
  await contactsDb.removeContact(contactId);
  res.status(200).json(contact);
}

async function putContact (req, res, next) {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const contact = await contactsDb.updateContact(contactId, name, email, phone);
  if (!contact) {
    return next(HttpError(404, `Contact with ID ${contactId} not found!`))
  }
  res.status(200).json(contact);
}

module.exports = {
    getContact,
    getContacts,
    createContact,
    deleteContact,
    putContact,
}