<template>
  <aside
    class="group fixed inset-y-4 left-4 z-40 hidden w-20 overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-premium transition-[width] duration-200 ease-out focus-within:w-72 hover:w-72 md:flex md:flex-col"
  >
    <div class="flex items-center gap-3 border-b border-line p-4">
      <RouterLink
        to="/dashboard"
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold text-ink transition hover:bg-gold-soft focus-gold"
        aria-label="Kawai888 dashboard"
      >
        <ShieldCheckIcon class="h-6 w-6" aria-hidden="true" />
      </RouterLink>
      <div class="min-w-0 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
        <p class="truncate text-lg font-black tracking-tight text-ink">Kawai<span class="text-cocoa">888</span></p>
        <p class="truncate text-xs font-semibold text-muted">MMORPG escrow vault</p>
      </div>
    </div>

    <nav class="flex-1 space-y-2 p-3">
      <RouterLink
        v-for="link in topLinks"
        :key="link.to"
        :to="link.to"
        class="flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-bold text-muted transition hover:bg-raised hover:text-ink focus-gold"
        active-class="bg-gold text-ink shadow-[0_8px_18px_rgb(255_178_44_/_0.28)]"
      >
        <component :is="link.icon" class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span class="truncate opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">{{ link.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t border-line p-3">
      <div class="rounded-2xl border border-line bg-raised p-3">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-cocoa">
            <WalletIcon class="h-5 w-5" aria-hidden="true" />
          </div>
          <div class="min-w-0 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
            <p class="truncate text-xs font-semibold text-muted">Available Balance</p>
            <p class="truncate text-base font-black text-ink">{{ money(availableBalance) }}</p>
          </div>
        </div>

        <div class="mt-3 hidden space-y-2 text-xs group-hover:block group-focus-within:block">
          <div class="flex items-center justify-between gap-3 border-t border-line pt-3">
            <span class="inline-flex items-center gap-1.5 text-muted">
              <BanknotesIcon class="h-4 w-4" aria-hidden="true" />
              Total
            </span>
            <span class="font-bold text-ink">{{ money(state.wallet.totalBalance) }}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="inline-flex items-center gap-1.5 text-muted">
              <LockClosedIcon class="h-4 w-4" aria-hidden="true" />
              Locked
            </span>
            <span class="font-bold text-cocoa" :class="{ 'balance-pulse': pulseLocked }">{{ money(state.wallet.lockedMargin) }}</span>
          </div>
        </div>

        <div class="mt-3 flex justify-center text-xs font-black text-cocoa group-hover:hidden group-focus-within:hidden" :class="{ 'balance-pulse': pulseLocked }">
          {{ compactLocked }}
        </div>
      </div>
    </div>
  </aside>

  <header class="fixed inset-x-0 top-0 z-40 border-b border-line bg-surface/95 px-4 py-3 shadow-premium backdrop-blur md:hidden">
    <div class="flex items-center justify-between gap-3">
      <RouterLink to="/dashboard" class="inline-flex items-center gap-2 font-black text-ink">
        <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold">
          <ShieldCheckIcon class="h-5 w-5" aria-hidden="true" />
        </span>
        Kawai<span class="text-cocoa">888</span>
      </RouterLink>
      <div class="text-right">
        <p class="text-[11px] font-semibold text-muted">Available</p>
        <p class="text-sm font-black text-ink">{{ money(availableBalance) }}</p>
      </div>
    </div>
    <div class="mt-3 grid grid-cols-3 gap-2 text-[11px]">
      <div class="rounded-xl border border-line bg-raised px-3 py-2">
        <p class="text-muted">Total</p>
        <p class="font-black text-ink">{{ money(state.wallet.totalBalance) }}</p>
      </div>
      <div class="rounded-xl border border-gold/60 bg-gold/20 px-3 py-2">
        <p class="text-muted">Available</p>
        <p class="font-black text-ink">{{ money(availableBalance) }}</p>
      </div>
      <div class="rounded-xl border border-line bg-raised px-3 py-2">
        <p class="text-muted">Locked</p>
        <p class="font-black text-cocoa" :class="{ 'balance-pulse': pulseLocked }">{{ money(state.wallet.lockedMargin) }}</p>
      </div>
    </div>
  </header>

  <nav class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-premium backdrop-blur md:hidden">
    <div class="mx-auto grid max-w-md grid-cols-5 gap-1">
      <RouterLink
        v-for="link in mobileLinks"
        :key="link.to"
        :to="link.to"
        class="flex min-h-14 flex-col items-center justify-center rounded-2xl px-1 text-[11px] font-bold text-muted transition active:bg-gold/20"
        active-class="bg-gold text-ink"
      >
        <component :is="link.icon" class="h-5 w-5" aria-hidden="true" />
        <span class="mt-1">{{ link.short }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { computed, markRaw, ref, watch } from 'vue'
import {
  BanknotesIcon,
  BriefcaseIcon,
  HomeIcon,
  IdentificationIcon,
  LockClosedIcon,
  PlusCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  WalletIcon,
} from '@heroicons/vue/24/outline'
import { useTradeStore } from '../composables/useTradeStore'

const { state, availableBalance, featuredTradeId } = useTradeStore()
const pulseLocked = ref(false)
const navIcons = {
  home: markRaw(HomeIcon),
  profile: markRaw(IdentificationIcon),
  create: markRaw(PlusCircleIcon),
  room: markRaw(ScaleIcon),
  board: markRaw(BriefcaseIcon),
}

const topLinks = computed(() => [
  { to: '/dashboard', label: 'Dashboard', icon: navIcons.home },
  { to: '/profile', label: 'Profile', icon: navIcons.profile },
  { to: '/create', label: 'Create Trade', icon: navIcons.create },
  { to: `/trade/${featuredTradeId.value}`, label: 'Trade Room', icon: navIcons.room },
  { to: '/middleman', label: 'Middleman Board', icon: navIcons.board },
])

const mobileLinks = computed(() => [
  { to: '/dashboard', short: 'Home', icon: navIcons.home },
  { to: '/create', short: 'Create', icon: navIcons.create },
  { to: `/trade/${featuredTradeId.value}`, short: 'Room', icon: navIcons.room },
  { to: '/middleman', short: 'Board', icon: navIcons.board },
  { to: '/profile', short: 'Trust', icon: navIcons.profile },
])

const compactLocked = computed(() => {
  if (state.wallet.lockedMargin >= 1000) return `$${Math.round(state.wallet.lockedMargin / 1000)}k`
  return `$${state.wallet.lockedMargin}`
})

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
