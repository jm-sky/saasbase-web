<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'

const { t } = useI18n()
</script>

<template>
  <RouterLink v-slot="{ navigate }" to="/projects/add" custom>
    <Card class="border-dashed border-2 flex flex-col min-h-40 shadow-md cursor-pointer hover:border-primary hover:bg-primary-200/10 hover:shadow-lg transition-all duration-300" @click="navigate">
      <CardHeader>
        <CardTitle class="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>+</AvatarFallback>
          </Avatar>
          <span>
            {{ t('project.add.title') }}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <div class="text-muted-foreground">
          <p>{{ t('project.add.description') }}</p>
        </div>
      </CardContent>
      <CardFooter class="mt-auto flex justify-between gap-2" />
    </Card>
  </RouterLink>
</template>
