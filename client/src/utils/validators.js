export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPassword = (pass) => pass.length >= 6;
export const isValidName = (name) => name.trim().length >= 2;
