<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import DeleteProjectButton from '@/domains/project/components/DeleteProjectButton.vue'
import EditProjectButton from '@/domains/project/components/EditProjectButton.vue'
import { type IProjectFilters, projectService } from '@/domains/project/services/ProjectService'
import { useProjectStore } from '@/domains/project/stores/project.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import type { IProject } from '@/domains/project/types/project.type'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const { t } = useI18n()
const projectStore = useProjectStore()

const projects = ref<IProject[]>([])
const meta = ref<IResourceMeta>({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
})
const loading = ref(false)
const error = ref<string | null>(null)
const filters = ref<IProjectFilters>({
  search: '',
  page: 1,
  perPage: 10,
})

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await projectService.index(filters.value)
    projects.value = response.data
    meta.value = response.meta
  } catch (err) {
    error.value = 'Failed to load projects'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void refresh()
})

watch(filters, () => refresh(), { deep: true })
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper :title="t('project.title')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />
        <Button variant="outline" @click="refresh">
          <RefreshCw class="size-4" />
        </Button>
        <ButtonLink v-tooltip="t('project.add.description')" variant="default" to="/projects/add">
          {{ t('project.add.title') }}
        </ButtonLink>
      </template>

      <div class="grid grid-cols-4 gap-4">
        <Card v-for="project in projects" :key="project.id" class="flex flex-col shadow-md">
          <CardHeader>
            <CardTitle class="flex items-center gap-3">
              <Avatar>
                <AvatarImage :src="project.logoUrl ?? ''" />
                <AvatarFallback>
                  {{ project.name.slice(0, 2) }}
                </AvatarFallback>
              </Avatar>
              <RouterLink :to="`/projects/${project.id}/show/overview`" @click="projectStore.setProject(project)">
                {{ project.name }}
              </RouterLink>
            </CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col gap-2">
            <div class="text-muted-foreground">
              <p>{{ project.description }}</p>
            </div>
          </CardContent>
          <CardFooter class="mt-auto flex justify-between gap-2">
            <div class="flex flex-row">
              <RouterLink
                v-for="user in project.users.slice(0, 5)"
                :key="user.id"
                v-tooltip="user.name"
                :to="`/users/${user.id}/show/overview`"
                class="-ml-2 hover:z-10 hover:scale-105 transition-all duration-300"
              >
                <Avatar class="size-10">
                  <AvatarImage :src="user.avatarUrl ?? ''" />
                  <AvatarFallback>
                    {{ user.name.slice(0, 2) }}
                  </AvatarFallback>
                </Avatar>
              </RouterLink>
            </div>
            <div class="flex justify-end gap-2">
              <EditProjectButton :id="project.id" />
              <DeleteProjectButton :id="project.id" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
