import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { IComment } from '@/models/comment.model'

export const createMockComment = (overrides: Partial<IComment> = {}): IComment => {
  return {
    id: v4(),
    userId: v4(),
    content: faker.lorem.paragraph(),
    commentableId: v4(),
    commentableType: faker.helpers.arrayElement(['Project', 'Task', 'Contractor', 'Invoice']),
    createdAt: formatISO(new Date()),
    ...overrides,
  }
}
