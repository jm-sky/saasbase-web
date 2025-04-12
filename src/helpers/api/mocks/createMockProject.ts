import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import { projectStatuses } from '@/constants/status'
import type { IProject } from '@/models/project.model'

export const createMockProject = (overrides: Partial<IProject> = {}): IProject => {
  return {
    id: v4(),
    tenantId: v4(),
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(projectStatuses),
    ownerId: v4(),
    createdAt: formatISO(new Date()),
    updatedAt: formatISO(new Date()),
    ...overrides,
  }
}
