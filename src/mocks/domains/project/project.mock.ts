import { HttpStatusCode } from 'axios'
import { type AxiosRequestConfig } from 'axios'
import { ProjectFactory } from '@/mocks/domains/project/projectFactory'
import { sendResponse, validationError } from '@/mocks/helpers/utils'
import { createProjectSchema, updateProjectSchema } from '@/schemas/project.schema'
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { MockStorage } from '@/mocks/mock.type'

export const setupProjectMocks = (mock: AxiosMockAdapter, storage: MockStorage) => {
  // Create
  mock.onPost('/projects').reply(async (config: AxiosRequestConfig) => {
    const payload = JSON.parse(config.data)
    const { value, errors } = await createProjectSchema.parse(payload)

    if (!value) return validationError(errors)

    const project = ProjectFactory.createProject(value)
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
  mock.onPut(/\/projects\/\w+/).reply(async (config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const payload = JSON.parse(config.data)
    const { value, errors } = await updateProjectSchema.parse(payload)

    if (!value) return validationError(errors)

    const index = storage.projects.findIndex(p => p.id === id)
    if (index === -1) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Project not found' } }, 'updateProject')
    }

    const updatedProject = { ...storage.projects[index], ...value, updatedAt: new Date().toISOString() }
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
