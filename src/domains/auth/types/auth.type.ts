export interface Credentials {
  email: string
  password: string
  remember?: boolean
  recaptchaToken?: string
}

export interface ResetPasswordData {
  email: string
}

export interface ForgotPasswordData {
  email: string
  recaptchaToken?: string
}

export interface RegistrationData {
  email: string
  firstName: string
  lastName: string
  password: string
  recaptchaToken?: string
}
