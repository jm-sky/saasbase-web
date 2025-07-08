import api from '@/lib/api'
import type { IGenericSignaturesVerificationResult, IIdentityConfirmationResponse } from '../types/identityConfirmation.type'

export interface ISubmitSignedPayload {
  file: File
}

export interface ISubmitSignedResponse {
  status: 'verified' | 'unverified'
  confirmed: boolean
  signatureInfo: IGenericSignaturesVerificationResult
}

class IdentityConfirmationService {
  async generateTemplate(): Promise<string> {
    const response = await api.get('/identity/confirmation/template')
    return response.data
  }

  async submitSigned(payload: ISubmitSignedPayload): Promise<IIdentityConfirmationResponse> {
    const formData = new FormData()
    formData.append('file', payload.file)

    const response = await api.post<IIdentityConfirmationResponse>('/identity/confirmation/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }
}

export const identityConfirmationService = new IdentityConfirmationService()
