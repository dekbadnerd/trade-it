<template>
  <section v-if="trade" class="space-y-6">
    <div class="rune-panel rounded-lg border border-line bg-panel p-5 sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-sm font-bold text-gold">Vault Room / Live Escrow</p>
        <h1 class="mt-3 text-3xl font-black text-ivory">{{ trade.id }} artifact exchange</h1>
        <p class="mt-2 max-w-2xl leading-7 text-ash">
          A transparent vault room shows item rarity, verified owners, locked margin, and the exact escrow step before anyone releases loot.
        </p>
      </div>
      <span class="status-pill border-gold/40 bg-gold/10 text-gold">{{ trade.status }}</span>
      </div>
    </div>

    <TradeTimeline :current-step="trade.timelineStep" />

    <div class="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div class="card p-5 sm:p-6">
        <div class="grid gap-4 sm:grid-cols-2">
          <ItemRarityCard :item="trade.itemA" :insured="trade.insurance" seal="KYC Seal" />
          <ItemRarityCard :item="trade.itemB" :insured="trade.insurance" seal="Discord Seal" />
        </div>

        <div class="mt-6 rounded-lg border border-line bg-raised p-5">
          <p class="font-semibold text-ivory">Vault controls</p>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <button class="min-h-11 rounded-md border border-line px-4 py-3 text-sm font-semibold text-ash transition hover:border-gold hover:text-gold focus-gold" @click="advanceTo(3)">Mark Items Exchanged</button>
            <button class="min-h-11 rounded-md bg-gold px-4 py-3 text-sm font-black text-void transition hover:bg-gold-soft" @click="advanceTo(4)">Complete Trade</button>
            <button class="min-h-11 rounded-md border border-danger/45 px-4 py-3 text-sm font-semibold text-danger transition hover:bg-danger/10" @click="openDispute">Flag Dispute</button>
          </div>
        </div>
      </div>

      <aside class="card p-5 sm:p-6">
        <p class="text-sm font-bold text-gold">Dispute Proof</p>
        <p class="mt-3 text-sm leading-6 text-ash">
          Paste a third-party video URL from YouTube, Google Drive, or Medal.tv. TradeIt! avoids storing evidence files to keep moderation costs low.
        </p>
        <label class="mt-5 block">
          <span class="text-sm font-medium text-ash">Video evidence URL</span>
          <input v-model="evidenceUrl" placeholder="https://medal.tv/..." class="focus-gold mt-2 w-full rounded-md border border-line bg-raised px-4 py-3 text-ivory placeholder:text-ash" @blur="saveEvidence" />
        </label>
        <p v-if="trade.evidenceUrl" class="mt-4 break-all rounded-md border border-gold/30 bg-gold/10 p-3 text-sm text-gold">
          Saved: {{ trade.evidenceUrl }}
        </p>
        <div class="mt-6 rounded-lg bg-ivory p-4 text-void">
          <p class="font-black">Middleman margin</p>
          <p class="mt-2 text-sm leading-6 text-void/70">
            Required lock for this trade is {{ money(requiredMargin(trade)) }}. The freelance middleman must cover the highest item value before accepting.
          </p>
        </div>
      </aside>
    </div>
  </section>

  <section v-else class="card p-8 text-center">
    <h1 class="text-2xl font-black text-ivory">Trade room not found</h1>
    <RouterLink to="/middleman" class="mt-4 inline-flex min-h-11 rounded-md bg-gold px-5 py-3 font-bold text-void transition hover:bg-gold-soft">View open jobs</RouterLink>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ItemRarityCard from '../components/ItemRarityCard.vue'
import TradeTimeline from '../components/TradeTimeline.vue'
import { useTradeStore } from '../composables/useTradeStore'

const route = useRoute()
const { findTrade, requiredMargin, updateDisputeEvidence } = useTradeStore()

const trade = computed(() => findTrade(route.params.id))
const evidenceUrl = ref(trade.value?.evidenceUrl ?? '')

watch(
  trade,
  (nextTrade) => {
    evidenceUrl.value = nextTrade?.evidenceUrl ?? ''
  },
  { immediate: true },
)

function saveEvidence() {
  if (trade.value) {
    updateDisputeEvidence(trade.value.id, evidenceUrl.value)
  }
}

function advanceTo(step) {
  if (trade.value) {
    trade.value.timelineStep = step
    trade.value.status = step === 4 ? 'Completed' : 'Items Exchanging'
  }
}

function openDispute() {
  if (trade.value) {
    trade.value.timelineStep = 4
    trade.value.status = 'Dispute Review'
  }
}

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
</script>
