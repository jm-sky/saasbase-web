import { AxiosError, type AxiosResponse, HttpStatusCode, isAxiosError } from 'axios'

export type ValidationError<T> = AxiosError & {
    response: AxiosResponse<T>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidationError = <T extends object = any>(error: unknown): error is ValidationError<T> => isAxiosError(error) && error.status === HttpStatusCode.UnprocessableEntity && error.response?.data
