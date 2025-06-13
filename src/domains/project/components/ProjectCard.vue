<script setup lang="ts">
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import DeleteProjectButton from '@/domains/project/components/DeleteProjectButton.vue'
import EditProjectButton from '@/domains/project/components/EditProjectButton.vue'
import { useProjectStore } from '../stores/project.store'
import type { IProject } from '@/domains/project/types/project.type'

const projectStore = useProjectStore()

defineProps<{
  project: IProject
}>()
</script>

<template>
  <RouterLink v-slot="{ navigate }" :to="`/projects/${project.id}/show/overview`" custom>
    <Card
      class="flex flex-col min-h-40 cursor-pointer shadow-md hover:border-primary hover:bg-primary-200/10 hover:shadow-lg transition-all duration-300"
      @click="projectStore.setProject(project); navigate()"
    >
      <CardHeader>
        <CardTitle class="flex items-center gap-3">
          <Avatar>
            <AvatarImage :src="project.logoUrl ?? ''" />
            <AvatarFallback>
              {{ project.name.slice(0, 2) }}
            </AvatarFallback>
          </Avatar>
          <span>
            {{ project.name }}
          </span>
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
          <EditProjectButton :id="project.id" @click.stop="projectStore.setProject(project)" />
          <DeleteProjectButton :id="project.id" @click.stop />
        </div>
      </CardFooter>
    </Card>
  </RouterLink>
</template>
