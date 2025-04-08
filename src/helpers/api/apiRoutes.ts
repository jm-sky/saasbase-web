export const apiRoutesMap = {
  authLogin: '/api/auth/login',
  authRegister: '/api/auth/register',
  user: '/api/user',
  users: '/api/users',
}

export const apiRoutes = {
  authLogin: () => apiRoutesMap.authLogin,
}
