import { SORT_ORDER } from '../constants/sortOrder.js';

const parseSortParams = ({ sortBy, sortFields, sortOrder }) => {
  const parseSortBy = sortFields.includes(sortBy) ? sortBy : '_id';
  const parseSortOrder = SORT_ORDER.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER[0];

  return {
    sortBy: parseSortBy,
    sortOrde: parseSortOrder,
  };
};

export default parseSortParams;
