import { HttpStatusCode } from 'axios'
import { type AxiosRequestConfig } from 'axios'
import { createMockProject } from '@/helpers/api/mocks/createMockProject'
import { sendResponse, validationError } from '@/helpers/api/mocks/utils'
import { createProjectSchema, updateProjectSchema } from '@/schemas/project.schema'
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { MockStorage } from '@/helpers/api/mocks/mock.type'

export const setupProjectMocks = (mock: AxiosMockAdapter, storage: MockStorage) => {
  // Create
  mock.onPost('/projects').reply((config: AxiosRequestConfig) => {
    const payload = JSON.parse(config.data)
    const result = createProjectSchema.safeParse(payload)

    if (!result.success) return validationError(result.error.format())

    const project = createMockProject(result.data)
    storage.projects.push(project)

    const response = { status: HttpStatusCode.Created, data: project }
    return sendResponse(response, 'createProject')
  })

  // Read (List)
  mock.onGet('/projects').reply(() => {
    const projects = storage.projects
    const response = { status: HttpStatusCode.Ok, data: { projects } }
    return sendResponse(response, 'listProjects')
  })

  // Read (Single)
  mock.onGet(/\/projects\/\w+/).reply((config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const project = storage.projects.find(p => p.id === id)

    if (!project) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Project not found' } }, 'getProject')
    }

    const response = { status: HttpStatusCode.Ok, data: project }
    return sendResponse(response, 'getProject')
  })

  // Update
  mock.onPut(/\/projects\/\w+/).reply((config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const payload = JSON.parse(config.data)
    const result = updateProjectSchema.safeParse(payload)

    if (!result.success) return validationError(result.error.format())

    const index = storage.projects.findIndex(p => p.id === id)
    if (index === -1) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Project not found' } }, 'updateProject')
    }

    const updatedProject = { ...storage.projects[index], ...result.data, updatedAt: new Date().toISOString() }
    storage.projects[index] = updatedProject

    const response = { status: HttpStatusCode.Ok, data: updatedProject }
    return sendResponse(response, 'updateProject')
  })

  // Delete
  mock.onDelete(/\/projects\/\w+/).reply((config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const index = storage.projects.findIndex(p => p.id === id)

    if (index === -1) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Project not found' } }, 'deleteProject')
    }

    storage.projects.splice(index, 1)
    return sendResponse({ status: HttpStatusCode.NoContent, data: null }, 'deleteProject')
  })
}
