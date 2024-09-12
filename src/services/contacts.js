import ContactCollection from '../db/models/Contact.js';

export const getAllContacts = () => ContactCollection.find();
export const getContactById = (contactId) =>
  ContactCollection.findById(contactId);
export const createContact = (payload) => ContactCollection.create(payload);
export const updateContact = async (contactId, data) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactId },
    data,
    { new: true, includeResultMetadata: true },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
