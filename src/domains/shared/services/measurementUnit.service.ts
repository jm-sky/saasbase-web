import api from '@/lib/api'
import type { IMeasurementUnit } from '../types/measurementUnit.type'
import type { IResourceCollection } from '../types/resource.type'

export class MeasurementUnitService {
  async index(): Promise<IMeasurementUnit[]> {
    const response = await api.get<IResourceCollection<IMeasurementUnit>>('/measurement-units')
    return response.data.data
  }
}

export const measurementUnitService = new MeasurementUnitService()