const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../models/contacts.js');
const { HttpError } = require('../helpers/index.js');

async function getContacts (req, res) {
  const contacts = await listContacts();
  res.json(contacts);
}

async function getContact (req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId)
  if (!contact) {
    return next(HttpError(404, `Contact with ID ${contactId} not found!`))
  }
  return res.json(contact);
}

async function createContact (req, res) {
  const { name, email, phone } = req.body;
  const newContact = await addContact(name, email, phone);
  res.status(201).json(newContact);
}

async function deleteContact (req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return next(HttpError(404, `Contact with ID ${contactId} not found!`))
  }
  await removeContact(contactId);
  res.status(200).json(contact);
}

async function putContact (req, res, next) {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const contact = await updateContact(contactId, name, email, phone);
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