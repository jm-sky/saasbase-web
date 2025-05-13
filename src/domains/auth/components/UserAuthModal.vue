<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ModalComponent from '@/components/ModalComponent.vue'
import UserAuthForm from '@/domains/auth/components/UserAuthForm.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'

const { t } = useI18n()
const authStore = useAuthStore()

const closeModal = () => {
  authStore.showAuthModal = false
}
</script>

<template>
  <ModalComponent :title="t('auth.signIn')">
    <UserAuthForm @logged-in="closeModal" />
  </ModalComponent>
</template>
