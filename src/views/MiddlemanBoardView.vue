<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-bold text-gold">Guild Middleman Board</p>
        <h1 class="mt-3 text-3xl font-black text-ivory">Guard escrow jobs only when your vault can cover the margin.</h1>
        <p class="mt-2 max-w-3xl leading-7 text-ash">
          Freelance middlemen cannot accept high-value artifact trades unless their available wallet balance is at least the trade value. This keeps the guild ledger solvent.
        </p>
      </div>
      <div class="rounded-lg bg-ivory px-5 py-4 text-void">
        <p class="text-sm font-semibold text-void/65">Available Wallet Balance</p>
        <p class="mt-1 text-2xl font-black">{{ money(availableBalance) }}</p>
      </div>
    </div>

    <div class="grid gap-4">
      <article v-for="trade in pendingTrades" :key="trade.id" class="card rune-panel p-4 sm:p-5">
        <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-xl font-black text-ivory">{{ trade.id }}</h2>
              <span class="status-pill border-gold/40 bg-gold/10 text-gold">{{ trade.status }}</span>
              <span v-if="trade.insurance" class="status-pill border-gold/40 bg-ivory text-void">Premium Protected</span>
            </div>
            <p class="mt-3 break-words text-ash">{{ trade.itemA.name }} for {{ trade.itemB.name }}</p>
            <p class="mt-2 text-sm text-ash/80">Created {{ trade.createdAt }} by {{ trade.itemA.owner }} and {{ trade.itemB.owner }}</p>
            <div class="mt-4 max-w-xl">
              <ItemRarityCard :item="trade.itemA" :insured="trade.insurance" seal="Primary Lot" />
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
            <div class="rounded-md border border-line bg-raised p-3">
              <p class="text-xs text-ash">Item A</p>
              <p class="font-bold text-ivory">{{ money(trade.itemA.value) }}</p>
            </div>
            <div class="rounded-md border border-line bg-raised p-3">
              <p class="text-xs text-ash">Required Margin</p>
              <p class="font-bold text-gold">{{ money(requiredMargin(trade)) }}</p>
            </div>
            <button :disabled="availableBalance < requiredMargin(trade)" class="min-h-12 rounded-md px-4 py-3 font-black transition disabled:cursor-not-allowed disabled:border disabled:border-danger/40 disabled:bg-danger/10 disabled:text-danger enabled:bg-gold enabled:text-void enabled:hover:bg-gold-soft" @click="selectTrade(trade)">
              {{ availableBalance >= requiredMargin(trade) ? 'Accept Job' : 'Insufficient Balance' }}
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-if="pendingTrades.length === 0" class="card p-8 text-center">
      <h2 class="text-2xl font-black text-ivory">No pending middleman jobs</h2>
      <p class="mt-2 text-ash">Create a trade to generate a new escrow job.</p>
    </div>

    <div v-if="selectedTrade" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div class="w-full max-w-lg rounded-lg border border-gold/40 bg-panel p-5 shadow-premium sm:p-6">
        <p class="text-sm font-bold text-gold">Margin Lock Confirmation</p>
        <h2 class="mt-3 text-2xl font-black text-ivory">Lock {{ money(requiredMargin(selectedTrade)) }}?</h2>
        <p class="mt-3 leading-7 text-ash">
          Accepting {{ selectedTrade.id }} will lock margin equal to the highest item value. Your available balance updates immediately after confirmation.
        </p>
        <p v-if="errorMessage" class="mt-4 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{{ errorMessage }}</p>
        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button class="min-h-11 rounded-md border border-line px-5 py-3 font-semibold text-ash transition hover:border-ivory hover:text-ivory focus-gold" @click="closeModal">Cancel</button>
          <button :disabled="isAccepting" class="min-h-11 rounded-md bg-gold px-5 py-3 font-black text-void transition hover:bg-gold-soft disabled:opacity-60" @click="confirmAccept">
            {{ isAccepting ? 'Locking margin...' : 'Confirm & Lock Margin' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
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
