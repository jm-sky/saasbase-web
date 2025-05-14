<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import { contractorService } from '@/domains/contractor/services/contractorService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IContractor } from '@/domains/contractor/models/contractor.model'

const { t } = useI18n()
const route = useRoute()
const contractorId = route.params.id as string

const contractor = ref<IContractor>()
const loading = ref(false)
const error = ref<string | null>(null)

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    contractor.value = await contractorService.get(contractorId)
  } catch (err) {
    handleErrorWithToast(t('contractor.show.error'), err)
    error.value = 'Failed to load contractor'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="p-6 flex flex-col gap-y-4">
      <div class="border px-4 py-2 rounded-md">
        <div class="flex justify-between items-center">
          <div class="font-semibold">
            {{ contractor?.name ?? '...' }}
          </div>
          <div class="flex gap-2">
            <ButtonLink variant="default" :to="`/contractors/${contractorId}/edit`">
              Edit
            </ButtonLink>
          </div>
        </div>
        <!-- TODO: Add tabs to show addresses and bank accounts and contact persons -->
      </div>

      <div class="border px-4 py-2 rounded-md grid grid-cols-2 gap-x-8 gap-y-2">
        <div class="flex flex-col gap-2">
          <div class="font-semibold">
            Name
          </div>
          <div>{{ contractor?.name }}</div>
          <div class="font-semibold">
            Description
          </div>
          <div>{{ contractor?.description }}</div>
          <div class="font-semibold">
            Tax ID
          </div>
          <div>{{ contractor?.taxId }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="font-semibold">
            Email
          </div>
          <div>{{ contractor?.email }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="font-semibold">
            Phone
          </div>
          <div>{{ contractor?.phone }}</div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
