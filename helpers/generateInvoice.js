export const generateInvoice = (letter, number) => {
  const paddedNumber = String(number).padStart(4, "0");
  const result = `${letter.toUpperCase()}${paddedNumber}`;

  return result;
};
