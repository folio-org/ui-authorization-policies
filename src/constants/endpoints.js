import { likeSearch, allRecords } from './queries';

export const POLICIES_ENDPOINT = (searchTerm, limit = 1000) => {
  if (!searchTerm) {
    return `policies?limit=${limit}&query=${allRecords} sortby name`;
  }
  return `policies?limit=${limit}&query=name=${likeSearch(
    encodeURIComponent(searchTerm)
  )} sortby name`;
};
