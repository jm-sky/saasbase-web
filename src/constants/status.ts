import type { TInvoiceStatus, TProjectStatus, TSkillLevel, TTaskPriority, TTaskStatus } from '@/types'

export const projectStatuses: TProjectStatus[] = ['active', 'archived', 'completed']
export const taskStatuses: TTaskStatus[] = ['todo', 'in_progress', 'done', 'archived']
export const taskPriorities: TTaskPriority[] = ['low', 'medium', 'high']
export const invoiceStatuses: TInvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue']
export const skillLevels: TSkillLevel[] = [1, 2, 3, 4, 5]
