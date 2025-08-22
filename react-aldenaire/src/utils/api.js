
// NOTE: If you face connection issues, try switching between 'localhost' and '127.0.0.1' below.
// استخدم المسار النسبي ليستفيد من إعدادات البروكسي في React
const API_BASE_URL = "/Final_project/api";
// const API_BASE_URL = "http://localhost/Final_project/api";
// const API_BASE_URL = "http://127.0.0.1/Final_project/api";

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 10000, // 10 seconds
};

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to create timeout promise
const createTimeout = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
};

// Enhanced fetch with retry mechanism
export const fetchWithRetry = async (url, options = {}, retryCount = 0) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeout);

    const response = await Promise.race([
      fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }),
      createTimeout(RETRY_CONFIG.timeout)
    ]);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error(`API call failed (attempt ${retryCount + 1}):`, error);

    // Retry logic
    if (retryCount < RETRY_CONFIG.maxRetries) {
      console.log(`Retrying in ${RETRY_CONFIG.retryDelay}ms...`);
      await delay(RETRY_CONFIG.retryDelay);
      return fetchWithRetry(url, options, retryCount + 1);
    }

    throw error;
  }
};

// API functions
export const api = {
  // Get menu items
  getMenuItems: async () => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/menu.php`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      throw error;
    }
  },

  // Submit review
  submitReview: async (reviewData) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/reviews.php`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  },

  // Get reviews
  getReviews: async () => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/reviews.php`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      throw error;
    }
  },

  // Submit contact form
  submitContact: async (contactData) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/contact.php`, {
        method: 'POST',
        body: JSON.stringify(contactData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      throw error;
    }
  },

  // Submit order
  submitOrder: async (orderData) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/orders.php`, {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to submit order:', error);
      throw error;
    }
  },
};

// Check if API is available
export const checkApiHealth = async () => {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/menu.php`, {}, 1);
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
}; 