import { type IFeed, type IFeedCreate } from '@/domains/feed/types/feed.type'
import { buildSpatieQuery } from '@/domains/shared/helpers/filtering'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { SortingState } from '@tanstack/vue-table'
import type { FilterDefinition, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IFeedFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<string, FilterDefinition>
  sort?: SortingState
}

export interface IFeedCommentCreate {
  content: string
}

class FeedService {
  async index(filters?: IFeedFilters): Promise<IResourceCollection<IFeed>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = (await api.get<IResourceCollection<IFeed>>('/feeds', { params })).data
    return response
  }

  async get(id: string): Promise<IFeed> {
    const response = (await api.get<{ data: IFeed }>(`/feeds/${id}`)).data
    return response.data
  }

  async create(feed: IFeedCreate): Promise<IFeed> {
    const response = (await api.post<{ data: IFeed }>('/feeds', feed)).data
    return response.data
  }

  async update(id: string, feed: Partial<IFeed>): Promise<IFeed> {
    const response = (await api.patch<{ data: IFeed }>(`${apiRoutesMap.feeds}/${id}`, feed)).data
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/feeds/${id}`)
  }

  async publish(id: string): Promise<IFeed> {
    const response = (await api.post<{ data: IFeed }>(`${apiRoutesMap.feeds}/${id}/publish`)).data
    return response.data
  }

  // Comment endpoints
  async createComment(feedId: string, comment: IFeedCommentCreate): Promise<void> {
    await api.post(`/feeds/${feedId}/comments`, comment)
  }

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/feed-comments/${commentId}`)
  }
}

export const feedService = new FeedService()
