<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NoItems from '@/components/DataLists/NoItems.vue'
import { FileUpload } from '@/components/Inputs'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Switch from '@/components/ui/switch/Switch.vue'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { userProfileImageService } from '@/domains/user/services/userProfileImageService'
import { type IUserProfile, userProfileService } from '@/domains/user/services/userProfileService'
import { userProfilechema } from '@/domains/user/validation/profileSchema'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import SettingsHeader from '../partials/SettingsHeader.vue'

const authStore = useAuthStore()
const { t } = useI18n()

const isLoading = ref(false)
const isUploading = ref(false)
const isRemoving = ref(false)
const avatarFiles = ref<File[]>()

const profile = ref<IUserProfile>()

const avatarFile = computed({
  get() {
    return avatarFiles.value?.[0]
  },
  set(value) {
    avatarFiles.value = value ? [value] : []
  },
})

const { handleSubmit, setValues, resetForm } = useForm<IUserProfile>({
  validationSchema: userProfilechema,
  initialValues: {
    isPublicProfile: false,
    email: authStore.userData?.email ?? '',
    phone: '',
    bio: '',
    location: '',
    birthDate: '',
    position: '',
    website: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
    }
  },
})

const handleAvatarUpload = async () => {
  if (!avatarFile.value) return

  try {
    isUploading.value = true
    await userProfileImageService.upload(avatarFile.value)
    toast.success(t('settings.profile.profileImage.success'))
    await authStore.refresh()
  } catch (error: unknown) {
    handleErrorWithToast(t('settings.profile.profileImage.failedToUpload'), error)
  } finally {
    isUploading.value = false
    avatarFiles.value = []
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await userProfileService.update(values)
    toast.success('Profile updated successfully')
  } catch (error: unknown) {
    handleErrorWithToast(t('settings.profile.failedToUpdate'), error)
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
    handleErrorWithToast(t('settings.profile.profileImage.failedToRemove'), error)
  } finally {
    isRemoving.value = false
  }
}

const refresh = async () => {
  try {
    isLoading.value = true
    profile.value = await userProfileService.get()
    setValues({
      bio: profile.value.bio ?? '',
      location: profile.value.location ?? '',
      email: authStore.userData?.email ?? profile.value.email ?? '',
      phone: profile.value.phone ?? '',
      isPublicProfile: profile.value.isPublicProfile,
      birthDate: profile.value.birthDate ?? '',
      position: profile.value.position ?? '',
      website: profile.value.website ?? '',
      socialLinks: {
        facebook: profile.value.socialLinks?.facebook ?? '',
        instagram: profile.value.socialLinks?.instagram ?? '',
        twitter: profile.value.socialLinks?.twitter ?? '',
        linkedin: profile.value.socialLinks?.linkedin ?? '',
        youtube: profile.value.socialLinks?.youtube ?? '',
      },
    })
  } catch (error: unknown) {
    console.error(error)
    handleErrorWithToast('Failed to refresh profile', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <SettingsHeader :title="t('settings.profile.title')" :description="t('settings.profile.description')">
    <template #right>
      <AvatarUploader
        v-if="authStore.user?.id"
        v-model="avatarFile"
        :model-id="authStore.user.id"
        :avatar-url="authStore.user.avatarUrl"
        :fallback-text="authStore.user.initials"
        :disabled="isUploading"
        avatar-class="size-16"
        auto-upload
        @upload="handleAvatarUpload"
        @remove="removeAvatar"
      />
    </template>
  </SettingsHeader>

  <Separator />

  <FormField v-slot="{ componentField }" name="isPublicProfile">
    <FormItem class="col-span-full flex items-center justify-between space-y-0">
      <FormLabel>{{ t('settings.profile.user.isPublicProfile') }}</FormLabel>
      <FormControl>
        <Switch v-bind="componentField" :checked="profile?.isPublicProfile" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>

  <Separator />
  <div class="flex flex-row items-center gap-2">
    <Badge
      v-for="skill in profile?.skills"
      :key="skill.id"
      variant="info-outline"
    >
      {{ skill.name }}
    </Badge>
    <NoItems v-if="!profile?.skills?.length" :message="t('settings.profile.skills.noSkills')" />
  </div>
  <Separator />

  <form class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8" :class="{ 'opacity-50': isLoading }" @submit="onSubmit">
    <div class="col-span-full flex items-center gap-2">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem class="w-full">
          <FormLabel>{{ t('settings.profile.user.email') }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="publicFields.email">
        <FormItem class="flex flex-col justify-center items-end">
          <FormLabel>{{ t('settings.profile.public') }}</FormLabel>
          <FormControl>
            <Switch v-bind="componentField" :checked="profile?.publicFields?.email" class="mb-0" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="col-span-full flex items-center gap-2">
      <FormField v-slot="{ componentField }" name="phone">
        <FormItem class="w-full">
          <FormLabel>{{ t('settings.profile.user.phone') }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="publicFields.phone">
        <FormItem class="flex flex-col justify-center items-end">
          <FormLabel>{{ t('settings.profile.public') }}</FormLabel>
          <FormControl>
            <Switch v-bind="componentField" :checked="profile?.publicFields?.phone" class="mb-0" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="col-span-full flex items-center gap-2">
      <FormField v-slot="{ componentField }" name="birthDate">
        <FormItem class="w-full">
          <FormLabel>{{ t('settings.profile.user.birthDate') }}</FormLabel>
          <FormControl>
            <Input type="date" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="publicFields.birthDate">
        <FormItem class="flex flex-col justify-center items-end">
          <FormLabel>{{ t('settings.profile.public') }}</FormLabel>
          <FormControl>
            <Switch v-bind="componentField" :checked="profile?.publicFields?.birthDate" class="mb-0" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <FormField v-slot="{ componentField }" name="location">
      <FormItem>
        <FormLabel>{{ t('settings.profile.user.location') }}</FormLabel>
        <FormControl>
          <Input v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="position">
      <FormItem>
        <FormLabel>{{ t('settings.profile.user.position') }}</FormLabel>
        <FormControl>
          <Input v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="website">
      <FormItem>
        <FormLabel>{{ t('settings.profile.user.website') }}</FormLabel>
        <FormControl>
          <Input v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="bio">
      <FormItem class="col-span-full">
        <FormLabel>{{ t('settings.profile.user.bio') }}</FormLabel>
        <FormControl>
          <Textarea
            :placeholder="t('settings.profile.user.descriptionPlaceholder')"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="col-span-full flex gap-2 justify-end">
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
                v-model="avatarFiles"
                accept="image/jpeg,image/png,image/gif"
                :multiple="false"
                :disabled="isUploading"
              />
              <Button
                :disabled="!avatarFiles?.length || isUploading"
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
