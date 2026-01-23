import api from "./api";

/**
 * Sends a single string of Khmer text to the backend for classification.
 * @param {string} content - Raw Khmer text.
 * @returns {Promise<Object>} - Classification results.
 */
export const classifyText = async (content) => {
  try {
    // encodeURIComponent handles Khmer Unicode characters in the URL query string
    const response = await api.post(
      `/classify?content=${encodeURIComponent(content)}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Single Prediction Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Uploads a CSV or Excel file for line-by-line batch classification.
 * @param {File} fileObject - The file selected from the input[type="file"].
 * @returns {Promise<Object>} - The full list of line-by-line predictions.
 */
export const classifyBulk = async (fileObject) => {
  try {
    const formData = new FormData();

    /**
     * KEY FIX: The field name must be "file" to match:
     * async def bulk_classify(file: UploadFile = File(...)) in main.py
     */
    formData.append("file", fileObject);

    // Axios (used in your api.js) automatically sets the
    // multipart/form-data boundary when it sees FormData.
    const response = await api.post("/classify-bulk/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Bulk Prediction Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};
