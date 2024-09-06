import ContactCollection from '../db/models/Contact.js';

export const getAllContacts = () => ContactCollection.find();
export const getContactById = (contactId) =>
  ContactCollection.findById(contactId);
