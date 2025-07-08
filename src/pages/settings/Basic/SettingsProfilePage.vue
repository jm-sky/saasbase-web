<script setup lang="ts">
import { Edit, Plus } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import NoItems from '@/components/DataLists/NoItems.vue'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Switch from '@/components/ui/switch/Switch.vue'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import AddUserSkillModal from '@/domains/user/components/AddUserSkillModal.vue'
import UserSkillBadge from '@/domains/user/components/UserSkillBadge.vue'
import { userProfileImageService } from '@/domains/user/services/userProfileImageService'
import { type IUserProfile, userProfileService } from '@/domains/user/services/userProfileService'
import { userProfilechema } from '@/domains/user/validation/profileSchema'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import SettingsHeader from '../partials/SettingsHeader.vue'
import type { UploaderService } from '@/components/Inputs/uploader.type'

const authStore = useAuthStore()
const { t } = useI18n()

const isAddUserSkillModalOpen = ref(false)
const isLoading = ref(false)
const profile = ref<IUserProfile>()

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

const onAvatarUploaded = () => {
  toast.success(t('settings.profile.profileImage.success'))
}

const onAvatarRemoved = () => {
  toast.success('Profile image removed successfully')
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

const uploaderService: UploaderService = {
  upload: (modelId: string, file: File) => userProfileImageService.upload(file),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete: (modelId: string) => userProfileImageService.delete(),
}
</script>

<template>
  <SettingsHeader :title="t('settings.profile.title')" :description="t('settings.profile.description')">
    <template #right>
      <AvatarUploader
        v-if="authStore.user?.id"
        :model-id="authStore.user.id"
        :avatar-url="authStore.user.avatarUrl"
        :fallback-text="authStore.user.initials"
        :uploader-service="uploaderService"
        avatar-class="size-16"
        auto-upload
        @uploaded="onAvatarUploaded"
        @removed="onAvatarRemoved"
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

  <div class="flex flex-col gap-2 -mt-2">
    <div class="text-xs text-muted-foreground py-2">
      {{ t('settings.profile.skills.title') }}:
    </div>
    <div class="flex flex-row flex-wrap items-center gap-2">
      <UserSkillBadge
        v-for="skill in profile?.skills"
        :key="skill.id"
        :skill="skill"
        @remove="refresh()"
      />
      <NoItems v-if="!profile?.skills?.length" :message="t('settings.profile.skills.noSkills')" />
      <Button
        variant="outline"
        size="icon"
        class="rounded-full h-7"
        @click="isAddUserSkillModalOpen = true"
      >
        <Plus class="size-4" />
      </Button>
    </div>
  </div>

  <Separator />

  <form class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8" :class="{ 'opacity-50': isLoading }" @submit="onSubmit">
    <div class="col-span-full flex items-center gap-2">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem class="w-full">
          <FormLabel>{{ t('settings.profile.user.email') }}</FormLabel>
          <FormControl>
            <div class="relative">
              <Input v-bind="componentField" disabled />
              <ButtonLink
                to="/settings/account"
                variant="ghost"
                size="icon"
                class="absolute right-0 top-0"
              >
                <Edit />
              </ButtonLink>
            </div>
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
            <div class="relative">
              <Input v-bind="componentField" disabled />
              <ButtonLink
                to="/settings/account"
                variant="ghost"
                size="icon"
                class="absolute right-0 top-0"
              >
                <Edit />
              </ButtonLink>
            </div>
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
  </form>

  <AddUserSkillModal
    v-if="profile"
    v-model:open="isAddUserSkillModalOpen"
    :skills="profile.skills ?? []"
    @update:skills="profile.skills = $event"
    @create="refresh()"
  />
</template>
