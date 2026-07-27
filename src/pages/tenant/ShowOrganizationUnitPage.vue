<script setup lang="ts">
import { Plus, Trash, UserPlus } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/button/Button.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AddOrganizationUnitPositionModal from '@/domains/tenant/components/organizationUnits/modals/AddOrganizationUnitPositionModal.vue'
import AssignUserToOrganizationUnitModal from '@/domains/tenant/components/organizationUnits/modals/AssignUserToOrganizationUnitModal.vue'
import { tenantOrganizationUnitService } from '@/domains/tenant/services/TenantOrganizationUnit.service'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IOrganizationUnit } from '@/domains/tenant/types/organizationUnit.type'

const { t } = useI18n()
const route = useRoute()

const organizationUnit = ref<IOrganizationUnit | null>(null)
const isLoading = ref(true)
const isAssignUserModalOpen = ref(false)
const isAddPositionModalOpen = ref(false)

const tenantId = route.params.id as string
const unitId = route.params.unitId as string

const loadOrganizationUnit = async () => {
  try {
    isLoading.value = true
    organizationUnit.value = await tenantOrganizationUnitService.show(tenantId, unitId)
  } catch (error) {
    handleErrorWithToast(t('tenant.organizationUnits.show.error'), error)
  } finally {
    isLoading.value = false
  }
}

const handleUserAssigned = (updatedUnit: IOrganizationUnit) => {
  organizationUnit.value = updatedUnit
}

const handlePositionAdded = (updatedUnit: IOrganizationUnit) => {
  organizationUnit.value = updatedUnit
}

onMounted(() => {
  void loadOrganizationUnit()
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <!-- Header -->
    <div class="flex flex-row items-center justify-between gap-2 mb-4">
      <div class="flex flex-col items-center gap-4">
        <h1 class="text-2xl font-bold">
          {{ t('tenant.organizationUnits.show.title') }}
        </h1>
      </div>
      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="isLoading || !organizationUnit"
          @click="isAddPositionModalOpen = true"
        >
          <Plus class="size-4" />
          {{ t('tenant.organizationUnits.show.actions.addPosition') }}
        </Button>
        <Button
          size="sm"
          :disabled="isLoading || !organizationUnit"
          @click="isAssignUserModalOpen = true"
        >
          <UserPlus class="size-4" />
          {{ t('tenant.organizationUnits.show.actions.assignUser') }}
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="text-muted-foreground">
        Loading...
      </div>
    </div>

    <div v-else-if="organizationUnit" class="space-y-6">
      <!-- Unit Details -->
      <div class="bg-card rounded-lg border p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col">
            <label class="text-sm font-medium text-muted-foreground">
              {{ t('tenant.organizationUnits.fields.name') }}
            </label>
            <p class="mt-1 text-lg font-semibold">
              {{ organizationUnit.name }}
            </p>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-muted-foreground">
              {{ t('tenant.organizationUnits.fields.code') }}
            </label>
            <p class="mt-1 font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
              {{ organizationUnit.code }}
            </p>
          </div>
          <div v-if="organizationUnit.parent" class="flex flex-col">
            <label class="text-sm font-medium text-muted-foreground">
              {{ t('tenant.organizationUnits.fields.parent') }}
            </label>
            <p class="mt-1">
              {{ organizationUnit.parent.name }}
            </p>
          </div>
        </div>
        <div v-if="organizationUnit.description" class="mt-4">
          <label class="text-sm font-medium text-muted-foreground">
            {{ t('tenant.organizationUnits.fields.description') }}
          </label>
          <p class="mt-1 text-muted-foreground">
            {{ organizationUnit.description }}
          </p>
        </div>
      </div>

      <!-- Positions -->
      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">
            {{ t('tenant.organizationUnits.show.positions.title') }}
          </h2>
          <Button
            variant="outline"
            size="sm"
            @click="isAddPositionModalOpen = true"
          >
            <Plus class="size-4" />
            {{ t('tenant.organizationUnits.show.positions.addPosition') }}
          </Button>
        </div>

        <div v-if="organizationUnit.positions.length === 0" class="text-center py-8">
          <p class="text-muted-foreground">
            {{ t('tenant.organizationUnits.show.positions.empty') }}
          </p>
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <div
            v-for="position in organizationUnit.positions"
            :key="position.id"
            class="flex flex-row items-center justify-between gap-4 px-4 py-3 bg-card border rounded-md text-sm"
            :class="position.isActive ? '' : 'opacity-50'"
          >
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-1">
                {{ position.name }}
                <span v-if="position.isDirector" class="ml-1 text-xs">👑</span>
                <span v-if="position.isLearning" class="ml-1 text-xs">🎓</span>
              </div>
              <div class="text-xs text-muted-foreground">
                {{ position.description }}
              </div>
            </div>
            <Button variant="ghost-destructive" size="sm">
              <Trash class="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">
            {{ t('tenant.organizationUnits.show.users.title') }}
          </h2>
          <Button
            size="sm"
            @click="isAssignUserModalOpen = true"
          >
            <UserPlus class="size-4" />
            {{ t('tenant.organizationUnits.show.actions.assignUser') }}
          </Button>
        </div>

        <div v-if="organizationUnit.users.length === 0" class="text-center py-8">
          <p class="text-muted-foreground">
            {{ t('tenant.organizationUnits.show.users.empty') }}
          </p>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>{{ t('tenant.organizationUnits.show.users.columns.name') }}</TableHead>
              <TableHead>{{ t('tenant.organizationUnits.show.users.columns.email') }}</TableHead>
              <TableHead>{{ t('tenant.organizationUnits.show.users.columns.position') }}</TableHead>
              <TableHead>{{ t('tenant.organizationUnits.show.users.columns.role') }}</TableHead>
              <TableHead>{{ t('common.actions') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in organizationUnit.users" :key="user.id">
              <TableCell class="font-medium">
                <div class="flex items-center gap-3">
                  <div
                    class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold"
                  >
                    {{ user.name?.[0] }}
                  </div>
                  <div>
                    <div class="font-medium">
                      {{ user.name }}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell>
                <Badge v-if="user.position" variant="outline">
                  {{ user.position }}
                </Badge>
                <span v-else class="text-muted-foreground">-</span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {{ user.role }}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost-destructive" size="sm" disabled>
                  <Trash class="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <!-- Modals -->
    <AssignUserToOrganizationUnitModal
      v-if="organizationUnit"
      v-model:open="isAssignUserModalOpen"
      :unit="organizationUnit"
      @assigned="handleUserAssigned"
    />

    <AddOrganizationUnitPositionModal
      v-if="organizationUnit"
      v-model:open="isAddPositionModalOpen"
      :unit="organizationUnit"
      @added="handlePositionAdded"
    />
  </div>
</template>
