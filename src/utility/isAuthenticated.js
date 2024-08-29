// utils/auth.js
export const isAuthenticated = () => {
  const token = localStorage.getItem('userData').accessToken;
  console.log('token:>', token);
  return !!token && !isTokenExpired(token);
};

const isTokenExpired = (token) => {
  const decodedToken = decodeToken(token);

  // Check if the token expiration date is in the past
  return decodedToken && decodedToken.exp * 1000 < Date.now();
};

// This function decodes a JWT token
const decodeToken = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
