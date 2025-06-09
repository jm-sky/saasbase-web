export interface Credentials {
  email: string
  password: string
  remember?: boolean
  recaptchaToken?: string
}

export interface ForgotPasswordData {
  email: string
  recaptchaToken?: string
}

export interface ResetPasswordData {
  token: string
  email: string
  password: string
  passwordConfirmation: string
  recaptchaToken?: string
}

export interface RegistrationData {
  email: string
  firstName: string
  lastName: string
  password: string
  recaptchaToken?: string
}
