const { HttpError } = require('../helpers/index.js');
const { Contact } = require("../models/contacts");

async function getContacts(req, res) {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = [true, false] } = req.query;
  const skip = (page - 1) * limit
  const contacts = await Contact.find({ owner, favorite: favorite }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");

  res.json(contacts);
}

async function getContact(req, res, next) {


  const { contactId } = req.params;
  const contact = await Contact.findById(contactId)
  if (!contact) {
    throw new HttpError(404, `Contact with id ${contactId} not found!`)
  }
  return res.json(contact);
}

async function createContact(req, res) {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({
      ...req.body,
      owner,
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