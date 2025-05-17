import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export interface IInvitation {
  id: TUUID
  tenantId: TUUID
  inviterId: TUUID
  email: string
  role: string
  token: string
  status: string
  acceptedAt?: TDateTime
  expiresAt: TDateTime
  createdAt?: TDateTime
  updatedAt?: TDateTime
}

export interface ISendInvitationRequest {
  email: string
  role: string
}

export interface IAcceptInvitationRequest {
  token: string
}
