const parseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const body = await parseBody(response);
  if (!response.ok) {
    const message = body?.error?.message || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return body;
};
