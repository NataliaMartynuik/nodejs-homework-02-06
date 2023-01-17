const { HttpError } = require('../helpers/index.js');
const { Contact } = require("../models/contacts");

async function getContacts (req, res) {
  const contacts = await Contact.find({});
  res.json(contacts);
}

async function getContact (req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId)
  if (!contact) {
    throw new HttpError(404, `Contact with id ${contactId} not found!`)
  }
  return res.json(contact);
}

async function createContact (req, res) {
  const { name, email, phone, favorite } = req.body;
    const newContact = await Contact.create({
      name,
      email,
      phone,
      favorite,
    });
  res.status(201).json(newContact);
}

async function deleteContact (req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw new HttpError(404, `Contact with id ${contactId} not found!`)
  }
  await Contact.findByIdAndRemove(contactId);
  res.status(200).json(contact);
}

async function putContact (req, res, next) {
  const { contactId } = req.params;
  const { name, email, phone, favorite } = req.body;
  const contact = await Contact.findByIdAndUpdate(contactId, { name, email, phone, favorite }, {new: true});
  if (!contact) {
    throw new HttpError(404, `Contact with id ${contactId} not found!`)
  }
  res.status(200).json(contact);
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  if (!contact) {
    throw new HttpError(404, `Contact with id ${contactId} not found!`)
  }
  res.status(200).json(contact);
}

module.exports = {
    getContact,
    getContacts,
    createContact,
    deleteContact,
    putContact,
    updateStatusContact,

}