<script setup lang="ts">
import { Building2, FolderSync, Mail, ScanEye } from 'lucide-vue-next'
import { type Component, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const { t } = useI18n()

interface Feature {
  icon: Component
  title: string
  subtitle: string
  description: string
}

const features = computed<Feature[]>(() => [
  {
    icon: ScanEye,
    title: t('landing.features.expensesOcr.title'),
    subtitle: t('landing.features.expensesOcr.subtitle'),
    description: t('landing.features.expensesOcr.description'),
  },
  {
    icon: Building2,
    title: t('landing.features.officialRegistryIntegration.title'),
    subtitle: t('landing.features.officialRegistryIntegration.subtitle'),
    description: t('landing.features.officialRegistryIntegration.description'),
  },
  {
    icon: Mail,
    title: t('landing.features.emailIntegration.title'),
    subtitle: t('landing.features.emailIntegration.subtitle'),
    description: t('landing.features.emailIntegration.description'),
  },
  {
    // KSeF integration (in progress)
    icon: FolderSync,
    title: t('landing.features.kesefIntegration.title'),
    subtitle: t('landing.features.kesefIntegration.subtitleInProgress'), // Note: subtitle key updated
    description: t('landing.features.kesefIntegration.description'),
  },
])
</script>

<template>
  <section class="py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4">
          {{ t('landing.features.title') }}
        </h2>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Intelligent Accounting -->
        <Card
          v-for="feature in features"
          :key="feature.title"
          class="text-center hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <CardHeader class="pb-4">
            <div class="size-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <component :is="feature.icon" class="size-8 text-primary" />
            </div>
            <CardTitle class="text-xl mb-2">
              {{ feature.title }}
            </CardTitle>
            <div class="w-12 h-1 bg-primary mx-auto mb-4" />
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">
              {{ feature.subtitle }}
            </p>
            <p class="text-sm text-muted-foreground/60">
              {{ feature.description }}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
