<template>
  <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div class="card p-5 sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-sm font-bold text-cocoa">Vault Reputation</p>
          <h1 class="mt-3 flex items-start gap-3 text-3xl font-black text-ink">
            <ShieldCheckIcon class="mt-1 h-8 w-8 shrink-0 text-cocoa" aria-hidden="true" />
            <span>Verified players trade rare loot with receipts.</span>
          </h1>
          <p class="mt-3 max-w-2xl leading-7 text-muted">
            Kawai888 reduces scam risk by combining linked gamer identities, a visible credit score, and escrow status that both parties can audit in real time.
          </p>
        </div>
        <span class="status-pill border-gold/70 bg-gold/25 text-ink">{{ state.user.kycStatus }}</span>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <div class="rounded-lg border border-line bg-raised p-5">
          <p class="inline-flex items-center gap-2 text-sm text-muted">
            <IdentificationIcon class="h-4 w-4" aria-hidden="true" />
            Steam ID
          </p>
          <p class="mt-2 text-lg font-bold text-ink">Steam linked</p>
          <span class="mt-3 inline-flex status-pill border-gold/70 bg-gold/25 text-ink">Verified</span>
        </div>
        <div class="rounded-lg border border-line bg-raised p-5">
          <p class="inline-flex items-center gap-2 text-sm text-muted">
            <ChatBubbleLeftRightIcon class="h-4 w-4" aria-hidden="true" />
            Discord ID
          </p>
          <p class="mt-2 text-lg font-bold text-ink">Discord linked</p>
          <span class="mt-3 inline-flex status-pill border-gold/70 bg-gold/25 text-ink">Verified</span>
        </div>
      </div>
    </div>

    <div class="card p-5 sm:p-6">
      <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
        <TrophyIcon class="h-4 w-4" aria-hidden="true" />
        Guild Trust Engine
      </p>
      <div class="mt-6 rounded-lg border border-gold/60 bg-gold/20 p-5 text-ink">
        <p class="text-sm font-semibold text-ink/65">Vault Credit Score</p>
        <div class="mt-3 flex items-end gap-3">
          <p class="text-6xl font-black">{{ state.user.creditScore }}</p>
          <p class="pb-2 text-sm font-bold text-ink/65">Excellent</p>
        </div>
        <div class="mt-5 h-3 rounded-full bg-surface">
          <div class="h-3 rounded-full bg-cocoa" :style="{ width: `${scoreWidth}%` }"></div>
        </div>
      </div>
      <dl class="mt-5 grid grid-cols-2 gap-4">
        <div class="rounded-md border border-line bg-raised p-4">
          <dt class="text-sm text-muted">Completed Trades</dt>
          <dd class="mt-1 text-2xl font-bold text-ink">{{ state.user.completedTrades }}</dd>
        </div>
        <div class="rounded-md border border-line bg-raised p-4">
          <dt class="text-sm text-muted">Dispute Win Rate</dt>
          <dd class="mt-1 text-2xl font-bold text-ink">{{ state.user.disputeWinRate }}%</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import {
  ChatBubbleLeftRightIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from '@heroicons/vue/24/outline'
import { useTradeStore } from '../composables/useTradeStore'

const { state } = useTradeStore()
const scoreWidth = computed(() => Math.min(100, Math.round((state.user.creditScore / 900) * 100)))
</script>
