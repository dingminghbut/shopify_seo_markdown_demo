const axios = require('axios');

/**
 * Fetch a web page and return its HTML content and response headers
 * @param {string} url - The URL to fetch
 * @returns {Promise<{html: string, headers: object}>}
 * @throws {string} Error code: 'INVALID_URL', 'TIMEOUT', or 'FETCH_ERROR'
 */
async function fetchPage(url) {
  // Validate URL format and protocol
  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw 'INVALID_URL';
    }
  } catch (e) {
    throw 'INVALID_URL';
  }

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true // Accept all status codes, we just want the content
    });

    return {
      html: response.data,
      headers: response.headers
    };
  } catch (error) {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' ||
        error.code === 'ETIMEDOUT' ||
        (error.message && error.message.includes('timeout'))) {
      throw 'TIMEOUT';
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'EAI_AGAIN' ||
        error.code === 'ERR_NETWORK') {
      throw 'FETCH_ERROR';
    }

    // For any other errors (including request errors)
    throw 'FETCH_ERROR';
  }
}

module.exports = { fetchPage };