<script setup lang="ts">
import { ref } from 'vue'
import ActiveNowCard from '@/components/Dashboard/Cards/ActiveNowCard.vue'
import SalesCard from '@/components/Dashboard/Cards/SalesCard.vue'
import SubscriptionsCard from '@/components/Dashboard/Cards/SubscriptionsCard.vue'
import TotalRevenueCard from '@/components/Dashboard/Cards/TotalRevenueCard.vue'
import DateRangePicker from '@/components/Dashboard/DateRangePicker.vue'
import Overview from '@/components/Dashboard/Overview.vue'
import RecentUsers from '@/components/Dashboard/RecentUsers.vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useTranslate } from '@/i18n/useTranslate'

const tr = useTranslate()

const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 30)))
const endDate = ref(new Date())
</script>

<template>
  <div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex flex-col md:flex-row items-center justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">
        Dashboard
      </h2>
      <div class="flex flex-col md:flex-row items-center gap-2">
        <DateRangePicker
          v-model:start-date="startDate"
          v-model:end-date="endDate"
          disabled
        />
      </div>
    </div>
    <Tabs
      default-value="overview"
      class="space-y-4"
    >
      <TabsList class="max-w-full">
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="analytics"
          disabled
        >
          Analytics
        </TabsTrigger>
        <TabsTrigger
          value="reports"
          disabled
        >
          Reports
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          disabled
        >
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="overview"
        class="space-y-4"
      >
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TotalRevenueCard />
          <SubscriptionsCard />
          <SalesCard />
          <ActiveNowCard />
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card class="col-span-4 max-w-[calc(100vw-4rem)] overflow-x-auto">
            <CardHeader>
              <CardTitle>{{ tr('Overview') }}</CardTitle>
            </CardHeader>
            <CardContent class="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <RecentUsers class="col-span-3 overflow-x-auto" />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
