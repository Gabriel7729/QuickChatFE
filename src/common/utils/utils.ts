export const getFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0);
};

/**
 * Formats a given string by adding dashes at specified positions.
 * @param input - The string to be formatted.
 * @returns The formatted string.
 */
export function formatIdNumber(input: string): string {
  // Check if the input is exactly 11 characters long
  if (input.length !== 11) {
    return input;
  }

  // Format the string as 402-2936377-1
  const formatted = `${input.slice(0, 3)}-${input.slice(3, 10)}-${input.slice(
    10
  )}`;
  return formatted;
}

/**
 * Formats a given phone number to the Dominican Republic format XXX-XXX-XXXX.
 * @param phoneNumber - The phone number string to be formatted.
 * @returns The formatted phone number string.
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Check if the cleaned number is exactly 10 digits long
  if (cleaned.length !== 10) {
    return phoneNumber;
  }

  // Format the cleaned number as XXX-XXX-XXXX
  const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
    3,
    6
  )}-${cleaned.slice(6)}`;
  return formatted;
}

export const downloadFile = (file: Blob, fileName: string) => {
  const url = URL.createObjectURL(file);

  // Create a new anchor element
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;

  // Append the anchor to the body, click it, and then remove it
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Release the Blob URL
  URL.revokeObjectURL(url);
};

export const printInvoice = (file: Blob) => {
  const url = URL.createObjectURL(file);
  window.open(url)?.print();
  URL.revokeObjectURL(url);
};

export const getCookieValue = (name: string) => {
  const match = RegExp(new RegExp("(^| )" + name + "=([^;]+)")).exec(
    document.cookie
  );
  if (match) return match[2];
  return null;
};
