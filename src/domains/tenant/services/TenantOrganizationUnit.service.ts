import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IOrganizationUnit, IOrganizationUnitAssignUser, IOrganizationUnitCreate, IOrganizationUnitPositionCreate } from '../types/organizationUnit.type'
import type { TUUID } from '@/domains/shared/types/common'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

class TenantOrganizationUnitService {
  async index(tenantId: TUUID) {
    const response = (await api.get<IResourceCollection<IOrganizationUnit>>(`${apiRoutesMap.tenants}/${tenantId}/organization-units`)).data
    return response
  }

  async show(tenantId: TUUID, id: TUUID) {
    const response = (await api.get<{ data: IOrganizationUnit }>(`${apiRoutesMap.tenants}/${tenantId}/organization-units/${id}`)).data
    return response.data
  }

  async create(tenantId: TUUID, data: IOrganizationUnitCreate) {
    const response = (await api.post<{ data: IOrganizationUnit }>(`${apiRoutesMap.tenants}/${tenantId}/organization-units`, data)).data
    return response.data
  }

  async update(tenantId: TUUID, id: TUUID, data: IOrganizationUnit) {
    const response = (await api.put<{ data: IOrganizationUnit }>(`${apiRoutesMap.tenants}/${tenantId}/organization-units/${id}`, data)).data
    return response.data
  }

  async delete(tenantId: TUUID, id: TUUID) {
    const response = (await api.delete<{ data: IOrganizationUnit }>(`${apiRoutesMap.tenants}/${tenantId}/organization-units/${id}`)).data
    return response.data
  }

  async assignUser(tenantId: TUUID, data: IOrganizationUnitAssignUser) {
    const response = (await api.post<{ data: IOrganizationUnit }>(`${apiRoutesMap.tenants}/${tenantId}/organization-units/${data.unitId}/users`, data)).data
    return response.data
  }

  async addPosition(tenantId: TUUID, data: IOrganizationUnitPositionCreate) {
    const response = (await api.post<{ data: IOrganizationUnit }>(`${apiRoutesMap.tenants}/${tenantId}/organization-units/${data.unitId}/positions`, data)).data
    return response.data
  }
}

export const tenantOrganizationUnitService = new TenantOrganizationUnitService()
