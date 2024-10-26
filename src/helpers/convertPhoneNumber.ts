export function convertToVietnamesePhoneNumber(phoneNumber: string): string {
  let cleanedNumber = phoneNumber.replace(/\D/g, '');
  if (cleanedNumber.startsWith('84')) {
    cleanedNumber = '0' + cleanedNumber.substring(2);
  }
  if (cleanedNumber.length !== 10) {
    return 'Invalid phone number';
  }
  return cleanedNumber;
}
