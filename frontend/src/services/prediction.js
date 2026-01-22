import api from "./api";

/**
 * Sends Khmer text to the FastAPI backend for ML classification.
 * The baseURL is automatically pulled from the central api.js config.
 * * @param {string} content - The raw Khmer text to be classified.
 * @returns {Promise<Object>} - Returns the classification result with top predictions.
 */
export const classifyText = async (content) => {
  try {
    // encodeURIComponent is vital for Khmer script to handle Unicode correctly in URLs
    const response = await api.post(
      `/classify?content=${encodeURIComponent(content)}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Prediction Service Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};
