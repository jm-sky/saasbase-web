<script lang="ts" setup>
import MailBox from '@/components/MailBox/MailBox.vue';
import { accounts, mails } from '@/data/mails';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
</script>

<template>
  <AuthenticatedLayout>
    <MailBox
      :accounts="accounts"
      :mails="mails"
      :nav-collapsed-size="4"
    />
  </AuthenticatedLayout>
</template>
