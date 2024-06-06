import { z } from 'zod';

export const passwordSchema = z.string().refine(value => {
  const minLength = value.length >= 8;
  const hasLowercase = /[a-z]/.test(value);
  const hasUppercase = /[A-Z]/.test(value);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
  const hasNumber = /\d/.test(value);

  return minLength && hasLowercase && hasUppercase && hasSpecialChar && hasNumber;
}, 'Password must be at least 8 characters long, have at least 1 lowercase, 1 uppercase, 1 special character, and 1 number.');
