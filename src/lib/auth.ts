export const extractTokenFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    localStorage.setItem('authToken', token);
    // Clear token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return token;
  }

  return localStorage.getItem('authToken');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};