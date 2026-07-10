<template>
  <aside
    class="fixed inset-y-4 left-4 z-40 hidden flex-col rounded-2xl border border-line bg-surface shadow-premium transition-[width] duration-200 ease-out md:flex"
    :class="sidebarExpanded ? 'w-[264px]' : 'w-[72px]'"
    aria-label="Kawai888 desktop navigation"
  >
    <div
      class="border-b border-line"
      :class="sidebarExpanded ? 'flex min-h-[76px] items-center gap-3 p-3' : 'flex flex-col items-center gap-2 p-2'"
    >
      <RouterLink
        to="/dashboard"
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold text-ink transition hover:bg-gold-soft focus-gold"
        aria-label="Kawai888 dashboard"
      >
        <el-icon :size="24"><GoldMedal /></el-icon>
      </RouterLink>

      <div v-if="sidebarExpanded" class="min-w-0 flex-1">
        <p class="truncate text-lg font-black tracking-tight text-ink">
          Kawai<span class="text-cocoa">888</span>
        </p>
        <p class="truncate text-xs font-semibold text-muted">MMORPG escrow vault</p>
      </div>

      <el-tooltip :content="sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'" placement="right">
        <el-button
          class="sidebar-toggle"
          :aria-label="sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'"
          @click="toggleSidebar"
        >
          <el-icon :size="20">
            <Fold v-if="sidebarExpanded" />
            <Expand v-else />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <el-menu
      class="sidebar-menu flex-1 border-0 px-2 py-3"
      :collapse="!sidebarExpanded"
      :collapse-transition="false"
      :default-active="activeIndex"
      background-color="transparent"
      text-color="#5F5550"
      active-text-color="#000000"
      @select="navigate"
    >
      <el-menu-item v-for="link in topLinks" :key="link.to" :index="link.to" class="sidebar-menu-item">
        <el-icon :size="22"><component :is="link.icon" /></el-icon>
        <template #title>{{ link.label }}</template>
      </el-menu-item>
    </el-menu>

    <div class="mt-auto border-t border-line p-2">
      <el-menu
        class="sidebar-menu border-0"
        :collapse="!sidebarExpanded"
        :collapse-transition="false"
        :default-active="activeIndex"
        background-color="transparent"
        text-color="#5F5550"
        active-text-color="#000000"
        @select="navigate"
      >
        <el-menu-item index="/profile" class="sidebar-menu-item">
          <el-icon :size="22"><User /></el-icon>
          <template #title>Profile</template>
        </el-menu-item>
      </el-menu>

      <section v-if="sidebarExpanded" class="sidebar-profile-card mt-2">
        <div class="flex items-start gap-3">
          <div class="profile-avatar">
            <span>JD</span>
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-black text-ink">{{ state.user.handle }}</p>
            <div class="mt-1 flex flex-wrap gap-1.5">
              <el-tag size="small" effect="light" class="role-tag">Role: {{ state.user.role }}</el-tag>
              <el-tag size="small" type="success" effect="light">{{ state.user.kycStatus }}</el-tag>
            </div>
            <p class="mt-2 text-xs font-semibold text-muted">Credit score {{ state.user.creditScore }}</p>
          </div>
        </div>

        <div class="mt-3 space-y-2 border-t border-line pt-3 text-xs">
          <div class="sidebar-wallet-row">
            <span class="inline-flex items-center gap-1.5 text-muted">
              <el-icon><Money /></el-icon>
              Total
            </span>
            <span class="font-bold text-ink">{{ money(state.wallet.totalBalance) }}</span>
          </div>
          <div class="sidebar-wallet-row">
            <span class="inline-flex items-center gap-1.5 text-muted">
              <el-icon><Wallet /></el-icon>
              Available
            </span>
            <span class="font-bold text-cocoa">{{ money(availableBalance) }}</span>
          </div>
          <div class="sidebar-wallet-row">
            <span class="inline-flex items-center gap-1.5 text-muted">
              <el-icon><Lock /></el-icon>
              Locked
            </span>
            <span class="font-bold text-cocoa" :class="{ 'balance-pulse': pulseLocked }">
              {{ money(state.wallet.lockedMargin) }}
            </span>
          </div>
        </div>
      </section>

      <div v-else class="mt-2 flex flex-col items-center gap-2 rounded-xl border border-line bg-raised py-3">
        <el-tooltip content="Role: Middleman" placement="right">
          <span class="icon-box bg-gold text-ink">
            <el-icon :size="20"><GoldMedal /></el-icon>
          </span>
        </el-tooltip>
        <el-tooltip :content="`Available ${money(availableBalance)}`" placement="right">
          <span class="icon-box text-cocoa">
            <el-icon :size="20"><Wallet /></el-icon>
          </span>
        </el-tooltip>
        <el-tooltip :content="`Locked ${money(state.wallet.lockedMargin)}`" placement="right">
          <span class="icon-box text-cocoa" :class="{ 'balance-pulse': pulseLocked }">
            <el-icon :size="20"><Lock /></el-icon>
          </span>
        </el-tooltip>
      </div>
    </div>
  </aside>

  <header class="fixed inset-x-0 top-0 z-40 border-b border-line bg-surface/95 px-4 py-3 shadow-premium backdrop-blur md:hidden">
    <div class="flex items-center justify-between gap-3">
      <RouterLink to="/dashboard" class="inline-flex items-center gap-2 font-black text-ink">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-ink">
          <el-icon :size="22"><GoldMedal /></el-icon>
        </span>
        Kawai<span class="text-cocoa">888</span>
      </RouterLink>
      <el-tag class="role-tag" effect="light">Role: {{ state.user.role }}</el-tag>
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
        class="flex min-h-14 flex-col items-center justify-center rounded-xl px-1 text-[11px] font-bold text-muted transition active:bg-gold/20"
        active-class="bg-gold text-ink"
      >
        <el-icon :size="21"><component :is="link.icon" /></el-icon>
        <span class="mt-1">{{ link.short }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { computed, markRaw, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Briefcase,
  CirclePlus,
  Expand,
  Fold,
  GoldMedal,
  House,
  Lock,
  Money,
  ScaleToOriginal,
  User,
  Wallet,
} from '@element-plus/icons-vue'
import { useLayoutStore } from '../composables/useLayoutStore'
import { formatMoney as money } from '../composables/useMoney'
import { useTradeStore } from '../composables/useTradeStore'

const router = useRouter()
const route = useRoute()
const { sidebarExpanded, toggleSidebar } = useLayoutStore()
const { state, availableBalance, featuredTradeId } = useTradeStore()
const pulseLocked = ref(false)

const navIcons = {
  home: markRaw(House),
  create: markRaw(CirclePlus),
  room: markRaw(ScaleToOriginal),
  board: markRaw(Briefcase),
  profile: markRaw(User),
}

const topLinks = computed(() => [
  { to: '/dashboard', label: 'Dashboard', icon: navIcons.home },
  { to: '/create', label: 'Create Trade', icon: navIcons.create },
  { to: `/trade/${featuredTradeId.value}`, label: 'Trade Room', icon: navIcons.room },
  { to: '/middleman', label: 'Middleman Board', icon: navIcons.board },
])

const mobileLinks = computed(() => [
  { to: '/dashboard', short: 'Home', icon: navIcons.home },
  { to: '/create', short: 'Create', icon: navIcons.create },
  { to: `/trade/${featuredTradeId.value}`, short: 'Room', icon: navIcons.room },
  { to: '/middleman', short: 'Board', icon: navIcons.board },
  { to: '/profile', short: 'Profile', icon: navIcons.profile },
])

const activeIndex = computed(() => {
  if (route.path.startsWith('/trade/')) return `/trade/${featuredTradeId.value}`
  return route.path
})

function navigate(index) {
  router.push(index)
}

watch(
  () => state.wallet.lockedMargin,
  () => {
    pulseLocked.value = true
    window.setTimeout(() => {
      pulseLocked.value = false
    }, 460)
  },
)

</script>
