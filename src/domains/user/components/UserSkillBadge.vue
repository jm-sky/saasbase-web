<script setup lang="ts">
import { Trash } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/badge/Badge.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IUserSkill } from '../types/user.type'
import { userSkillService } from '../services/UserSkillService'

const { t } = useI18n()

const props = defineProps<{
  skill: IUserSkill
}>()

const emit = defineEmits<{
  remove: [IUserSkill]
}>()

const isLoading = ref(false)

const removeSkill = async () => {
  try {
    isLoading.value = true
    await userSkillService.delete(props.skill.id)
    emit('remove', props.skill)
  } catch (error) {
    handleErrorWithToast(t('skills.remove.error'), error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Badge variant="info-outline" :class="{ 'opacity-50 blur-xs': isLoading }">
    {{ skill.name }}
    <button
      type="button"
      class="p-1 ml-2 -mr-1 hover:bg-red-500/10 rounded-full"
      @click.stop="removeSkill()"
    >
      <Trash class="size-3" />
    </button>
  </Badge>
</template>