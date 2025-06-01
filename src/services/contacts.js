import { SORT_ORDER } from '../constants/index.js';
import ContactCollection from '../db/models/Contact.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const contactQuery = ContactCollection.find({ userId: filter.userId });

  const data = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const count = await ContactCollection.countDocuments({
    userId: filter.userId,
  });

  const paginationData = calculatePaginationData({ count, page, perPage });

  return {
    page,
    perPage,
    data,
    totalItems: count,
    ...paginationData,
  };
};
export const getContact = (filter) => ContactCollection.findById(filter);
export const createContact = (payload) => ContactCollection.create(payload);
export const updateContact = async (filter, data, options = {}, userId) => {
  console.log(filter, userId);
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
export const deleteContact = (filter, userId) =>
  ContactCollection.findOneAndDelete({ ...filter, userId });
