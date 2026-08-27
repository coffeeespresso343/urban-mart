export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPhone = (value: string): boolean =>
  /^[0-9+()\-.\s]{7,}$/.test(value.trim());

export const isValidPostalCode = (value: string): boolean =>
  value.trim().length >= 3;

export const isValidCardNumber = (value: string): boolean => {
  const digits = value.replace(/\s/g, "");
  return /^\d{13,19}$/.test(digits);
};

export const isValidExpiry = (value: string) => {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiry = new Date(year, month);
  return expiry > now;
};

export const isValidCvc = (value: string): boolean =>
  /^\d{3,4}$/.test(value.trim());

export const required = (value: string): boolean => value.trim().length > 0;

export const formatCardNumber = (value: string): string =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
};

export const isValidPassword = (value: string) => value.length >= 8;
