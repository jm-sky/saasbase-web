export const apiRoutesMap = {
  authLogin: '/api/auth/login',
  authRegister: '/api/auth/register',
  user: '/api/user',
  users: '/api/users',
  projects: '/api/projects',
  tasks: '/api/tasks',
  contractors: '/api/contractors',
  invoices: '/api/invoices',
  products: '/api/products',
  comments: '/api/comments',
  tags: '/api/tags',
}

export const apiRoutes = {
  authLogin: () => apiRoutesMap.authLogin,
  projects: () => apiRoutesMap.projects,
  tasks: () => apiRoutesMap.tasks,
  contractors: () => apiRoutesMap.contractors,
  invoices: () => apiRoutesMap.invoices,
  products: () => apiRoutesMap.products,
  comments: () => apiRoutesMap.comments,
  tags: () => apiRoutesMap.tags,
}
