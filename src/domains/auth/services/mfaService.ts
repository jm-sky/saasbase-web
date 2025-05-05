import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'

export interface MfaVerifyResponse {
  message: string
}

export interface MfaEnableResponse {
  message: string
}

export interface MfaDisableResponse {
  message: string
}

export interface MfaSetupResponse {
  secret: string
  qrCodeUrl: string
  recoveryCodes: string[]
}

class MfaService {
  async verify2fa(code: string) {
    const response = await api.post<MfaVerifyResponse>(apiRoutesMap.auth2faVerify, { code })
    return response.data
  }

  async setup2fa() {
    const response = await api.post<MfaSetupResponse>(apiRoutesMap.auth2faSetup)
    return response.data
  }

  async enable2fa(code: string) {
    const response = await api.post<MfaEnableResponse>(apiRoutesMap.auth2faSetup, { code })
    return response.data
  }

  async disable2fa() {
    const response = await api.post<MfaDisableResponse>(apiRoutesMap.auth2faDisable)
    return response.data
  }
}

export const mfaService = new MfaService()
