<script setup lang="ts">
import { CircleCheck } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import FeaturesSection from './LandingPage/FeaturesSection.vue'
import HeroSectionBg from './LandingPage/HeroSectionBg.vue'
import InterfacePreviewSection from './LandingPage/InterfacePreviewSection.vue'
import LandingNav from './LandingPage/LandingNav.vue'
import LaptopWithDashboard from './LandingPage/LaptopWithDashboard.vue'
import NavigationFeatures from './LandingPage/NavigationFeatures.vue'

const { t } = useI18n()

onMounted(() => {
  document.body.classList.remove('lg:overflow-hidden')
})

onBeforeUnmount(() => {
  document.body.classList.add('lg:overflow-hidden')
})
</script>

<template>
  <div class="min-h-screen w-full bg-background">
    <!-- Navigation -->
    <LandingNav />

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
      <!-- Abstract background shapes -->
      <HeroSectionBg />

      <div class="relative mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- Left side - Content -->
          <div class="space-y-6 lg:space-y-8">
            <div>
              <h1 class="text-5xl lg:text-6xl font-bold mb-4">
                <span class="text-foreground">Saas</span>
                <span class="text-primary font-normal">Base</span>
              </h1>
              <h2 class="text-2xl lg:text-3xl text-muted-foreground mb-8">
                {{ t('landing.hero.subtitle') }}
              </h2>
            </div>

            <!-- Checkpoints -->
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <CircleCheck class="size-6 text-success" />
                <p class="text-muted-foreground">
                  {{ t('landing.hero.checkpoints.integration') }}
                </p>
              </div>
              <div class="flex items-start space-x-3">
                <CircleCheck class="size-6 text-success" />
                <p class="text-muted-foreground">
                  {{ t('landing.hero.checkpoints.contact') }}
                </p>
              </div>
              <div class="flex items-start space-x-3">
                <CircleCheck class="size-6 text-success" />
                <p class="text-muted-foreground">
                  {{ t('landing.hero.checkpoints.fullIntegration') }}
                </p>
              </div>
            </div>

            <ButtonLink
              variant="primary"
              size="xl"
              to="/register"
              vibe="primary"
            >
              {{ t('landing.hero.cta') }}
            </ButtonLink>
          </div>

          <!-- Right side - Laptop mockup -->
          <LaptopWithDashboard />
        </div>

        <!-- Navigation icons at bottom -->
        <NavigationFeatures />
      </div>
    </section>

    <!-- Features Section -->
    <FeaturesSection />

    <!-- Interface Preview Section -->
    <InterfacePreviewSection />
  </div>
</template>
