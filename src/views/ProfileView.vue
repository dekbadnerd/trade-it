<template>
  <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div class="card p-5 sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-sm font-bold text-gold">Vault Reputation</p>
          <h1 class="mt-3 text-3xl font-black text-ivory">Verified players trade rare loot with receipts.</h1>
          <p class="mt-3 max-w-2xl leading-7 text-ash">
            TradeIt! reduces scam risk by combining linked gamer identities, a visible credit score, and escrow status that both parties can audit in real time.
          </p>
        </div>
        <span class="status-pill border-gold/40 bg-gold/10 text-gold">{{ state.user.kycStatus }}</span>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <div class="rounded-lg border border-line bg-raised p-5">
          <p class="text-sm text-ash">Steam ID</p>
          <p class="mt-2 text-lg font-bold text-ivory">Steam linked</p>
          <span class="mt-3 inline-flex status-pill border-gold/40 bg-gold/10 text-gold">Verified</span>
        </div>
        <div class="rounded-lg border border-line bg-raised p-5">
          <p class="text-sm text-ash">Discord ID</p>
          <p class="mt-2 text-lg font-bold text-ivory">Discord linked</p>
          <span class="mt-3 inline-flex status-pill border-gold/40 bg-gold/10 text-gold">Verified</span>
        </div>
      </div>
    </div>

    <div class="card p-5 sm:p-6">
      <p class="text-sm font-bold text-gold">Guild Trust Engine</p>
      <div class="mt-6 rounded-lg bg-ivory p-5 text-void">
        <p class="text-sm font-semibold text-void/65">Vault Credit Score</p>
        <div class="mt-3 flex items-end gap-3">
          <p class="text-6xl font-black">{{ state.user.creditScore }}</p>
          <p class="pb-2 text-sm font-bold text-void/65">Excellent</p>
        </div>
        <div class="mt-5 h-3 rounded-full bg-void/15">
          <div class="h-3 rounded-full bg-gold" :style="{ width: `${scoreWidth}%` }"></div>
        </div>
      </div>
      <dl class="mt-5 grid grid-cols-2 gap-4">
        <div class="rounded-md border border-line bg-raised p-4">
          <dt class="text-sm text-ash">Completed Trades</dt>
          <dd class="mt-1 text-2xl font-bold text-ivory">{{ state.user.completedTrades }}</dd>
        </div>
        <div class="rounded-md border border-line bg-raised p-4">
          <dt class="text-sm text-ash">Dispute Win Rate</dt>
          <dd class="mt-1 text-2xl font-bold text-ivory">{{ state.user.disputeWinRate }}%</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useTradeStore } from '../composables/useTradeStore'

const { state } = useTradeStore()
const scoreWidth = computed(() => Math.min(100, Math.round((state.user.creditScore / 900) * 100)))
</script>
