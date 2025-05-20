import api from '@/lib/api'
import type { IApplicationInvitation, ISendInvitationRequest } from '../types/invitation.type'
import type { IResource } from '@/domains/shared/types/resource.type'

class ApplicationInvitationService {
  async show(token: string): Promise<IApplicationInvitation> {
    const response = await api.get<{ data: IApplicationInvitation }>(`/application/invitations/${token}`)
    return response.data.data
  }

  async send(data: ISendInvitationRequest): Promise<IApplicationInvitation> {
    const response = await api.post<{ data: IApplicationInvitation }>('/application/invitations/invite', data)
    return response.data.data
  }

  async accept(token: string): Promise<IApplicationInvitation> {
    const response = await api.post<{ data: IApplicationInvitation }>(`/application/invitations/${token}/accept`)
    return response.data.data
  }

  async reject(token: string): Promise<IApplicationInvitation> {
    const response = await api.post<{ data: IApplicationInvitation }>(`/application/invitations/${token}/reject`)
    return response.data.data
  }

  async list(): Promise<IResource<IApplicationInvitation>> {
    const response = await api.get<IResource<IApplicationInvitation>>('/application/invitations')
    return response.data
  }

  async cancel(invitationId: string): Promise<IApplicationInvitation> {
    const response = await api.delete<{ data: IApplicationInvitation }>(`/application/invitations/${invitationId}`)
    return response.data.data
  }

  async resend(invitationId: string): Promise<IApplicationInvitation> {
    const response = await api.post<{ data: IApplicationInvitation }>(`/application/invitations/${invitationId}/resend`)
    return response.data.data
  }
}

export const applicationInvitationService = new ApplicationInvitationService()
