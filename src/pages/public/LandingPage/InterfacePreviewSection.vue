<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import HeroSectionBg from './HeroSectionBg.vue'

const { t } = useI18n()

const currentInterfaceSlide = ref(0)

// Interface screenshots for carousel
const interfaceScreenshots = computed(() => [
  { image: '/images/landing/dashboard.png', title: t('landing.interface.dashboard') },
  { image: '/images/landing/contractor.png', title: t('landing.interface.contractor') },
  { image: '/images/landing/invoices.png', title: t('landing.interface.invoice') },
  { image: '/images/landing/inbox.png', title: t('landing.interface.inbox') },
])

const nextInterfaceSlide = () => {
  currentInterfaceSlide.value = (currentInterfaceSlide.value + 1) % interfaceScreenshots.value.length
}

const prevInterfaceSlide = () => {
  currentInterfaceSlide.value = currentInterfaceSlide.value === 0 ? interfaceScreenshots.value.length - 1 : currentInterfaceSlide.value - 1
}

const goToInterfaceSlide = (index: number) => {
  currentInterfaceSlide.value = index
}

const currentInterfaceSlideData = computed(() => interfaceScreenshots.value[currentInterfaceSlide.value])

// Auto-advance interface slides
if (typeof window !== 'undefined') {
  setTimeout(() => {
    setInterval(() => {
      nextInterfaceSlide()
    }, 4000)
  }, 3000)
}
</script>

<template>
  <section class="relative py-20 bg-background">
    <HeroSectionBg />

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-foreground mb-4">
          {{ t('landing.interface.title') }}
        </h2>
      </div>

      <!-- Interface Carousel -->
      <div class="relative max-w-5xl mx-auto">
        <div class="relative overflow-hidden rounded-lg shadow-2xl">
          <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentInterfaceSlide * 100}%)` }">
            <div
              v-for="(screenshot, index) in interfaceScreenshots"
              :key="index"
              class="w-full flex-shrink-0"
            >
              <div class="h-128 flex items-center justify-center">
                <img :src="screenshot.image" alt="Interface Preview" class="w-full object-contain">
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 w-full flex justify-center p-2">
            <div class="px-8 py-2 rounded-lg w-fit text-center text-white font-semibold bg-muted-foreground/50 backdrop-blur-xs shadow">
              {{ currentInterfaceSlideData.title }}
            </div>
          </div>
        </div>

        <!-- Carousel Controls -->
        <Button
          variant="outline"
          size="icon"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90"
          @click="prevInterfaceSlide"
        >
          <ChevronLeft />
        </Button>

        <Button
          variant="outline"
          size="icon"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90"
          @click="nextInterfaceSlide"
        >
          <ChevronRight />
        </Button>

        <!-- Carousel Indicators -->
        <div class="flex justify-center mt-8 space-x-2">
          <button
            v-for="(_, index) in interfaceScreenshots"
            :key="index"
            class="size-3 rounded-full transition-colors"
            :class="index === currentInterfaceSlide ? 'bg-primary' : 'bg-muted-foreground/50'"
            @click="goToInterfaceSlide(index)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
