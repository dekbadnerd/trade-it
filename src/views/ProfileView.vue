<template>
  <section class="space-y-6">
    <el-card class="guild-passport-card fixed-card" shadow="never">
      <div class="guild-passport-shell">
        <div class="guild-avatar">
          <span>{{ state.user.avatarInitials }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p class="text-sm font-bold text-cocoa">Guild Passport</p>
              <h1 class="mt-2 text-3xl font-black text-ink">{{ state.user.handle }}</h1>
              <p class="mt-2 max-w-2xl leading-7 text-muted">
                Verified middleman profile for rare MMORPG item escrow, margin-backed jobs, and URL-based dispute proof.
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <el-tag class="role-tag" effect="light">Role: {{ state.user.role }}</el-tag>
              <el-tag class="protected-tag" effect="light">{{ state.user.kycStatus }}</el-tag>
              <el-tag class="rank-tag" effect="light">{{ state.user.guildRank }}</el-tag>
            </div>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div v-for="badge in profileBadges" :key="badge.label" class="passport-badge">
              <span v-if="identityLogoFor(badge.label)" class="brand-logo-small">
                <component :is="identityLogoFor(badge.label)" :width="18" :height="18" />
              </span>
              <el-icon v-else><component :is="badgeIcon(badge.type)" /></el-icon>
              <span>{{ badge.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <div class="grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <el-card class="fixed-card" shadow="never">
        <template #header>
          <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
            <el-icon><Trophy /></el-icon>
            Reputation Core
          </p>
        </template>

        <div class="rounded-xl border border-gold/60 bg-gold/20 p-5 text-ink">
          <p class="text-sm font-semibold text-ink/65">Vault Credit Score</p>
          <div class="mt-3 flex items-end gap-3">
            <p class="text-6xl font-black">{{ state.user.creditScore }}</p>
            <p class="pb-2 text-sm font-bold text-ink/65">Excellent</p>
          </div>
          <el-progress class="mt-5 trust-progress" :percentage="scoreWidth" :show-text="false" :stroke-width="12" />
        </div>

        <div class="mt-5 grid items-stretch gap-4 sm:grid-cols-2">
          <div v-for="stat in reputationStats" :key="stat.label" class="profile-stat-card">
            <p class="text-sm text-muted">{{ stat.label }}</p>
            <p class="mt-2 text-2xl font-black text-ink">{{ stat.value }}</p>
          </div>
        </div>
      </el-card>

      <el-card class="fixed-card" shadow="never">
        <template #header>
          <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
            <el-icon><CollectionTag /></el-icon>
            Recent Vault Activity
          </p>
        </template>

        <div class="space-y-3">
          <article v-for="activity in profileActivity" :key="activity.id" class="activity-row">
            <div class="min-w-0">
              <p class="font-black text-ink">{{ activity.id }}</p>
              <p class="mt-1 truncate text-sm text-muted">{{ activity.label }}</p>
            </div>
            <div class="flex shrink-0 flex-col items-end gap-1">
              <el-tag class="protected-tag" size="small" effect="light">{{ activity.result }}</el-tag>
              <span class="text-xs font-bold text-cocoa">{{ activity.rarity }}</span>
            </div>
          </article>
        </div>
      </el-card>
    </div>

    <div class="grid items-stretch gap-6 lg:grid-cols-[1fr_0.9fr]">
      <el-card class="fixed-card" shadow="never">
        <template #header>
          <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
            <el-icon><Connection /></el-icon>
            Linked Identity Seals
          </p>
        </template>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="identity-seal">
            <div class="flex items-start gap-3">
              <span class="identity-logo-box">
                <SvglSteamLogo :width="34" :height="34" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-bold text-muted">Steam ID</p>
                <p class="mt-1 text-lg font-bold text-ink">Steam linked</p>
                <el-tag class="mt-3 protected-tag" effect="light">Verified</el-tag>
              </div>
            </div>
          </div>
          <div class="identity-seal">
            <div class="flex items-start gap-3">
              <span class="identity-logo-box">
                <SvglDiscordLogo :width="34" :height="34" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-bold text-muted">Discord ID</p>
                <p class="mt-1 text-lg font-bold text-ink">Discord linked</p>
                <el-tag class="mt-3 protected-tag" effect="light">Verified</el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="fixed-card" shadow="never">
        <template #header>
          <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
            <el-icon><Star /></el-icon>
            Featured Vault Item
          </p>
        </template>
        <ItemRarityCard :item="featuredItem" :insured="true" seal="Guild Passport" />
      </el-card>
    </div>
  </section>
</template>

<script setup>
import { computed, markRaw } from 'vue'
import {
  CircleCheck,
  CollectionTag,
  Connection,
  GoldMedal,
  Lock,
  Star,
  Trophy,
} from '@element-plus/icons-vue'
import { SvglDiscordLogo, SvglSteamLogo } from '@selemondev/svgl-vue'
import ItemRarityCard from '../components/ItemRarityCard.vue'
import { formatMoney as money } from '../composables/useMoney'
import { useTradeStore } from '../composables/useTradeStore'

const { state, availableBalance, profileBadges, profileActivity, activeTrades } = useTradeStore()
const scoreWidth = computed(() => Math.min(100, Math.round((state.user.creditScore / 900) * 100)))
const featuredItem = computed(() => activeTrades.value[0]?.itemA ?? state.trades[0].itemA)

const badgeIcons = {
  identity: markRaw(Connection),
  trust: markRaw(CircleCheck),
  protection: markRaw(GoldMedal),
}

const identityLogos = {
  steam: markRaw(SvglSteamLogo),
  discord: markRaw(SvglDiscordLogo),
}

const reputationStats = computed(() => [
  { label: 'Completed Trades', value: state.user.completedTrades },
  { label: 'Dispute Win Rate', value: `${state.user.disputeWinRate}%` },
  { label: 'Margin Capacity', value: money(availableBalance.value) },
  { label: 'Evidence Quality', value: `${state.user.evidenceQuality}%` },
])

function badgeIcon(type) {
  return badgeIcons[type] ?? Lock
}

function identityLogoFor(label) {
  const normalized = String(label).toLowerCase()
  if (normalized.includes('steam')) return identityLogos.steam
  if (normalized.includes('discord')) return identityLogos.discord
  return null
}
</script>
