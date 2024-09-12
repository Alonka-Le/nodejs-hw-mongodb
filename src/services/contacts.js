import ContactCollection from '../db/models/Contact.js';

export const getAllContacts = () => ContactCollection.find();
export const getContactById = (contactId) =>
  ContactCollection.findById(contactId);
export const createContact = (payload) => ContactCollection.create(payload);
