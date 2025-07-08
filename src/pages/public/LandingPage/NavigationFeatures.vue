<script setup lang="ts">
import { FolderCheck, FolderSync, Inbox, MessageCircle, MessageCircleHeart, Paperclip, Search, Settings, TreeDeciduous, User } from 'lucide-vue-next'
import { type Component, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface NavigationFeature {
  icon: Component
  title: string
  subtitle: string
}

const { t } = useI18n()

// Navigation icons (bottom of hero)
const navigationFeatures = computed<NavigationFeature[]>(() => [
  { icon: FolderSync, title: t('landing.navigationFeatures.0.title'), subtitle: t('landing.navigationFeatures.0.subtitle') },
  { icon: TreeDeciduous, title: t('landing.navigationFeatures.1.title'), subtitle: t('landing.navigationFeatures.1.subtitle') },
  { icon: User, title: t('landing.navigationFeatures.2.title'), subtitle: t('landing.navigationFeatures.2.subtitle') },
  { icon: MessageCircle, title: t('landing.navigationFeatures.3.title'), subtitle: t('landing.navigationFeatures.3.subtitle') },
  { icon: Inbox, title: t('landing.navigationFeatures.4.title'), subtitle: t('landing.navigationFeatures.4.subtitle') },
  { icon: MessageCircleHeart, title: t('landing.navigationFeatures.5.title'), subtitle: t('landing.navigationFeatures.5.subtitle') },
  { icon: Search, title: t('landing.navigationFeatures.6.title'), subtitle: t('landing.navigationFeatures.6.subtitle') },
  { icon: FolderCheck, title: t('landing.navigationFeatures.7.title'), subtitle: t('landing.navigationFeatures.7.subtitle') },
  { icon: Paperclip, title: t('landing.navigationFeatures.8.title'), subtitle: t('landing.navigationFeatures.8.subtitle') },
  { icon: Settings, title: t('landing.navigationFeatures.9.title'), subtitle: t('landing.navigationFeatures.9.subtitle') },
])

</script>

<template>
  <div class="mt-16 relative w-full max-w-screen-xl mx-auto">
    <div class="flex justify-center w-full">
      <div class="flex flex-row items-center justify-center gap-6 mx-auto">
        <div
          v-for="(feature, index) in navigationFeatures"
          :key="index"
          class="relative group hover:scale-120 transition-all duration-300"
        >
          <div class="w-48 p-4 flex flex-col items-center justify-center text-center bg-background/75 rounded-lg shadow-lg cursor-pointer group-hover:shadow-xl transition-all duration-300">
            <div class="p-3 flex items-center justify-center mb-2">
              <component :is="feature.icon" class="size-12 opacity-80 group-hover:text-primary transition-all duration-300" />
            </div>
            <div class="flex items-center justify-center h-8 text-xs text-muted-foreground font-medium">
              {{ feature.title }}
            </div>
          </div>
          <div class="absolute bottom-0 translate-y-full left-0 p-1 w-full text-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-800">
            {{ feature.subtitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
