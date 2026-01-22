import api from "./api";

/**
 * Retrieves the latest classification records from the database.
 * * @param {number} limit - The number of recent records to fetch.
 * @returns {Promise<Array>} - Returns an array of history objects.
 */
export const fetchHistory = async (limit = 10) => {
  try {
    const response = await api.get(`/history?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(
      "History Service Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};
