import api from '@/lib/api'
import type { IAcceptInvitationRequest, IInvitation, ISendInvitationRequest } from '../types/invitation.type'
import type { IResource } from '@/domains/shared/types/resource.type'

class InvitationService {
  async send(tenantId: string, data: ISendInvitationRequest): Promise<IInvitation> {
    const response = await api.post<IInvitation>(`/tenants/${tenantId}/invite`, data)
    return response.data
  }

  async accept(token: string): Promise<IInvitation> {
    const response = await api.get<IInvitation>(`/invitations/${token}`)
    return response.data
  }

  async acceptInvitation(data: IAcceptInvitationRequest): Promise<IInvitation> {
    const response = await api.post<IInvitation>(`/invitations/${data.token}/accept`, data)
    return response.data
  }

  async list(tenantId: string): Promise<IResource<IInvitation>> {
    const response = await api.get<IResource<IInvitation>>(`/tenants/${tenantId}/invitations`)
    return response.data
  }
}

export const invitationService = new InvitationService()
