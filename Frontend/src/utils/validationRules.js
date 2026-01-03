// Regular expressions for common Indian business formats
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // GST Format: 22AAAAA0000A1Z5 (State Code + PAN + Entity Number + Z + Check Digit)
  GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  PHONE: /^[6-9]\d{9}$/, // Basic Indian mobile validation
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, // Min 8 chars, 1 letter, 1 number
};

export const validate = {
  required: (value) => {
    if (value === null || value === undefined || value === '') return 'This field is required';
    if (typeof value === 'string' && value.trim() === '') return 'This field is required';
    return null;
  },

  email: (value) => {
    if (!value) return null;
    return PATTERNS.EMAIL.test(value) ? null : 'Invalid email address';
  },

  password: (value) => {
    if (!value) return null;
    return value.length >= 6 ? null : 'Password must be at least 6 characters';
  },

  gstin: (value) => {
    if (!value) return null;
    return PATTERNS.GSTIN.test(value) ? null : 'Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)';
  },

  pan: (value) => {
    if (!value) return null;
    return PATTERNS.PAN.test(value) ? null : 'Invalid PAN number';
  },

  phone: (value) => {
    if (!value) return null;
    return PATTERNS.PHONE.test(value) ? null : 'Invalid 10-digit mobile number';
  },

  number: (value) => {
    if (!value) return null;
    return !isNaN(value) && Number(value) >= 0 ? null : 'Must be a valid positive number';
  },

  confirmPassword: (password, confirm) => {
    return password === confirm ? null : 'Passwords do not match';
  }
};

export const runValidation = (value, rules = []) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return '';
};

export default validate;