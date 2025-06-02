<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DataListSection from '@/components/DataLists/DataListSection.vue'
import NoItems from '@/components/DataLists/NoItems.vue'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { feedService } from '@/domains/feed/services/FeedService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import CreateFeedForm from './CreateFeedForm.vue'
import FeedItem from './FeedItem.vue'
import type { IFeed } from '@/domains/feed/types/feed.type'

const { t } = useI18n()

const feeds = ref<IFeed[]>([])
const loading = ref(false)
const createModalOpen = ref(false)
const showCreateForm = ref(false)
const editModalOpen = ref(false)
const editFeed = ref<IFeed>()

const refresh = async () => {
  loading.value = true
  try {
    const res = await feedService.index()
    feeds.value = res.data
  } catch (error) {
    handleErrorWithToast(t('feed.error.fetchingFeeds'), error)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const handleEdit = (feed: IFeed) => {
  editFeed.value = feed
  editModalOpen.value = true
}

const handleDelete = async (feed: IFeed) => {
  try {
    if (!confirm(t('feed.delete.confirmation'))) return
    await feedService.delete(feed.id)
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('feed.delete.error'), error)
  }
}
</script>

<template>
  <DataListSection
    :title="t('feed.title')"
    :loading="loading"
    @refresh="refresh"
    @add="createModalOpen = true"
  >
    <div class="flex flex-col gap-4 divide-y" :class="{ 'opacity-50': loading }">
      <FeedItem
        v-for="feed in feeds"
        :key="feed.id"
        :feed="feed"
        @edit="handleEdit"
        @delete="handleDelete"
      />
      <NoItems v-if="feeds.length === 0" class="py-10" />
    </div>

    <Separator class="my-4" />

    <div class="flex flex-col gap-4">
      <Button variant="outline" @click="showCreateForm = !showCreateForm">
        {{ t('feed.create.title') }}
      </Button>
    </div>

    <CreateFeedForm
      v-if="showCreateForm"
      v-model:open="createModalOpen"
      @create="refresh"
    />
  </DataListSection>
</template>
