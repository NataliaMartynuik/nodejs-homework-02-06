const fs = require('fs/promises');
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve(__dirname, 'contacts.json');

async function readContacts() {
  const contactsRaw = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRaw);
  return contacts;
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

const listContacts = async () => {
  const contacts = await readContacts();
  return contacts;
}

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const contactById = contacts.find((contact) => contact.id === contactId)
  return contactById || null; 
}

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const updateContacts = contacts.filter((contact) => contact.id !== contactId);
  await writeContacts(updateContacts);
  return updateContacts;
}

const addContact = async (name, email, phone) => {
  const id = nanoid();
  const contact = { id, name, email, phone };
  const contacts = await readContacts();
  contacts.push(contact);
  await writeContacts(contacts);
  return contact;
}

const updateContact = async (contactId, name, email, phone) => {
  const contacts = await readContacts();
  const upContact = contacts.find((contact) => contact.id === contactId);
  upContact.name = name;
  upContact.email = email;
  upContact.phone = phone;
  await writeContacts(contacts);
  return upContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
