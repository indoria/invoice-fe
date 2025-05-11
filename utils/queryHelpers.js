export const buildPaginationQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

export const buildSortQuery = (req, defaultSort = '-createdAt') => {
  return req.query.sort || defaultSort;
};

export const buildSearchQuery = (searchText, fields) => {
  if (!searchText) return {};
  
  const searchRegex = { $regex: searchText, $options: 'i' };
  return {
    $or: fields.map(field => ({ [field]: searchRegex }))
  };
};