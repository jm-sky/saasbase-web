<script setup lang="ts">
import { useForm } from 'vee-validate'
import { h, ref } from 'vue'
import { FileUpload } from '@/components/Inputs'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { userProfileImageService } from '@/domains/user/services/userProfileImageService'
import { userProfilechema } from '@/domains/user/validation/profileSchema'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import SettingsHeader from './partials/SettingsHeader.vue'

const authStore = useAuthStore()
const isUploading = ref(false)
const avatarFile = ref<File[]>()


const { handleSubmit, resetForm } = useForm({
  validationSchema: userProfilechema,
  initialValues: { ...authStore.userData },
})

const handleAvatarUpload = async () => {
  if (!avatarFile.value?.[0]) return

  try {
    isUploading.value = true
    await userProfileImageService.upload(avatarFile.value[0])
    toast.success('Profile image updated successfully')
    await authStore.refresh()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to update profile image', error)
  } finally {
    isUploading.value = false
    avatarFile.value = []
  }
}

const onSubmit = handleSubmit((values) => {
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
})
</script>

<template>
  <SettingsHeader title="Profile" description="This is how others will see you on the site.">
    <template #right>
      <Avatar class="size-16">
        <AvatarImage
          :src="authStore.user?.avatarUrl ?? ''"
          :alt="authStore.user?.initials"
        />
        <AvatarFallback>{{ authStore.user?.initials }}</AvatarFallback>
      </Avatar>
    </template>
  </SettingsHeader>

  <Separator />

  <form class="grid grid-cols-2 gap-x-4 gap-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="firstName">
      <FormItem>
        <FormLabel>First name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your public display name.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="lastName">
      <FormItem>
        <FormLabel>Last name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your public display family name.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="description">
      <FormItem class="col-span-full">
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Tell us a little bit about yourself"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="col-span-full flex gap-2 justify-start">
      <Button type="submit">
        Update profile
      </Button>

      <Button
        type="button"
        variant="outline"
        @click="resetForm"
      >
        Reset form
      </Button>
    </div>

    <!-- Profile Image Upload Section -->
    <div class="col-span-full flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <h4 class="text-sm font-medium mb-2">
            Profile Image
          </h4>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <FileUpload
                v-model="avatarFile"
                accept="image/jpeg,image/png,image/gif"
                :multiple="false"
                :disabled="isUploading"
              />
              <Button
                :disabled="!avatarFile?.length || isUploading"
                :loading="isUploading"
                @click="handleAvatarUpload"
              >
                Upload Image
              </Button>
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-sm text-muted-foreground">
                Upload a new profile image. Supported formats: JPG, PNG, GIF
              </p>
              <p class="text-sm text-muted-foreground">
                Maximum file size: 5MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
