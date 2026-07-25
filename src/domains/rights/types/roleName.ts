/** Mirrors backend App\Domain\Rights\Enums\RoleName values. */
export const RoleName = {
  Admin: 'Admin',
  Owner: 'Owner',
  Manager: 'Manager',
  FinancialManager: 'FinancialManager',
  ProjectManager: 'ProjectManager',
  ProjectMember: 'ProjectMember',
  User: 'User',
} as const

export type TRoleName = (typeof RoleName)[keyof typeof RoleName]

export const OWNER_OR_ADMIN_ROLES: readonly TRoleName[] = [RoleName.Owner, RoleName.Admin]
