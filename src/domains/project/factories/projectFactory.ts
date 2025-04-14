import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import { type IProject } from '../types/project.type'

export class ProjectFactory {
  static createProject(overrides: Partial<IProject> = {}): IProject {
    return {
      id: v4(),
      tenantId: v4(),
      name: faker.company.name(),
      description: faker.helpers.arrayElement([faker.lorem.paragraph(), undefined]),
      status: faker.helpers.arrayElement(['active', 'archived', 'completed']),
      ownerId: v4(),
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
      ...overrides,
    }
  }
}
