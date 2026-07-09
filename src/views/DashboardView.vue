<template>
  <section class="space-y-6">
    <div class="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
      <div class="card rune-panel overflow-hidden">
        <div class="border-b border-line bg-ivory p-5 text-void sm:p-7">
          <p class="text-sm font-bold uppercase tracking-[0.16em] text-void/70">Startup Pitch Overview</p>
          <h1 class="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
            A guild-grade escrow vault for high-value MMORPG item trades.
          </h1>
          <p class="mt-4 max-w-2xl text-base text-void/75">
            TradeIt! turns rare item swaps into a visible vault flow: trust score, premium protection, locked middleman margin, and URL proof.
          </p>
        </div>
        <div class="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
          <div class="rounded-lg bg-raised p-4">
            <p class="text-sm text-ash">Credit Score</p>
            <p class="mt-2 text-3xl font-black text-gold">{{ state.user.creditScore }}</p>
          </div>
          <div class="rounded-lg bg-raised p-4">
            <p class="text-sm text-ash">Protected Trades</p>
            <p class="mt-2 text-3xl font-black text-ivory">{{ protectedTradeCount }}</p>
          </div>
          <div class="rounded-lg bg-raised p-4">
            <p class="text-sm text-ash">Locked Margin</p>
            <p class="mt-2 text-3xl font-black text-gold">{{ money(state.wallet.lockedMargin) }}</p>
          </div>
        </div>
      </div>

      <div class="card rune-panel p-5 sm:p-6">
        <p class="font-bold text-gold">Live wallet control</p>
        <div class="mt-5 space-y-4">
          <div class="flex items-center justify-between gap-4 border-b border-line pb-4">
            <span class="text-ash">Total Balance</span>
            <span class="font-black text-ivory">{{ money(state.wallet.totalBalance) }}</span>
          </div>
          <div class="flex items-center justify-between gap-4 border-b border-line pb-4">
            <span class="text-ash">Available Balance</span>
            <span class="font-black text-gold">{{ money(availableBalance) }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-ash">Freelance Margin Lock</span>
            <span class="font-black text-gold">{{ money(state.wallet.lockedMargin) }}</span>
          </div>
        </div>
        <RouterLink to="/middleman" class="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-gold px-5 py-3 text-sm font-black text-void transition hover:bg-gold-soft focus-gold">
          Open Middleman Board
        </RouterLink>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="feature in features" :key="feature.title" class="rounded-lg border border-line bg-panel p-5">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-sm font-black text-void">{{ feature.index }}</div>
        <h2 class="mt-4 text-lg font-black text-ivory">{{ feature.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-ash">{{ feature.copy }}</p>
      </article>
    </div>

    <div class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div class="card p-5 sm:p-6">
        <h2 class="text-xl font-black text-ivory">Insurance revenue preview</h2>
        <p class="mt-2 text-sm text-ash">Premium Protection monetizes trust with a clear 1.5% fee on protected value.</p>
        <div class="mt-5 rounded-lg bg-ivory p-5 text-void">
          <p class="text-sm font-semibold text-void/65">Estimated protected GMV</p>
          <p class="mt-2 text-3xl font-black">{{ money(protectedValue) }}</p>
          <p class="mt-4 text-sm font-bold text-void/70">Platform insurance fee: {{ money(protectedValue * insuranceRate) }}</p>
        </div>
      </div>

      <div class="card p-5 sm:p-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-xl font-black text-ivory">Active vault rooms</h2>
          <RouterLink :to="`/trade/${featuredTradeId}`" class="text-sm font-bold text-gold hover:text-gold-soft">View live room</RouterLink>
        </div>
        <div class="mt-5 grid gap-3 md:grid-cols-2">
          <div v-for="trade in activeTrades.slice(0, 2)" :key="trade.id" class="rounded-lg border border-line bg-raised p-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p class="font-black text-ivory">{{ trade.id }}</p>
              <span class="status-pill border-gold/40 bg-gold/10 text-gold">{{ trade.status }}</span>
            </div>
            <div class="mt-4">
              <ItemRarityCard :item="trade.itemA" :insured="trade.insurance" seal="Vault Item" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import ItemRarityCard from '../components/ItemRarityCard.vue'
import { useTradeStore } from '../composables/useTradeStore'

const { state, availableBalance, activeTrades, featuredTradeId, insuranceRate } = useTradeStore()

const protectedTradeCount = computed(() => state.trades.filter((trade) => trade.insurance).length)
const protectedValue = computed(() =>
  state.trades
    .filter((trade) => trade.insurance)
    .reduce((total, trade) => total + Math.max(trade.itemA.value, trade.itemB.value), 0),
)

const features = [
  {
    index: 'T',
    title: 'Trust Engine',
    copy: 'Steam, Discord, KYC status, and vault reputation make trust visible before a party commits.',
  },
  {
    index: '$',
    title: 'Premium Protection',
    copy: 'A 1.5% protection seal turns scam anxiety into a clear, pitchable revenue model.',
  },
  {
    index: 'M',
    title: 'Margin Lock',
    copy: 'Freelance middlemen can only guard trades their available wallet balance can actually cover.',
  },
  {
    index: 'U',
    title: 'URL Proof',
    copy: 'Disputes use YouTube, Google Drive, or Medal.tv links instead of expensive file uploads.',
  },
]

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
</script>
