export const formatCurrency = (amount, withDecimals = false) => {
  if (amount === undefined || amount === null) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(amount);
};

export const formatCompactNumber = (number) => {
  if (!number) return '0';
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};