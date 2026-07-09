<template>
  <header class="sticky top-0 z-40 border-b border-line bg-void/95 backdrop-blur">
    <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div class="flex items-center justify-between gap-4">
        <RouterLink to="/dashboard" class="text-xl font-black tracking-tight text-ivory">
          Trade<span class="text-gold">It!</span>
        </RouterLink>
      </div>

      <nav class="hidden flex-wrap gap-2 text-sm font-medium text-ash md:flex">
        <RouterLink
          v-for="link in topLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-md px-3 py-2 transition hover:bg-gold/10 hover:text-gold focus-gold"
          active-class="bg-gold/15 text-gold"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="grid grid-cols-3 gap-2 text-xs lg:min-w-[520px]">
        <div class="rounded-md border border-line bg-raised p-3">
          <p class="text-ash">Total</p>
          <p class="mt-1 text-base font-bold text-ivory sm:text-lg">{{ money(state.wallet.totalBalance) }}</p>
        </div>
        <div class="rounded-md border border-gold/30 bg-gold/10 p-3">
          <p class="text-ash">Available</p>
          <p class="mt-1 text-base font-bold text-gold sm:text-lg">{{ money(availableBalance) }}</p>
        </div>
        <div class="rounded-md border border-gold/30 bg-raised p-3">
          <p class="text-ash">Locked</p>
          <p class="mt-1 flex items-center gap-1.5 text-base font-bold text-gold sm:text-lg" :class="{ 'balance-pulse': pulseLocked }">
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2" />
            </svg>
            {{ money(state.wallet.lockedMargin) }}
          </p>
        </div>
      </div>
    </div>
  </header>

  <nav class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-void/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
    <div class="mx-auto grid max-w-md grid-cols-5 gap-1">
      <RouterLink
        v-for="link in mobileLinks"
        :key="link.to"
        :to="link.to"
        class="flex min-h-14 flex-col items-center justify-center rounded-md px-1 text-[11px] font-bold text-ash transition active:bg-gold/10"
        active-class="bg-gold/15 text-gold"
      >
        <span class="text-base">{{ link.icon }}</span>
        <span class="mt-1">{{ link.short }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useTradeStore } from '../composables/useTradeStore'

const { state, availableBalance, featuredTradeId } = useTradeStore()
const pulseLocked = ref(false)

const topLinks = computed(() => [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/create', label: 'Create Trade' },
  { to: `/trade/${featuredTradeId.value}`, label: 'Trade Room' },
  { to: '/middleman', label: 'Middleman Board' },
])

const mobileLinks = computed(() => [
  { to: '/dashboard', short: 'Home', icon: 'H' },
  { to: '/create', short: 'Create', icon: '+' },
  { to: `/trade/${featuredTradeId.value}`, short: 'Room', icon: 'R' },
  { to: '/middleman', short: 'Board', icon: 'M' },
  { to: '/profile', short: 'Trust', icon: 'T' },
])

watch(
  () => state.wallet.lockedMargin,
  () => {
    pulseLocked.value = true
    window.setTimeout(() => {
      pulseLocked.value = false
    }, 460)
  },
)

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
</script>
