<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { useAccountStore } from '@/domains/account/stores/account.store'
import { profileSchema } from '@/domains/account/validation/profileSchema'

const store = useAccountStore()
const toast = useToast()
const loading = ref(false)

const { handleSubmit, setValues, values: form, errors } = useForm({
  validationSchema: toTypedSchema(profileSchema),
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await store.updateProfile(values)
    toast.toast({
      title: 'Success',
      description: 'Profile updated successfully',
      variant: 'success',
    })
  } catch {
    // Error is already handled by the service
  } finally {
    loading.value = false
  }
})

const handleReset = () => {
  if (store.profile) {
    setValues({
      firstName: store.profile.firstName,
      lastName: store.profile.lastName,
      email: store.profile.email,
      phone: store.profile.phone ?? '',
      company: store.profile.company ?? '',
      position: store.profile.position ?? '',
    })
  }
}

onMounted(async () => {
  if (!store.isProfileLoaded) {
    await store.fetchProfile()
  }
  handleReset()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Profile
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <Label for="firstName">First Name</Label>
            <Input
              id="firstName"
              v-model="form.firstName"
              :class="{ 'border-destructive': errors.firstName }"
            />
            <p v-if="errors.firstName" class="text-sm text-destructive">
              {{ errors.firstName }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="lastName">Last Name</Label>
            <Input
              id="lastName"
              v-model="form.lastName"
              :class="{ 'border-destructive': errors.lastName }"
            />
            <p v-if="errors.lastName" class="text-sm text-destructive">
              {{ errors.lastName }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              :class="{ 'border-destructive': errors.email }"
            />
            <p v-if="errors.email" class="text-sm text-destructive">
              {{ errors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="phone">Phone</Label>
            <Input
              id="phone"
              v-model="form.phone"
              type="tel"
              :class="{ 'border-destructive': errors.phone }"
            />
            <p v-if="errors.phone" class="text-sm text-destructive">
              {{ errors.phone }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="company">Company</Label>
            <Input
              id="company"
              v-model="form.company"
              :class="{ 'border-destructive': errors.company }"
            />
            <p v-if="errors.company" class="text-sm text-destructive">
              {{ errors.company }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="position">Position</Label>
            <Input
              id="position"
              v-model="form.position"
              :class="{ 'border-destructive': errors.position }"
            />
            <p v-if="errors.position" class="text-sm text-destructive">
              {{ errors.position }}
            </p>
          </div>
        </div>

        <div class="flex justify-end">
          <Button
            type="submit"
            :disabled="loading"
            class="metronic-primary"
          >
            <span v-if="loading" class="mr-2 h-4 w-4 animate-spin">⟳</span>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
