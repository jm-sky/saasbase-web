import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import { routeMap } from '../routeMap'


export const confirmIdentityRoutes = [
  {
    path: '/identity-confirmation/:type?',
    name: routeMap.identityConfirmation.index,
    component: () => import('@/pages/confirmIdentity/ConfirmIdentityPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
]
