<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import InfoSection from '@/components/Sections/InfoSection.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import ContractorAttachmentsList from '@/domains/contractor/components/ContractorAttachmentsList.vue'
import ContractorBankAccountsList from '@/domains/contractor/components/ContractorBankAccountsList.vue'
import ContractorContactsList from '@/domains/contractor/components/ContractorContactsList.vue'
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
    <div class="p-6 flex flex-col gap-y-6">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div>
          <div class="font-bold">
            Contractor details
          </div>
          <div class="text-sm text-muted-foreground">
            <RouterLink to="/contractors">
              Contractors
            </RouterLink>
          </div>
        </div>
        <div class="flex flex-row items-center justify-end gap-2">
          <ButtonLink variant="default" :to="`/contractors/${contractorId}/edit`">
            Edit
          </ButtonLink>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-[1fr_4fr] gap-6">
        <div class="flex flex-col text-center gap-2 border rounded-md p-4 shadow-xs">
          <Avatar size="lg" class="mx-auto">
            <AvatarImage :src="contractor?.logo ?? ''" :alt="contractor?.name" />
            <AvatarFallback>{{ contractor?.name.slice(0, 2) ?? 'X' }}</AvatarFallback>
          </Avatar>
          <div class="font-bold">
            {{ contractor?.name ?? '...' }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ contractor?.email ?? '...' }}
          </div>

          <Separator class="my-2" />

          <div class="flex flex-col gap-3 text-left">
            <InfoSection label="Description" :value="contractor?.description" />
            <InfoSection label="Tax ID" :value="contractor?.taxId" />
            <InfoSection label="Email" :value="contractor?.email" />
            <InfoSection label="Phone" :value="contractor?.phone" />
          </div>
          <Separator class="my-2" />
          <ContractorAttachmentsList />
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-row items-center gap-2 font-semibold text-primary">
            <div class="px-2 py-1 border-b-2 border-primary">
              Details
            </div>
          </div>
          <div class="flex flex-col gap-2 border rounded-md p-4 shadow-xs">
            <div class="font-bold">
              Description
            </div>
            <div class="text-muted-foreground">
              {{ contractor?.description }}
            </div>

            <Separator class="my-2" />

            <ContractorBankAccountsList />

            <Separator class="my-2" />

            <ContractorContactsList />
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
