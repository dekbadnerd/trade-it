<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-bold text-cocoa">Guild Middleman Board</p>
        <h1 class="mt-3 flex items-start gap-3 text-3xl font-black text-ink">
          <BriefcaseIcon class="mt-1 h-8 w-8 shrink-0 text-cocoa" aria-hidden="true" />
          <span>Guard escrow jobs only when your vault can cover the margin.</span>
        </h1>
        <p class="mt-2 max-w-3xl leading-7 text-muted">
          Freelance middlemen cannot accept high-value artifact trades unless their available wallet balance is at least the trade value. This keeps the guild ledger solvent.
        </p>
      </div>
      <div class="rounded-lg border border-gold/60 bg-gold/20 px-5 py-4 text-ink">
        <p class="inline-flex items-center gap-2 text-sm font-semibold text-ink/65">
          <WalletIcon class="h-4 w-4" aria-hidden="true" />
          Available Wallet Balance
        </p>
        <p class="mt-1 text-2xl font-black">{{ money(availableBalance) }}</p>
      </div>
    </div>

    <div class="grid gap-4">
      <article v-for="trade in pendingTrades" :key="trade.id" class="card rune-panel p-4 sm:p-5">
        <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-xl font-black text-ink">{{ trade.id }}</h2>
              <span class="status-pill border-gold/70 bg-gold/25 text-ink">{{ trade.status }}</span>
              <span v-if="trade.insurance" class="status-pill inline-flex items-center gap-1.5 border-gold/70 bg-gold/25 text-ink">
                <ShieldCheckIcon class="h-3.5 w-3.5" aria-hidden="true" />
                Premium Protected
              </span>
            </div>
            <p class="mt-3 break-words text-muted">{{ trade.itemA.name }} for {{ trade.itemB.name }}</p>
            <p class="mt-2 text-sm text-muted/80">Created {{ trade.createdAt }} by {{ trade.itemA.owner }} and {{ trade.itemB.owner }}</p>
            <div class="mt-4 max-w-xl">
              <ItemRarityCard :item="trade.itemA" :insured="trade.insurance" seal="Primary Lot" />
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
            <div class="rounded-md border border-line bg-raised p-3">
              <p class="text-xs text-muted">Item A</p>
              <p class="font-bold text-ink">{{ money(trade.itemA.value) }}</p>
            </div>
            <div class="rounded-md border border-line bg-raised p-3">
              <p class="inline-flex items-center gap-1.5 text-xs text-muted">
                <LockClosedIcon class="h-3.5 w-3.5" aria-hidden="true" />
                Required Margin
              </p>
              <p class="font-bold text-cocoa">{{ money(requiredMargin(trade)) }}</p>
            </div>
            <button :disabled="availableBalance < requiredMargin(trade)" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-4 py-3 font-black transition disabled:cursor-not-allowed disabled:border disabled:border-danger/40 disabled:bg-danger/10 disabled:text-danger enabled:bg-gold enabled:text-ink enabled:hover:bg-gold-soft" @click="selectTrade(trade)">
              <LockClosedIcon v-if="availableBalance >= requiredMargin(trade)" class="h-4 w-4" aria-hidden="true" />
              <ExclamationTriangleIcon v-else class="h-4 w-4" aria-hidden="true" />
              {{ availableBalance >= requiredMargin(trade) ? 'Accept Job' : 'Insufficient Balance' }}
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-if="pendingTrades.length === 0" class="card p-8 text-center">
      <h2 class="text-2xl font-black text-ink">No pending middleman jobs</h2>
      <p class="mt-2 text-muted">Create a trade to generate a new escrow job.</p>
    </div>

    <div v-if="selectedTrade" class="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-lg border border-line bg-surface p-5 shadow-premium sm:p-6">
        <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
          <LockClosedIcon class="h-4 w-4" aria-hidden="true" />
          Margin Lock Confirmation
        </p>
        <h2 class="mt-3 text-2xl font-black text-ink">Lock {{ money(requiredMargin(selectedTrade)) }}?</h2>
        <p class="mt-3 leading-7 text-muted">
          Accepting {{ selectedTrade.id }} will lock margin equal to the highest item value. Your available balance updates immediately after confirmation.
        </p>
        <p v-if="errorMessage" class="mt-4 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{{ errorMessage }}</p>
        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button class="min-h-11 rounded-md border border-line px-5 py-3 font-semibold text-muted transition hover:border-cocoa hover:text-ink focus-gold" @click="closeModal">Cancel</button>
          <button :disabled="isAccepting" class="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-gold px-5 py-3 font-black text-ink transition hover:bg-gold-soft disabled:opacity-60" @click="confirmAccept">
            <LockClosedIcon class="h-4 w-4" aria-hidden="true" />
            {{ isAccepting ? 'Locking margin...' : 'Confirm & Lock Margin' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import {
  BriefcaseIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  WalletIcon,
} from '@heroicons/vue/24/outline'
import ItemRarityCard from '../components/ItemRarityCard.vue'
import { useTradeStore } from '../composables/useTradeStore'

const { availableBalance, pendingTrades, requiredMargin, acceptMiddlemanJob } = useTradeStore()

const selectedTrade = ref(null)
const isAccepting = ref(false)
const errorMessage = ref('')

function selectTrade(trade) {
  selectedTrade.value = trade
  errorMessage.value = ''
}

function closeModal() {
  selectedTrade.value = null
  errorMessage.value = ''
}

function confirmAccept() {
  if (!selectedTrade.value) return

  isAccepting.value = true
  errorMessage.value = ''
  window.setTimeout(() => {
    const result = acceptMiddlemanJob(selectedTrade.value.id)
    isAccepting.value = false

    if (!result.ok) {
      errorMessage.value = result.message
      return
    }

    closeModal()
  }, 1300)
}

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
</script>
