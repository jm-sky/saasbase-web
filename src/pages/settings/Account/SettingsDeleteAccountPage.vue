<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import SettingsHeader from '../partials/SettingsHeader.vue'

const formValues = ref({
  deleteAccount: false,
})
</script>


<template>
  <SettingsHeader title="Delete Account" description="Manage your API keys." />

  <div class="flex flex-col lg:py-7.5 lg:gap-7.5 gap-3">
    <div class="flex flex-col gap-5">
      <div class="text-sm text-foreground">
        We regret to see you leave. Confirm account deletion below. Your data will be permanently removed. Thank you for being part of our
        community. Please check our
        <a class="kt-link" href="#">
          Setup Guidelines
        </a>
        if you still wish continue.
      </div>
      <label class="kt-label">
        <input
          v-model="formValues.deleteAccount"
          class="kt-checkbox kt-checkbox-sm"
          name="delete"
          type="checkbox"
          value="1"
        >
        Confirm deleting account
      </label>
    </div>
    <div class="flex justify-end gap-2.5">
      <Button variant="outline" disabled>
        Deactivate Instead
      </Button>
      <Button variant="destructive" disabled>
        Delete Account
      </Button>
    </div>
  </div>
</template>
