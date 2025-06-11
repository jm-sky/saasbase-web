import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import type { RouteRecordRaw } from 'vue-router'

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: '/projects-board',
    name: 'projectsBoard',
    component: () => import('@/pages/project/ProjectBoardPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/pages/project/ProjectListPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/projects/add',
    name: 'addProject',
    component: () => import('@/pages/project/AddProjectPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/project/:id/show',
    name: 'showProject',
    component: () => import('@/pages/project/ShowProjectPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
    children: [
      {
        path: 'overview',
        name: 'showProjectOverview',
        component: () => import('@/pages/project/ShowProjectOverviewPage.vue'),
      },
      {
        path: 'comments',
        name: 'showProjectComments',
        component: () => import('@/pages/project/ShowProjectCommentsPage.vue'),
      },
      {
        path: 'logs',
        name: 'showProjectLogs',
        component: () => import('@/pages/project/ShowProjectLogsPage.vue'),
      },
    ],
  },
  {
    path: '/projects/:id/edit',
    name: 'editProject',
    component: () => import('@/pages/project/EditProjectPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
]
