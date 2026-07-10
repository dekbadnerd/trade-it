<template>
  <section v-if="trade" class="space-y-6">
    <div class="rune-panel rounded-lg border border-line bg-surface p-5 shadow-premium sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-sm font-bold text-cocoa">Vault Room / Live Escrow</p>
        <h1 class="mt-3 flex items-start gap-3 text-3xl font-black text-ink">
          <ScaleIcon class="mt-1 h-8 w-8 shrink-0 text-cocoa" aria-hidden="true" />
          <span>{{ trade.id }} artifact exchange</span>
        </h1>
        <p class="mt-2 max-w-2xl leading-7 text-muted">
          A transparent vault room shows item rarity, verified owners, locked margin, and the exact escrow step before anyone releases loot.
        </p>
      </div>
      <span class="status-pill border-gold/70 bg-gold/25 text-ink">{{ trade.status }}</span>
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
          <p class="font-semibold text-ink">Vault controls</p>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <button class="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-4 py-3 text-sm font-semibold text-muted transition hover:border-cocoa hover:text-ink focus-gold" @click="advanceTo(3)">
              <ArrowsRightLeftIcon class="h-4 w-4" aria-hidden="true" />
              Mark Items Exchanged
            </button>
            <button class="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-gold px-4 py-3 text-sm font-black text-ink transition hover:bg-gold-soft" @click="advanceTo(4)">
              <CheckBadgeIcon class="h-4 w-4" aria-hidden="true" />
              Complete Trade
            </button>
            <button class="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-danger/45 px-4 py-3 text-sm font-semibold text-danger transition hover:bg-danger/10" @click="openDispute">
              <ExclamationTriangleIcon class="h-4 w-4" aria-hidden="true" />
              Flag Dispute
            </button>
          </div>
        </div>
      </div>

      <aside class="card p-5 sm:p-6">
        <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
          <VideoCameraIcon class="h-4 w-4" aria-hidden="true" />
          Dispute Proof
        </p>
        <p class="mt-3 text-sm leading-6 text-muted">
          Paste a third-party video URL from YouTube, Google Drive, or Medal.tv. Kawai888 avoids storing evidence files to keep moderation costs low.
        </p>
        <label class="mt-5 block">
          <span class="text-sm font-medium text-muted">Video evidence URL</span>
          <input v-model="evidenceUrl" placeholder="https://medal.tv/..." class="focus-gold mt-2 w-full rounded-md border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted" @blur="saveEvidence" />
        </label>
        <p v-if="trade.evidenceUrl" class="mt-4 break-all rounded-md border border-gold/60 bg-gold/20 p-3 text-sm text-ink">
          Saved: {{ trade.evidenceUrl }}
        </p>
        <div class="mt-6 rounded-lg border border-gold/60 bg-gold/20 p-4 text-ink">
          <p class="inline-flex items-center gap-2 font-black">
            <LockClosedIcon class="h-4 w-4" aria-hidden="true" />
            Middleman margin
          </p>
          <p class="mt-2 text-sm leading-6 text-ink/70">
            Required lock for this trade is {{ money(requiredMargin(trade)) }}. The freelance middleman must cover the highest item value before accepting.
          </p>
        </div>
      </aside>
    </div>
  </section>

  <section v-else class="card p-8 text-center">
    <h1 class="text-2xl font-black text-ink">Trade room not found</h1>
    <RouterLink to="/middleman" class="mt-4 inline-flex min-h-11 rounded-md bg-gold px-5 py-3 font-bold text-ink transition hover:bg-gold-soft">View open jobs</RouterLink>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowsRightLeftIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ScaleIcon,
  VideoCameraIcon,
} from '@heroicons/vue/24/outline'
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
