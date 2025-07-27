export const extractTokenFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  console.log('Extracting token from URL:', { token, url: window.location.href });

  if (token) {
    console.log('Token found, storing in localStorage');
    localStorage.setItem('authToken', token);
    // Clear token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return token;
  }

  const existingToken = localStorage.getItem('authToken');
  console.log('No token in URL, checking localStorage:', { existingToken: !!existingToken });
  return existingToken;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};