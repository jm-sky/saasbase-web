import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { accountService } from '@/domains/account/services/AccountService'
import type { AccountActivity, AccountProfile, AccountSettings, ApiKey, BillingHistory, BillingPlan } from '../types'

export const useAccountStore = defineStore('account', () => {
  // State
  const profile = ref<AccountProfile | null>(null)
  const settings = ref<AccountSettings | null>(null)
  const activities = ref<AccountActivity[]>([])
  const apiKeys = ref<ApiKey[]>([])
  const billingPlans = ref<BillingPlan[]>([])
  const billingHistory = ref<BillingHistory[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Getters
  const isProfileLoaded = computed(() => !!profile.value)
  const isSettingsLoaded = computed(() => !!settings.value)
  const fullName = computed(() => profile.value ? `${profile.value.firstName} ${profile.value.lastName}` : '')

  // Actions
  const fetchProfile = async () => {
    loading.value = true
    try {
      profile.value = await accountService.getProfile()
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (data: Partial<AccountProfile>) => {
    loading.value = true
    try {
      profile.value = await accountService.updateProfile(data)
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSettings = async () => {
    loading.value = true
    try {
      settings.value = await accountService.getSettings()
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSettings = async (data: Partial<AccountSettings>) => {
    loading.value = true
    try {
      settings.value = await accountService.updateSettings(data)
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchActivities = async () => {
    loading.value = true
    try {
      activities.value = await accountService.getActivity()
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBillingPlans = async () => {
    loading.value = true
    try {
      billingPlans.value = await accountService.getBillingPlans()
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBillingHistory = async () => {
    loading.value = true
    try {
      billingHistory.value = await accountService.getBillingHistory()
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const inviteFriend = async (data: { email: string; message?: string }) => {
    loading.value = true
    try {
      await accountService.inviteFriend(data)
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    profile,
    settings,
    activities,
    apiKeys,
    billingPlans,
    billingHistory,
    loading,
    error,
    // Getters
    isProfileLoaded,
    isSettingsLoaded,
    fullName,
    // Actions
    fetchProfile,
    updateProfile,
    fetchSettings,
    updateSettings,
    fetchActivities,
    fetchBillingPlans,
    fetchBillingHistory,
    inviteFriend,
  }
})
