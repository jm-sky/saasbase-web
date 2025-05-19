import api from '@/lib/api'
import type { IInvitation, ISendInvitationRequest } from '../types/invitation.type'
import type { IResource } from '@/domains/shared/types/resource.type'

class InvitationService {
  async send(tenantId: string, data: ISendInvitationRequest): Promise<IInvitation> {
    const response = await api.post<{ data: IInvitation }>(`/tenants/${tenantId}/invite`, data)
    return response.data.data
  }

  async show(token: string): Promise<IInvitation> {
    const response = await api.get<{ data: IInvitation }>(`/invitations/${token}`)
    return response.data.data
  }

  async accept(token: string): Promise<IInvitation> {
    const response = await api.post<{ data: IInvitation }>(`/invitations/${token}/accept`)
    return response.data.data
  }

  async reject(token: string): Promise<IInvitation> {
    const response = await api.post<{ data: IInvitation }>(`/invitations/${token}/reject`)
    return response.data.data
  }

  async list(tenantId: string): Promise<IResource<IInvitation>> {
    const response = await api.get<IResource<IInvitation>>(`/tenants/${tenantId}/invitations`)
    return response.data
  }

  async cancel(tenantId: string, invitationId: string): Promise<IInvitation> {
    const response = await api.delete<{ data: IInvitation }>(`/tenants/${tenantId}/invitations/${invitationId}`)
    return response.data.data
  }

  async resend(tenantId: string, invitationId: string): Promise<IInvitation> {
    const response = await api.post<{ data: IInvitation }>(`/tenants/${tenantId}/invitations/${invitationId}/resend`)
    return response.data.data
  }
}

export const invitationService = new InvitationService()
