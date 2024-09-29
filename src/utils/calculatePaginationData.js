const calculatePaginationData = ({ count, page, perPage }) => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page !== 1;
  const hasNextPage = page < totalPages;

  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export default calculatePaginationData;
