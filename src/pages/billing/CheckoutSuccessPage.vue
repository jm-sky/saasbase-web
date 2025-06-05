<script setup lang="ts">
import { CheckCircleIcon } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const TIMEOUT = 10

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const timeLeft = ref(TIMEOUT)

const sessionId = computed(() => route.query.session_id as string)
const sourcePath = computed(() => route.query.source_path as string)

const redirect = () => {
  void router.push(sourcePath.value)
}

const countdown = () => {
  timeLeft.value--
  checkStatus()
  if (timeLeft.value <= 0) {
    redirect()
  }
}

const checkStatus = () => {
  // Fetch status from backend
  console.log('checkStatus', sessionId.value)
}

onMounted(() => {
  setInterval(countdown, 1000)
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="flex flex-col gap-4 p-8 mx-auto max-w-md">
      <div class="flex flex-col items-center justify-center gap-4">
        <CheckCircleIcon class="size-20 text-success" />
      </div>
      <h1 class="text-center text-3xl font-bold">
        {{ t('billing.checkout.success.title') }}
      </h1>
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="text-sm text-muted-foreground">
          {{ t('billing.checkout.success.description') }}
        </div>
      </div>
      <div class="text-center text-sm text-muted-foreground">
        {{ timeLeft }} {{ t('common.secondsLeft') }}
      </div>
      <div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-success/50 h-2.5 rounded-full transition-all duration-1000" :style="{ width: `${timeLeft / TIMEOUT * 100}%` }" />
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>