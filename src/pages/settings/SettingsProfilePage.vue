<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
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
import { userProfileService } from '@/domains/user/services/userProfileService'
import { userProfilechema } from '@/domains/user/validation/profileSchema'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import SettingsHeader from './partials/SettingsHeader.vue'

const authStore = useAuthStore()
const isUploading = ref(false)
const avatarFile = ref<File[]>()
const isRemoving = ref(false)
const { t } = useI18n()

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

const onSubmit = handleSubmit(async (values) => {
  try {
    await userProfileService.update(values)
    toast.success('Profile updated successfully')
  } catch (error: unknown) {
    handleErrorWithToast('Failed to update profile', error)
  } finally {
    await authStore.refresh()
  }
})

const removeAvatar = async () => {
  try {
    isRemoving.value = true
    await userProfileImageService.delete()
    toast.success('Profile image removed successfully')
    await authStore.refresh()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to remove profile image', error)
  } finally {
    isRemoving.value = false
  }
}
</script>

<template>
  <SettingsHeader :title="t('settings.profile.title')" :description="t('settings.profile.description')">
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
        <FormLabel>{{ t('settings.profile.user.firstName') }}</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          {{ t('settings.profile.user.firstNameDescription') }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="lastName">
      <FormItem>
        <FormLabel>{{ t('settings.profile.user.lastName') }}</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          {{ t('settings.profile.user.lastNameDescription') }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="birthDate">
      <FormItem class="col-span-full">
        <FormLabel>{{ t('settings.profile.user.birthDate') }}</FormLabel>
        <FormControl>
          <Input type="date" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="phone">
      <FormItem class="col-span-full">
        <FormLabel>{{ t('settings.profile.user.phone') }}</FormLabel>
        <FormControl>
          <Input type="tel" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="description">
      <FormItem class="col-span-full">
        <FormLabel>{{ t('settings.profile.user.description') }}</FormLabel>
        <FormControl>
          <Textarea
            :placeholder="t('settings.profile.user.descriptionPlaceholder')"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="col-span-full flex gap-2 justify-start">
      <Button type="submit">
        {{ t('settings.profile.updateProfile') }}
      </Button>

      <Button
        type="button"
        variant="outline"
        @click="resetForm"
      >
        {{ t('settings.profile.resetForm') }}
      </Button>
    </div>

    <Separator class="col-span-full" />

    <!-- Profile Image Upload Section -->
    <div class="col-span-full flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <h4 class="text-sm font-medium mb-2">
            {{ t('settings.profile.profileImage.title') }}
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
                {{ t('settings.profile.profileImage.uploadImage') }}
              </Button>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex flex-col gap-1 p-2">
                <p class="text-sm text-muted-foreground">
                  {{ t('settings.profile.profileImage.description') }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ t('settings.profile.profileImage.maxSize') }}
                </p>
              </div>
              <div v-if="authStore.user?.avatarUrl" class="flex justify-end mt-auto">
                <Button
                  type="button"
                  variant="destructive"
                  class="w-full"
                  :disabled="isRemoving"
                  :loading="isRemoving"
                  @click="removeAvatar"
                >
                  {{ t('settings.profile.profileImage.removeImage') }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
