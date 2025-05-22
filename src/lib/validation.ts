import { AxiosError, type AxiosResponse, HttpStatusCode, isAxiosError } from 'axios'

export interface ValidationErrorData<T extends object> {
    error: string
    errors: T
}

export type ValidationError<T extends object> = AxiosError & {
    response: AxiosResponse<ValidationErrorData<T>>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidationError = <T extends object = any>(error: unknown): error is ValidationError<T> => isAxiosError(error)
    && error.status === HttpStatusCode.UnprocessableEntity
    && error.response?.data?.errors
