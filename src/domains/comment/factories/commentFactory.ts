import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { IComment } from '@/domains/comment/models/comment.model'

export class CommentFactory {
  static createComment(overrides: Partial<IComment> = {}): IComment {
    return {
      id: v4(),
      userId: v4(),
      content: faker.lorem.paragraph(),
      commentableId: v4(),
      commentableType: faker.helpers.arrayElement(['Project', 'Task', 'Contractor', 'Invoice']),
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
      ...overrides,
    }
  }
}
