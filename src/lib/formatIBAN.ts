/**
 * Formats an IBAN by adding spaces every 4 characters
 * @param iban - The IBAN string to format
 * @param options - Formatting options
 * @returns Formatted IBAN string
 */
export const formatIBAN = (iban: string, options: { 
  showCountryCode?: boolean 
  masked?: boolean 
  maskLength?: number 
} = {}) => {
  if (!iban) return ''
  
  const { showCountryCode = true, masked = false, maskLength = 4 } = options
  
  // Remove all spaces and convert to uppercase
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase()
  
  // Validate basic IBAN format (at least 4 characters)
  if (cleanIBAN.length < 4) return iban
  
  // If masked, show only first 4 chars and last maskLength chars
  if (masked && cleanIBAN.length > 8) {
    const start = cleanIBAN.substring(0, 4)
    const end = cleanIBAN.substring(cleanIBAN.length - maskLength)
    const maskedPart = '•'.repeat(Math.max(0, cleanIBAN.length - 4 - maskLength))
    return `${start}${maskedPart}${end}`.replace(/(.{4})/g, '$1 ').trim()
  }
  
  // Add spaces every 4 characters
  const formatted = cleanIBAN.replace(/(.{4})/g, '$1 ').trim()
  
  // If showCountryCode is false, remove the first 4 characters (country code + check digits)
  if (!showCountryCode && formatted.length > 4) {
    return formatted.substring(5) // Remove "XX00 " (country code + check digits + space)
  }
  
  return formatted
}

/**
 * Validates basic IBAN format
 * @param iban - The IBAN string to validate
 * @returns True if IBAN format is valid
 */
export const isValidIBANFormat = (iban: string): boolean => {
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase()
  
  // Basic format check: 15-34 characters, starts with 2 letters followed by 2 digits
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/
  return ibanRegex.test(cleanIBAN)
}

/**
 * Extracts country code from IBAN
 * @param iban - The IBAN string
 * @returns Country code or empty string
 */
export const getIBANCountryCode = (iban: string): string => {
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase()
  return cleanIBAN.substring(0, 2)
}

/**
 * Masks IBAN showing only first 4 and last 4 characters
 * @param iban - The IBAN string to mask
 * @returns Masked IBAN string
 */
export const maskIBAN = (iban: string): string => {
  return formatIBAN(iban, { masked: true, maskLength: 4 })
}
