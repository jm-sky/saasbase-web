export const apiRoutesMap = {
  authLogin: '/auth/login',
  authRegister: '/auth/register',
  authLogout: '/auth/logout',
  me: '/me',
  users: '/users',
  projects: '/projects',
  tasks: '/tasks',
  contractors: '/contractors',
  invoices: '/invoices',
  products: '/products',
  comments: '/comments',
  tags: '/tags',
  skills: '/skills',
}

export const apiRoutes = {
  authLogin: () => apiRoutesMap.authLogin,
  authLogout: () => apiRoutesMap.authLogout,
  projects: () => apiRoutesMap.projects,
  tasks: () => apiRoutesMap.tasks,
  contractors: () => apiRoutesMap.contractors,
  invoices: () => apiRoutesMap.invoices,
  products: () => apiRoutesMap.products,
  comments: () => apiRoutesMap.comments,
  tags: () => apiRoutesMap.tags,
  skills: () => apiRoutesMap.skills,
}
