# Plan: AddProjectPage `statusId`

## Problem

`AddProjectPage` posts only `name` / `description`. Backend
`CreateProjectRequest` requires `statusId` (ULID of `project_statuses`). Create
always 422. Endpoint `GET /api/v1/project-statuses` already exists.

## Scope

Frontend only. Fix create payload types, schema, picker, and page.

## Implementation

1. Types (`project.type.ts`):
   - `IProjectStatus` (`id`, `name`, `color`, `sortOrder`, `isDefault`, …)
   - `IProjectCreatePayload`: `name`, `description?`, `statusId`, `startDate?`,
     `endDate?` (not `Omit<IProject, …>`).
2. `projectStatusService` → `GET /project-statuses` (collection).
3. `ProjectStatusPicker.vue` (pattern: `NumberingTemplatePicker`):
   - Load statuses on mount
   - Prefer `isDefault` for initial selection when model empty
4. `AddProjectPage.vue`:
   - Form field `statusId` + picker
   - Zod: `statusId` required non-empty string
   - Submit `IProjectCreatePayload` only
5. i18n pl/en for status field labels / empty state.

## Acceptance

- Creating a project with a selected status returns 201 and redirects to show.
- Missing status blocked client-side before request.

## Out of scope

CRUD UI for managing project statuses; fixing unrelated project domain drift
(`status` string enum vs `statusId`).
