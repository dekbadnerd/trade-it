<template>
  <section class="space-y-6">
    <div class="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
      <el-card class="rune-panel hero-card fixed-card" shadow="never">
        <div class="rounded-xl bg-gold p-5 text-ink sm:p-7">
          <h1 class="max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
            Vault operations for high-value MMORPG item trades.
          </h1>
          <p class="mt-4 max-w-2xl text-base text-ink/75">
            Monitor active escrows, protected trade value, tiered protection fees, and locked middleman margin from one live control room.
          </p>
        </div>

        <div class="mt-4 grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <el-card v-for="metric in heroMetrics" :key="metric.label" class="metric-card fixed-card" shadow="never">
            <p class="text-sm text-muted">{{ metric.label }}</p>
            <p class="mt-2 text-2xl font-black" :class="metric.emphasis ? 'text-cocoa' : 'text-ink'">{{ metric.value }}</p>
          </el-card>
        </div>
      </el-card>

      <el-card class="rune-panel fixed-card" shadow="never">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <span class="font-bold text-cocoa">Live wallet control</span>
            <el-tag class="role-tag" effect="light">Role: {{ state.user.role }}</el-tag>
          </div>
        </template>

        <div class="space-y-4">
          <div class="wallet-row">
            <span>
              <el-icon><Money /></el-icon>
              Total Balance
            </span>
            <strong>{{ money(state.wallet.totalBalance) }}</strong>
          </div>
          <div class="wallet-row">
            <span>
              <el-icon><Wallet /></el-icon>
              Available Balance
            </span>
            <strong class="text-cocoa">{{ money(availableBalance) }}</strong>
          </div>
          <div class="wallet-row">
            <span>
              <el-icon><Lock /></el-icon>
              Freelance Margin Lock
            </span>
            <strong class="text-cocoa">{{ money(state.wallet.lockedMargin) }}</strong>
          </div>
          <div class="wallet-row">
            <span>
              <el-icon><Discount /></el-icon>
              Withdrawal Fee
            </span>
            <strong>{{ formatPercent(withdrawalFeeRate) }}</strong>
          </div>
        </div>

        <el-button class="mt-6 w-full" type="primary" size="large" @click="router.push('/middleman')">
          Open Middleman Board
        </el-button>
      </el-card>
    </div>

    <div class="dashboard-chart-grid">
      <el-card class="chart-card fixed-card" shadow="never">
        <template #header>
          <h2 class="text-xl font-black text-ink">Protected GMV mix</h2>
        </template>
        <ChartPanel :config="gmvDoughnutConfig" aria-label="Protected GMV by rarity doughnut chart" />
      </el-card>

      <el-card class="chart-card fixed-card" shadow="never">
        <template #header>
          <h2 class="text-xl font-black text-ink">Fee revenue by tier</h2>
        </template>
        <ChartPanel :config="feeBarConfig" aria-label="Fee revenue by rarity tier bar chart" />
      </el-card>

      <el-card class="chart-card fixed-card" shadow="never">
        <template #header>
          <h2 class="text-xl font-black text-ink">Rate schedule</h2>
        </template>
        <div class="space-y-2">
          <div v-for="row in rateRows" :key="row.rarity" class="rate-row">
            <span>{{ row.rarity }}</span>
            <strong>{{ formatPercent(row.rate) }}</strong>
          </div>
          <div class="rate-row border-gold/60 bg-gold/20">
            <span>Withdrawal</span>
            <strong>{{ formatPercent(withdrawalFeeRate) }}</strong>
          </div>
        </div>
      </el-card>
    </div>

    <div class="grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <el-card class="chart-card fixed-card" shadow="never">
        <template #header>
          <h2 class="text-xl font-black text-ink">Locked margin trend</h2>
        </template>
        <ChartPanel :config="marginLineConfig" aria-label="Locked margin trend area chart" />
      </el-card>

      <el-card class="chart-card fixed-card" shadow="never">
        <template #header>
          <h2 class="text-xl font-black text-ink">Escrow volume and fees</h2>
        </template>
        <ChartPanel :config="mixedOpsConfig" aria-label="Escrow volume and fee revenue mixed chart" />
      </el-card>
    </div>

    <el-card class="fixed-card" shadow="never">
      <template #header>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-xl font-black text-ink">Active vault rooms</h2>
          <el-button text type="primary" @click="router.push(`/trade/${featuredTradeId}`)">View live room</el-button>
        </div>
      </template>

      <div class="grid items-stretch gap-3 md:grid-cols-2">
        <article v-for="trade in activeTrades.slice(0, 2)" :key="trade.id" class="vault-room-card">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p class="font-black text-ink">{{ trade.id }}</p>
            <el-tag class="protected-tag" effect="light">{{ trade.status }}</el-tag>
          </div>
          <div class="mt-4">
            <ItemRarityCard :item="trade.itemA" :insured="trade.insurance" seal="Vault Item" />
          </div>
        </article>
      </div>
    </el-card>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Discount, Lock, Money, Wallet } from '@element-plus/icons-vue'
import ChartPanel from '../components/ChartPanel.vue'
import ItemRarityCard from '../components/ItemRarityCard.vue'
import { formatMoney as money, formatPercent } from '../composables/useMoney'
import { useTradeStore } from '../composables/useTradeStore'

const router = useRouter()
const {
  state,
  availableBalance,
  activeTrades,
  featuredTradeId,
  protectionFeeRates,
  rarityOptions,
  withdrawalFeeRate,
  dashboardSeries,
  protectedItemForTrade,
  insuranceFeeForTrade,
} = useTradeStore()

const chartColors = ['#F0A020', '#FFB22C', '#FFC769', '#854836', '#9A5A42', '#C2410C', '#000000']
const mutedGrid = 'rgba(133, 72, 54, 0.12)'

const protectedTrades = computed(() => state.trades.filter((trade) => trade.insurance))
const protectedValue = computed(() =>
  protectedTrades.value.reduce((total, trade) => total + protectedItemForTrade(trade).value, 0),
)
const feeRevenue = computed(() => protectedTrades.value.reduce((total, trade) => total + insuranceFeeForTrade(trade), 0))

const heroMetrics = computed(() => [
  { label: 'Active Escrows', value: activeTrades.value.length, emphasis: false },
  { label: 'Protected GMV', value: money(protectedValue.value), emphasis: true },
  { label: 'Fee Revenue', value: money(feeRevenue.value), emphasis: true },
  { label: 'Locked Margin', value: money(state.wallet.lockedMargin), emphasis: true },
])

const rateRows = computed(() => rarityOptions.map((rarity) => ({ rarity, rate: protectionFeeRates[rarity] })))

const rarityRows = computed(() => {
  const rows = rateRows.value.map((row) => ({ ...row, gmv: 0, fee: 0 }))
  protectedTrades.value.forEach((trade) => {
    const item = protectedItemForTrade(trade)
    const rarity = protectionFeeRates[item.rarity] ? item.rarity : 'Legendary'
    const row = rows.find((entry) => entry.rarity === rarity)
    if (row) {
      row.gmv += Number(item.value) || 0
      row.fee += insuranceFeeForTrade(trade)
    }
  })
  return rows
})

function currencyTooltip(context) {
  if (context.dataset.yAxisID === 'count') {
    return `${context.dataset.label}: ${context.parsed.y} trades`
  }

  const label = context.dataset.label ? `${context.dataset.label}: ` : ''
  const value = context.parsed?.y ?? context.parsed ?? 0
  return `${label}${money(value)}`
}

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#5F5550',
        boxWidth: 10,
        usePointStyle: true,
      },
    },
    tooltip: {
      callbacks: {
        label: currencyTooltip,
      },
    },
  },
}

const gmvDoughnutConfig = computed(() => ({
  type: 'doughnut',
  data: {
    labels: rarityRows.value.map((row) => row.rarity),
    datasets: [
      {
        data: rarityRows.value.map((row) => row.gmv),
        backgroundColor: chartColors,
        borderColor: '#FFFFFF',
        borderWidth: 3,
      },
    ],
  },
  options: {
    ...baseChartOptions,
    cutout: '62%',
  },
}))

const feeBarConfig = computed(() => ({
  type: 'bar',
  data: {
    labels: rarityRows.value.map((row) => row.rarity),
    datasets: [
      {
        label: 'Fee Revenue',
        data: rarityRows.value.map((row) => row.fee),
        backgroundColor: '#854836',
        borderRadius: 10,
        maxBarThickness: 42,
      },
    ],
  },
  options: {
    ...baseChartOptions,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#5F5550' } },
      y: { beginAtZero: true, grid: { color: mutedGrid }, ticks: { color: '#5F5550' } },
    },
  },
}))

const marginLineConfig = computed(() => ({
  type: 'line',
  data: {
    labels: dashboardSeries.labels,
    datasets: [
      {
        label: 'Locked Margin',
        data: dashboardSeries.lockedMargin,
        fill: true,
        borderColor: '#854836',
        backgroundColor: 'rgba(255, 178, 44, 0.22)',
        pointBackgroundColor: '#FFB22C',
        pointBorderColor: '#854836',
        pointRadius: 4,
        tension: 0.38,
      },
    ],
  },
  options: {
    ...baseChartOptions,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#5F5550' } },
      y: { beginAtZero: true, grid: { color: mutedGrid }, ticks: { color: '#5F5550' } },
    },
  },
}))

const mixedOpsConfig = computed(() => ({
  type: 'bar',
  data: {
    labels: dashboardSeries.labels,
    datasets: [
      {
        type: 'bar',
        label: 'Escrow Volume',
        data: dashboardSeries.escrowVolume,
        backgroundColor: '#FFB22C',
        borderRadius: 10,
        yAxisID: 'count',
      },
      {
        type: 'line',
        label: 'Fee Revenue',
        data: dashboardSeries.feeRevenue,
        borderColor: '#854836',
        backgroundColor: '#854836',
        pointRadius: 4,
        tension: 0.35,
        yAxisID: 'value',
      },
    ],
  },
  options: {
    ...baseChartOptions,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#5F5550' } },
      count: {
        beginAtZero: true,
        position: 'left',
        grid: { color: mutedGrid },
        ticks: { color: '#5F5550', precision: 0 },
      },
      value: {
        beginAtZero: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#5F5550' },
      },
    },
  },
}))
</script>
