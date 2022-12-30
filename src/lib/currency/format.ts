export function formatWholeNumbers(wholeNumbers: string): string {
  let wholeNumbersFormatted = "";
  Array(wholeNumbers.length).fill(0).forEach((_, index) => {
    const shouldAddComma = index !== wholeNumbers.length - 1
          && (wholeNumbers.length - index) % 3 === 1;
    wholeNumbersFormatted += wholeNumbers.charAt(index);
    if (shouldAddComma) {
      wholeNumbersFormatted += ",";
    }
  });
  return wholeNumbersFormatted;
}

export function formatCurrency(amount: number, currencySymbol = "$"): string {
  const tokens = amount.toFixed(2).split(".");
  return `${currencySymbol}${formatWholeNumbers(tokens[0])}.${tokens[1]}`;
}
