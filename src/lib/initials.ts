export const initials = (name?: string) => (name ?? '').split(' ').map(n => n[0]).join('').toUpperCase()
