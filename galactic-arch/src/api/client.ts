const API_BASE_URL = 'http://localhost:3000';

const fetchAPI = async (endpoint: string, params: Record<string, any> = {}): Promise<any> => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}${endpoint}?${queryParams}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export { fetchAPI };