import { HttpStatusCode } from 'axios'

export const validationError = (errors: object) => ({
  status: HttpStatusCode.UnprocessableEntity,
  data: { errors },
})

export const sendResponse = <T extends object>(response: T, title: string): T => {
  console.log(`[mockApi][${title}] response:`, response)
  return response
}
