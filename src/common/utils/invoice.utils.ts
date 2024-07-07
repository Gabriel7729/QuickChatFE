export const generateInvoiceNumber = (branchName: string): string => {
  const dateNow = new Date();

  const codeDate = dateNow.toISOString().split("T")[0].replace(/-/g, "");
  const timeNumbersCode = dateNow
    .toTimeString()
    .split(" ")[0]
    .replace(/:/g, "");
  const firstLetterBranchName = branchName.slice(0, 3).toUpperCase();

  const invoiceNumber = `${firstLetterBranchName}-${codeDate}${timeNumbersCode}`;
  return invoiceNumber;
};
