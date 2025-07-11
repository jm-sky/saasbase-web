import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import { routeMap } from '../routeMap'
import type { RouteRecordRaw } from 'vue-router'

export const tenantRoutes: RouteRecordRaw[] = [
  {
    path: '/tenants/create',
    name: 'createTenant',
    component: () => import('@/pages/tenant/CreateTenantPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/tenants/welcome',
    name: 'welcomeTenant',
    component: () => import('@/pages/tenant/TenantWelcomePage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/tenants',
    name: 'tenants',
    component: () => import('@/pages/tenant/SelectTenantPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/tenants/:id/financial-settings',
    name: 'showTenantFinancialSettings',
    redirect: { name: routeMap.tenant.financialSettings.numberingTemplates },
    component: () => import('@/pages/tenant/TenantFinancialSettingsPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
    children: [
      {
        path: 'invoice-templates',
        name: routeMap.tenant.financialSettings.invoiceTemplates,
        component: () => import('@/pages/tenant/FinancialSettings/InvoiceTemplatesPage.vue'),
      },
      {
        path: 'invoice-templates/create/:parentId?',
        name: routeMap.tenant.financialSettings.invoiceTemplatesCreate,
        component: () => import('@/pages/tenant/FinancialSettings/EditInvoiceTemplatesPage.vue'),
      },
      {
        path: 'invoice-templates/edit/:templateId?',
        name: routeMap.tenant.financialSettings.invoiceTemplatesEdit,
        component: () => import('@/pages/tenant/FinancialSettings/EditInvoiceTemplatesPage.vue'),
      },
      {
        path: 'numbering-templates',
        name: routeMap.tenant.financialSettings.numberingTemplates,
        component: () => import('@/pages/tenant/FinancialSettings/NumberingTemplatesPage.vue'),
        meta: {
          title: 'invoice.numberingTemplate.title',
        },
      },
    ],
  },
  {
    path: '/tenants/:id/user-settings',
    name: 'showTenantUserSettings',
    redirect: { name: routeMap.tenant.userSettings.organizationUnits },
    component: () => import('@/pages/tenant/TenantUserSettingsPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
    children: [
      {
        path: 'organization-units/:unitId',
        name: routeMap.tenant.userSettings.organizationUnit,
        component: () => import('@/pages/tenant/ShowOrganizationUnitPage.vue'),
        meta: {
          title: 'tenant.organizationUnits.show.title',
        },
      },
      {
        path: 'organization-units',
        name: routeMap.tenant.userSettings.organizationUnits,
        component: () => import('@/pages/tenant/UserSettings/TenantOrganizationUnitsPage.vue'),
      },
      {
        path: 'invitations',
        name: routeMap.tenant.userSettings.invitations,
        component: () => import('@/pages/tenant/UserSettings/TenantInvitationsPage.vue'),
      },
    ],
  },
  {
    path: '/tenants/:id/show',
    name: 'showTenant',
    redirect: { name: 'tenant.show.overview' },
    component: () => import('@/pages/tenant/ShowTenantPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
    children: [
      {
        path: 'overview',
        name: 'tenant.show.overview',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantOverviewPage.vue'),
      },
      {
        path: 'branding',
        name: 'tenant.show.branding',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantBrandingPage.vue'),
      },
      {
        path: 'integrations/:integrationId?',
        name: 'tenant.show.integrations',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantIntegrationsPage.vue'),
      },
      {
        path: 'public-profile',
        name: 'tenant.show.public-profile',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantPublicProfilePage.vue'),
      },
      {
        path: 'settings',
        name: 'tenant.show.settings',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantSettingsPage.vue'),
      },
      {
        path: 'logs',
        name: 'tenant.show.logs',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantLogsPage.vue'),
      },
      {
        path: 'billing',
        component: () => import('@/pages/tenant/ShowTenantPage/BillingPage.vue'),
        children: [
          {
            path: '',
            redirect: { name: 'tenant-billing-overview' },
            name: 'tenant-billing',
          },
          {
            path: 'overview',
            name: 'tenant-billing-overview',
            component: () => import('@/pages/tenant/ShowTenantPage/Billing/OverviewPage.vue'),
          },
          {
            path: 'plans',
            name: 'tenant-billing-plans',
            component: () => import('@/pages/tenant/ShowTenantPage/Billing/PlansPage.vue'),
          },
          {
            path: 'history',
            name: 'tenant-billing-history',
            component: () => import('@/pages/tenant/ShowTenantPage/Billing/HistoryPage.vue'),
          },
        ],
      },
    ],
  },
]
