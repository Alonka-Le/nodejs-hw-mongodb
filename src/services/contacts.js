import { SORT_ORDER } from '../constants/index.js';
import ContactCollection from '../db/models/Contact.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
}) => {
  const skip = (page - 1) * perPage;
  const data = await ContactCollection.find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const count = await ContactCollection.find().countDocuments();

  const paginationData = calculatePaginationData({ count, page, perPage });

  return {
    page,
    perPage,
    data,
    totalItems: count,
    ...paginationData,
  };
};
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
