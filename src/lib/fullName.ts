interface HasName {
  firstName: string
  lastName: string
}

export const fullName = (user: HasName) => `${user.firstName} ${user.lastName}`.trim()
