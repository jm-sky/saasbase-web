import type { TInvoiceStatus } from '@/domains/invoice/types/invoice.type'
import type { TProjectStatus } from '@/domains/project/types/project.type'
import type { TSkillLevel } from '@/domains/skill/types/skill.type'
import type { TTaskPriority, TTaskStatus } from '@/domains/task/types/task.type'

export const projectStatuses: TProjectStatus[] = ['active', 'archived', 'completed']
export const taskStatuses: TTaskStatus[] = ['todo', 'in_progress', 'done']
export const taskPriorities: TTaskPriority[] = ['low', 'medium', 'high']
export const invoiceStatuses: TInvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue']
export const skillLevels: TSkillLevel[] = ['beginner', 'intermediate', 'advanced']
