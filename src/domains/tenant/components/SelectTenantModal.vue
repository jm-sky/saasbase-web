<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ModalComponent from '@/components/ModalComponent.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import SelectTenantForm from './SelectTenantForm.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const closeModal = () => {
  authStore.showSelectTenantModal = false
}
</script>

<template>
  <ModalComponent :title="t('auth.selectTenant.title')">
    <SelectTenantForm @selected="closeModal" />
  </ModalComponent>
</template>
