<script setup lang="ts">
import { CheckCircleIcon } from 'lucide-vue-next'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const TIMEOUT = 3000

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const sessionId = computed(() => route.query.session_id as string)
const sourcePath = computed(() => route.query.source_path as string)

const redirect = () => {
  setTimeout(() => {
    void router.push(sourcePath.value)
  }, TIMEOUT)
}

onMounted(() => {
  if (sessionId.value) {
    redirect()
  }
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="flex flex-col gap-4 p-8 mx-auto max-w-md">
      <h1 class="text-center text-2xl font-bold">
        {{ t('billing.checkout.success.title') }}
      </h1>
      <div class="flex flex-col items-center justify-center gap-4">
        <CheckCircleIcon class="size-10 text-success" />
        <div class="text-sm text-muted-foreground">
          {{ t('billing.checkout.success.description') }}
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>