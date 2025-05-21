import api from '@/lib/api'
import type { ISendInvitationRequest, ITenantInvitation } from '../types/invitation.type'
import type { IResource } from '@/domains/shared/types/resource.type'

class TenantInvitationService {
  async show(token: string): Promise<ITenantInvitation> {
    const response = await api.get<{ data: ITenantInvitation }>(`/tenant/invitations/${token}`)
    return response.data.data
  }

  async accept(token: string): Promise<ITenantInvitation> {
    const response = await api.post<{ data: ITenantInvitation }>(`/tenants/invitations/${token}/accept`)
    return response.data.data
  }

  async reject(token: string): Promise<ITenantInvitation> {
    const response = await api.post<{ data: ITenantInvitation }>(`/tenants/invitations/${token}/reject`)
    return response.data.data
  }

  async send(tenantId: string, data: ISendInvitationRequest): Promise<ITenantInvitation> {
    const response = await api.post<{ data: ITenantInvitation }>(`/tenants/${tenantId}/invitations`, data)
    return response.data.data
  }

  async list(tenantId: string): Promise<IResource<ITenantInvitation>> {
    const response = await api.get<IResource<ITenantInvitation>>(`/tenants/${tenantId}/invitations`)
    return response.data
  }

  async cancel(tenantId: string, invitationId: string): Promise<ITenantInvitation> {
    const response = await api.delete<{ data: ITenantInvitation }>(`/tenants/${tenantId}/invitations/${invitationId}`)
    return response.data.data
  }

  async resend(tenantId: string, invitationId: string): Promise<ITenantInvitation> {
    const response = await api.post<{ data: ITenantInvitation }>(`/tenants/${tenantId}/invitations/${invitationId}/resend`)
    return response.data.data
  }
}

export const tenantInvitationService = new TenantInvitationService()
