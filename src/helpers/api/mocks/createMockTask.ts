import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import { taskPriorities, taskStatuses } from '@/constants/status'
import type { ITask } from '@/models/task.model'

export const createMockTask = (overrides: Partial<ITask> = {}): ITask => {
  return {
    id: v4(),
    projectId: v4(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(taskStatuses),
    priority: faker.helpers.arrayElement(taskPriorities),
    assignedToId: faker.helpers.arrayElement([v4(), undefined]),
    createdById: v4(),
    dueDate: faker.helpers.arrayElement([formatISO(faker.date.future()), undefined]),
    createdAt: formatISO(new Date()),
    updatedAt: formatISO(new Date()),
    ...overrides,
  }
}
