export interface Credentials {
  email: string
  password: string
  remember?: boolean
}

export interface ResetPasswordData {
  email: string
}

export interface RegistrationData {
  email: string
  lastName: string
  name: string
  password: string
}
