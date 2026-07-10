<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-bold text-cocoa">Guild Middleman Board</p>
        <h1 class="mt-3 flex items-start gap-3 text-3xl font-black text-ink">
          <el-icon class="mt-1 shrink-0 text-cocoa" :size="32"><Briefcase /></el-icon>
          <span>Guard escrow jobs only when your vault can cover the margin.</span>
        </h1>
        <p class="mt-2 max-w-3xl leading-7 text-muted">
          Freelance middlemen cannot accept high-value artifact trades unless their available wallet balance is at least the trade value. This keeps the guild ledger solvent.
        </p>
      </div>
      <el-card class="wallet-callout" shadow="never">
        <p class="inline-flex items-center gap-2 text-sm font-semibold text-ink/65">
          <el-icon><Wallet /></el-icon>
          Available Wallet Balance
        </p>
        <p class="mt-1 text-2xl font-black">{{ money(availableBalance) }}</p>
      </el-card>
    </div>

    <div class="grid gap-4">
      <el-card v-for="trade in pendingTrades" :key="trade.id" class="rune-panel job-card" shadow="never">
        <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-xl font-black text-ink">{{ trade.id }}</h2>
              <el-tag class="protected-tag" effect="light">{{ trade.status }}</el-tag>
              <el-tag v-if="trade.insurance" class="protected-tag" effect="light">
                <el-icon class="mr-1"><CircleCheck /></el-icon>
                Premium Protected
              </el-tag>
            </div>
            <p class="mt-3 break-words text-muted">{{ trade.itemA.name }} for {{ trade.itemB.name }}</p>
            <p class="mt-2 text-sm text-muted">Created {{ trade.createdAt }} by {{ trade.itemA.owner }} and {{ trade.itemB.owner }}</p>
            <div class="mt-4 max-w-xl">
              <ItemRarityCard :item="trade.itemA" :insured="trade.insurance" seal="Primary Lot" />
            </div>
          </div>

          <div class="job-metric-grid">
            <el-card class="job-metric-card" shadow="never">
              <div class="job-metric-icon bg-gold/20 text-cocoa">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="min-w-0">
                <p class="job-metric-label">Protection Fee</p>
                <p class="job-metric-value text-ink">{{ protectionFeeLabel(trade) }}</p>
                <p class="job-metric-hint">{{ protectionRateHint(trade) }}</p>
              </div>
            </el-card>
            <el-card class="job-metric-card" shadow="never">
              <div class="job-metric-icon bg-cocoa/10 text-cocoa">
                <el-icon><Lock /></el-icon>
              </div>
              <div class="min-w-0">
                <p class="job-metric-label">Required Margin</p>
                <p class="job-metric-value text-cocoa">{{ money(requiredMargin(trade)) }}</p>
                <p class="job-metric-hint">Locked from your vault</p>
              </div>
            </el-card>
            <el-card
              class="job-metric-card job-action-card"
              :class="canAcceptTrade(trade) ? 'job-action-ready' : 'job-action-blocked'"
              shadow="never"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div class="job-metric-icon">
                  <el-icon>
                    <Lock v-if="canAcceptTrade(trade)" />
                    <Warning v-else />
                  </el-icon>
                </div>
                <div class="min-w-0">
                  <p class="job-metric-label">Vault Check</p>
                  <p class="job-metric-hint">
                    {{ canAcceptTrade(trade) ? 'Ready to reserve margin' : 'Top up before accepting' }}
                  </p>
                </div>
              </div>
              <el-button
                class="job-action-button w-full whitespace-normal"
                :type="canAcceptTrade(trade) ? 'primary' : 'danger'"
                :plain="!canAcceptTrade(trade)"
                :disabled="!canAcceptTrade(trade)"
                @click="selectTrade(trade)"
              >
                <el-icon class="mr-1">
                  <Lock v-if="canAcceptTrade(trade)" />
                  <Warning v-else />
                </el-icon>
                {{ canAcceptTrade(trade) ? 'Accept Job' : 'Insufficient Balance' }}
              </el-button>
            </el-card>
          </div>
        </div>
      </el-card>
    </div>

    <el-empty v-if="pendingTrades.length === 0" description="No pending middleman jobs">
      <el-button type="primary" @click="$router.push('/create')">Create a trade</el-button>
    </el-empty>

    <el-dialog
      v-model="dialogVisible"
      class="margin-dialog"
      width="min(92vw, 520px)"
      align-center
      :close-on-click-modal="!isAccepting"
      :close-on-press-escape="!isAccepting"
      @closed="resetDialog"
    >
      <template #header>
        <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
          <el-icon><Lock /></el-icon>
          Margin Lock Confirmation
        </p>
      </template>

      <div v-if="selectedTrade">
        <h2 class="text-2xl font-black text-ink">Lock {{ money(requiredMargin(selectedTrade)) }}?</h2>
        <p class="mt-3 leading-7 text-muted">
          Accepting {{ selectedTrade.id }} will lock margin equal to the highest item value. Your available balance updates immediately after confirmation.
        </p>
        <el-alert v-if="errorMessage" class="mt-4" type="error" :title="errorMessage" show-icon :closable="false" />
      </div>

      <template #footer>
        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <el-button size="large" @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" size="large" :loading="isAccepting" @click="confirmAccept">
            Confirm & Lock Margin
          </el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { Briefcase, CircleCheck, Lock, Wallet, Warning } from '@element-plus/icons-vue'
import ItemRarityCard from '../components/ItemRarityCard.vue'
import { formatMoney as money, formatPercent } from '../composables/useMoney'
import { useTradeStore } from '../composables/useTradeStore'

const {
  availableBalance,
  pendingTrades,
  requiredMargin,
  feeRateForRarity,
  insuranceFeeForTrade,
  protectedItemForTrade,
  acceptMiddlemanJob,
} = useTradeStore()

const selectedTrade = ref(null)
const dialogVisible = ref(false)
const isAccepting = ref(false)
const errorMessage = ref('')

function canAcceptTrade(trade) {
  return availableBalance.value >= requiredMargin(trade)
}

function protectionFeeLabel(trade) {
  if (!trade.insurance) return 'Not insured'
  return money(insuranceFeeForTrade(trade))
}

function protectionRateHint(trade) {
  if (!trade.insurance) return 'Premium Protection off'

  const item = protectedItemForTrade(trade)
  return `${item.rarity} rate · ${formatPercent(feeRateForRarity(item.rarity))}`
}

function selectTrade(trade) {
  selectedTrade.value = trade
  errorMessage.value = ''
  dialogVisible.value = true
}

function resetDialog() {
  selectedTrade.value = null
  errorMessage.value = ''
  isAccepting.value = false
}

function confirmAccept() {
  if (!selectedTrade.value) return

  const tradeId = selectedTrade.value.id
  isAccepting.value = true
  errorMessage.value = ''
  window.setTimeout(() => {
    const result = acceptMiddlemanJob(tradeId)
    isAccepting.value = false

    if (!result.ok) {
      errorMessage.value = result.message
      return
    }

    dialogVisible.value = false
  }, 1300)
}

</script>
