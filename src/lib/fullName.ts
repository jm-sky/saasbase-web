interface HasFirstAndLastName {
  firstName: string
  lastName: string
}

export const fullName = (user: HasFirstAndLastName) => `${user.firstName} ${user.lastName}`.trim()
