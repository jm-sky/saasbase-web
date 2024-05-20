<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslate } from '@/composables/useTranslate';
import axios from '@/helpers/axios';

const tr = useTranslate();

interface PublicUser {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
}

const isLoading = ref(false);
const users = ref<PublicUser[]>([]);

const refresh = async () => {
  try {
    isLoading.value = true;
    users.value = (await axios.get<{ users: PublicUser[] }>('/api/users?limit=5')).data.users;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => refresh());
</script>

<template>
  <Card class="col-span-3">
    <CardHeader>
      <CardTitle class="flex flex-row gap-2 justify-between">
        {{ tr('RecentSales') }}
        <button class="opacity-85 text-sm">
          <i
            class="fa-solid fa-refresh"
            :class="{ 'fa-spin': isLoading }"
            @click="refresh()"
          />
        </button>
      </CardTitle>
      <CardDescription>
        You made 265 sales this month.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <!-- <pre class="text-sm border p-1">{{ users }}</pre> -->
      <div class="space-y-8">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center"
        >
          <Avatar class="size-9">
            <AvatarImage
              :src="user.image"
              alt="Avatar"
            />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div class="ml-4 space-y-1">
            <p class="text-sm font-medium leading-none">
              {{ user.firstName }} {{ user.lastName }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ user.email }}
            </p>
          </div>
          <div class="ml-auto font-medium">
            +$1,999.00
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
