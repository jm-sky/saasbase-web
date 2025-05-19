<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { useAccountStore } from '@/domains/account/stores/account.store'

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  message: z.string().optional(),
})

const store = useAccountStore()
const toast = useToast()
const loading = ref(false)

const { handleSubmit, setValues, values: form, errors } = useForm({
  validationSchema: toTypedSchema(inviteSchema),
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await store.inviteFriend(values)
    toast.toast({
      title: 'Success',
      description: 'Invitation sent successfully',
      variant: 'success',
    })
    setValues({ email: '', message: '' })
  } catch {
    // Error is already handled by the service
  } finally {
    loading.value = false
  }
})

const handleReset = () => {
  setValues({ email: '', message: '' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Invite a Friend
      </h2>
      <Button
        variant="outline"
        class="metronic-primary-outline"
        @click="handleReset"
      >
        Reset
      </Button>
    </div>

    <div class="card">
      <form class="space-y-6 p-6" @submit.prevent="onSubmit">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email Address</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter your friend's email address"
              :class="{ 'border-destructive': errors.email }"
            />
            <p v-if="errors.email" class="text-sm text-destructive">
              {{ errors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              v-model="form.message"
              placeholder="Add a personal message to your invitation"
              rows="4"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <Button
            type="submit"
            :disabled="loading"
            class="metronic-primary"
          >
            <span v-if="loading" class="mr-2 h-4 w-4 animate-spin">⟳</span>
            Send Invitation
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
