<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ModalComponent from '@/components/ModalComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import UserAuthForm from '@/domains/auth/components/UserAuthForm.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { useLogout } from '../composables/useLogout'

const { t } = useI18n()
const { logout } = useLogout()
const authStore = useAuthStore()

const closeModal = () => {
  authStore.showAuthModal = false
}
</script>

<template>
  <ModalComponent :title="t('auth.signIn')" disable-close>
    <UserAuthForm @logged-in="closeModal" />

    <Button variant="outline" @click="logout">
      {{ $t('auth.signOut') }}
    </Button>
  </ModalComponent>
</template>
