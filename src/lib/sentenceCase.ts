export const sentenceCase = (str?: string) => {
  if (!str) return str

  return str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}
