# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SaaSBase is a multi-tenant SaaS application built with Vue 3, TypeScript, and Vite. It provides comprehensive business management features including invoicing, expense tracking, project management, and more.

## Commands

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

### Code Quality
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm lint-fix` - Run ESLint with auto-fix (alias)
- `pnpm lint-only` - Run ESLint without auto-fix
- `pnpm type-check` - Run TypeScript type checking
- `pnpm check-all` - Run both type checking and linting

### Environment
- Create `.env` from `.env.example` and configure `VITE_API_URL`
- Package manager: `pnpm` (required)
- Node.js version: >=18

## Architecture

### Domain-Driven Structure
The application follows a domain-driven architecture with each business domain in `src/domains/`:

- **auth** - Authentication & authorization
- **account** - User account management
- **tenant** - Multi-tenant organization management
- **contractor** - Contractor/vendor management
- **product** - Product catalog management
- **invoice** - Invoice generation & management
- **expense** - Expense tracking
- **project** - Project management
- **chat** - Real-time chat & AI chat
- **subscription** - Billing & subscription management

Each domain contains:
- `components/` - Vue components specific to the domain
- `services/` - API communication services
- `store/` - Pinia state management
- `types/` - TypeScript type definitions
- `validation/` - Zod validation schemas

### Key Technologies
- **Vue 3** with Composition API (version 3.5+)
- **TypeScript** with strict type checking
- **Pinia** for state management
- **Vue Router** with middleware system
- **TailwindCSS** for styling (version 4)
- **Radix Vue** & **Reka UI** for UI components (from ShadCn-Vue)
- **Vee-Validate** + **Zod** for form validation
- **Axios** for API communication
- **Vue i18n** for internationalization

### Core Services
- **API Layer** (`src/lib/api/`) - Centralized HTTP client with interceptors
- **Authentication** - JWT-based auth with refresh tokens
- **Multi-tenancy** - Tenant-aware routing and API calls
- **Real-time** - WebSocket support via Pusher/Laravel Echo

### UI Components
- Base UI components in `src/components/ui/`
- Domain-specific components in respective domain folders
- Shared components in `src/components/`
- Layout components in `src/layouts/`

### Routing
- Route definitions in `src/router/routes/`
- Middleware system for authentication and authorization
- Automatic title generation from route meta

### State Management
- Domain stores in `src/domains/*/store/`
- Global stores in `src/stores/`
- Reactive configuration in `src/config.ts`
- Server-state/caching is TanStack Query's job, not Pinia's. New domains should
  fetch/mutate through `src/domains/*/composables/queryKeys.ts` +
  `use<Domain>Queries.ts` + `use<Domain>Mutations.ts` (see the `contractor`
  domain for the reference pattern), invalidating the relevant query keys on
  mutation success. Pinia stores stay scoped to client/UI state only (e.g. the
  currently-selected entity), not list/detail data fetched from the API.

## Development Guidelines

### File Organization
- Follow domain-driven structure
- Use TypeScript interfaces for all data structures
- Keep validation schemas co-located with domains
- Separate concerns: services for API, stores for state
- Pages are usually nested in layout component: AuthenticatedLayout or GuestLayout

### Code Style
- ESLint configuration with strict rules
- Prefer single quotes, no semicolons
- Use Composition API over Options API
- Follow Vue 3 best practices

### Multi-tenancy
- All API calls should be tenant-aware
- Use tenant middleware for protected routes
- Tenant context is managed globally

### Internationalization
- All user-facing text should use `t()` or `i18n.global.t()`
- Translation files in `src/i18n/locales/`
- Support for Polish (pl) and English (en)

### Testing
- Test framework: Vitest
- Test command: `pnpm test`
- Write tests for critical business logic

## Common Tasks

### Adding a New Domain
1. Create domain folder in `src/domains/`
2. Add components, services, stores, types
3. Register routes in `src/router/routes/`
4. Add to main navigation if needed

### Working with Forms
- Use Vee-Validate with Zod schemas
- Define validation in domain `validation/` folder
- Use form components from `src/components/ui/form/`

### API Integration
- Use services in domain `services/` folder
- Extend base API client from `src/lib/api/`
- Handle errors with toast notifications

### Adding UI Components
- Use Reka UI (was: Radix Vue) for headless components
- Style with TailwindCSS
- Follow existing component patterns
