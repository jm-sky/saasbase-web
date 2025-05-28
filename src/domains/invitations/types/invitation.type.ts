import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IUserPreview } from '@/domains/user/types/user.type'

export interface IApplicationInvitation {
  id: TUUID
  inviterId: TUUID
  email: string
  token: string
  status: string
  inviter: IUserPreview
  invitedUser?: IUserPreview
  acceptedAt?: TDateTime
  expiresAt: TDateTime
  createdAt?: TDateTime
  updatedAt?: TDateTime
}

export interface ISendInvitationRequest {
  email: string
  message?: string
}
