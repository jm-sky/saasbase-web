<script lang="ts" setup>
import MailBox from '@/components/MailBox/MailBox.vue';
import { accounts, mails } from '@/data/mails';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
</script>

<template>
  <AuthenticatedLayout>
    <div class="md:hidden">
      <image
        src="/examples/mail-dark.png"
        :width="1280"
        :height="727"
        alt="Mail"
        class="hidden dark:block"
      />
      <image
        src="/examples/mail-light.png"
        :width="1280"
        :height="727"
        alt="Mail"
        class="block dark:hidden"
      />
    </div>
    <div class="hidden flex-col md:flex">
      <MailBox
        :accounts="accounts"
        :mails="mails"
        :nav-collapsed-size="4"
      />
    </div>
  </AuthenticatedLayout>
</template>
