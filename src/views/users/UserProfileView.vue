<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Button from '@/components/ui/button/Button.vue'
import UIIcon from '@/components/UIIcon.vue'
import { userService } from '@/domains/user/services/userService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import type { PublicUser } from '@/domains/user/models/publicUser.model'

const route = useRoute()

const isLoading = ref(false)
const user = ref<undefined | PublicUser>()

const refresh = async () => {
  try {
    isLoading.value = true
    user.value = await userService.get(route.params.id as string)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => refresh())
</script>

<template>
  <AuthenticatedLayout>
    <div class="m-4 grid grid-cols-2 gap-4">
      <div class="col-span-full border rounded-lg p-4 flex flex-row items-center justify-between gap-4">
        <div class="flex flex-row items-center gap-2">
          <Avatar class="size-9">
            <AvatarImage
              :src="user?.image ?? ''"
              :alt="user?.initials"
            />
            <AvatarFallback>{{ user?.initials }}</AvatarFallback>
          </Avatar>
          <div class="font-bold text-lg">
            {{ user?.fullName ?? '-' }}
          </div>
        </div>
        <div class="flex flex-row gap-2 items-center justify-end">
          <Button
            variant="outline"
            size="xs"
          >
            <UIIcon icon="fa-regular:star" />
          </Button>
          <Button
            variant="outline"
            size="xs"
          >
            <UIIcon icon="fa-regular:envelope" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            @click="refresh()"
          >
            <UIIcon
              icon="fa-solid:sync"
              :class="{ 'fa-spin': isLoading }"
            />
          </Button>
        </div>
      </div>

      <div class="border rounded-lg p-5 flex flex-col gap-4 items-start">
        <div class="flex flex-row items-center gap-4">
          <UIIcon
            icon="fa-regular:check-circle"
            class="w-4"
          />
          #{{ route.params.id ?? '-' }}
        </div>
        <div
          v-if="user?.email"
          class="flex flex-row items-center gap-4"
        >
          <UIIcon
            icon="fa-regular:envelope"
            class="w-4"
          />
          <a
            :href="`mailto:${user?.email}`"
            class="hover:text-primary"
          >
            {{ user?.email ?? '-' }}
          </a>
        </div>
        <div
          v-if="user?.phone"
          class="flex flex-row items-center gap-4"
        >
          <UIIcon
            icon="fa-solid:phone"
            class="w-4"
          />
          <a
            :href="`tel:${user?.phone}`"
            class="hover:text-primary"
          >{{ user?.phone ?? '-' }}</a>
        </div>
        <div
          v-if="user?.address?.fullAddress"
          class="flex flex-row items-center gap-4"
        >
          <UIIcon
            icon="fa-solid:map-pin"
            class="w-4"
          />
          <a
            :href="`http://maps.google.com?q=${user?.address?.fullAddress}`"
            target="_blank"
            class="hover:text-primary"
            rel="noopener noreferrer"
          >
            {{ user?.address?.fullAddress }}
          </a>
        </div>
        <div class="flex flex-row items-center gap-4">
          <UIIcon
            icon="fa-solid:calendar"
            class="w-4"
          />
          {{ user?.createdAt ?? '-' }}
          {{ user?.createdAt }}
        </div>
      </div>

      <div class="border rounded-lg p-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. In veritatis obcaecati nihil dicta reiciendis itaque omnis velit, eaque atque harum cumque soluta vero vitae aliquid! Repudiandae, harum? Officia, quisquam explicabo!
      </div>
    </div>
  </AuthenticatedLayout>
</template>
