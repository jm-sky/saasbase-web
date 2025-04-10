<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface LinkProp {
  icon: string
  count: string
  box: string
  title: string
  active?: boolean
}

interface NavProps {
  isCollapsed: boolean
  links: LinkProp[]
}

defineProps<NavProps>()
</script>

<template>
  <div
    :data-collapsed="isCollapsed"
    class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
  >
    <nav class="grid gap-1 px-2 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2">
      <template v-for="(link, index) of links">
        <Tooltip
          v-if="isCollapsed"
          :key="`1-${index}`"
          :delay-duration="0"
        >
          <TooltipTrigger as-child>
            <RouterLink
              :to="`/mailbox/${link.box.toLowerCase()}`"
              :class="cn(
                buttonVariants({ variant: link.active ? 'default' : 'ghost', size: 'icon' }),
                'size-9',
                link.active && 'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
              )"
            >
              <Icon
                :icon="link.icon"
                class="size-4"
              />
              <span class="sr-only">{{ link.title }}</span>
            </RouterLink>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            class="flex items-center gap-4"
          >
            {{ link.title }}
            <span
              v-if="link.count"
              class="ml-auto text-muted-foreground"
            >
              {{ link.count }}
            </span>
          </TooltipContent>
        </Tooltip>

        <RouterLink
          v-else
          :key="`2-${index}`"
          :to="`/mailbox/${link.box.toLowerCase()}`"
          :class="cn(
            buttonVariants({ variant: link.active ? 'default' : 'ghost', size: 'sm' }),
            link.active && 'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
            'justify-start',
          )"
        >
          <Icon
            :icon="link.icon"
            class="mr-2 size-4"
          />
          {{ link.title }}
          <span
            v-if="link.count"
            :class="cn(
              'ml-auto',
              link.active && 'text-background dark:text-white',
            )"
          >
            {{ link.count }}
          </span>
        </RouterLink>
      </template>
    </nav>
  </div>
</template>
