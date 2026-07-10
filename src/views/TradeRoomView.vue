<template>
  <section v-if="trade" class="space-y-6">
    <el-card class="trade-room-hero rune-panel" shadow="never">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-sm font-bold text-cocoa">Vault Room / Live Escrow</p>
          <h1 class="mt-3 flex items-start gap-2 text-2xl font-black leading-tight text-ink sm:gap-3 sm:text-3xl">
            <el-icon class="mt-1 shrink-0 text-cocoa" :size="28"><ScaleToOriginal /></el-icon>
            <span>{{ trade.id }} artifact exchange</span>
          </h1>
          <p class="mt-2 max-w-2xl leading-7 text-muted">
            A transparent vault room shows item rarity, verified owners, locked margin, and the exact escrow step before anyone releases loot.
          </p>
        </div>
        <el-tag class="protected-tag trade-status-tag" effect="light">{{ trade.status }}</el-tag>
      </div>
    </el-card>

    <TradeTimeline :current-step="trade.timelineStep" />

    <div class="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <el-card shadow="never">
        <div class="grid gap-4 sm:grid-cols-2">
          <ItemRarityCard :item="trade.itemA" :insured="trade.insurance" seal="KYC Seal" />
          <ItemRarityCard :item="trade.itemB" :insured="trade.insurance" seal="Discord Seal" />
        </div>

        <el-card class="vault-controls-card mt-5" shadow="never">
          <div class="vault-controls-layout">
            <p class="vault-controls-title">
              <el-icon class="text-cocoa"><Lock /></el-icon>
              Vault controls
            </p>
            <div class="vault-control-actions">
              <el-button @click="advanceTo(3)">
                <el-icon class="mr-1"><Switch /></el-icon>
                Mark Items Exchanged
              </el-button>
              <el-button type="primary" @click="advanceTo(4)">
                <el-icon class="mr-1"><CircleCheck /></el-icon>
                Complete Trade
              </el-button>
              <el-button type="danger" plain @click="openDispute">
                <el-icon class="mr-1"><Warning /></el-icon>
                Flag Dispute
              </el-button>
            </div>
          </div>
        </el-card>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
            <el-icon><VideoCamera /></el-icon>
            Dispute Proof
          </p>
        </template>

        <p class="text-sm leading-6 text-muted">
          Paste a third-party video URL from YouTube, Google Drive, or Medal.tv. Kawai888 avoids storing evidence files to keep moderation costs low.
        </p>

        <el-form label-position="top" class="mt-5">
          <el-form-item label="Video evidence URL">
            <el-input
              v-model="evidenceUrl"
              size="large"
              placeholder="https://medal.tv/..."
              @blur="saveEvidence"
            />
          </el-form-item>
        </el-form>

        <el-alert
          v-if="trade.evidenceUrl"
          class="mt-4 evidence-alert"
          type="warning"
          show-icon
          :closable="false"
        >
          <template #title>
            <span class="break-all">Saved: {{ trade.evidenceUrl }}</span>
          </template>
        </el-alert>

        <div class="mt-6 rounded-xl border border-gold/60 bg-gold/20 p-4 text-ink">
          <p class="inline-flex items-center gap-2 font-black">
            <el-icon><Lock /></el-icon>
            Middleman margin
          </p>
          <p class="mt-2 text-sm leading-6 text-ink/70">
            Required lock for this trade is {{ money(requiredMargin(trade)) }}. The freelance middleman must cover the highest item value before accepting.
          </p>
        </div>
      </el-card>
    </div>
  </section>

  <el-card v-else class="text-center" shadow="never">
    <h1 class="text-2xl font-black text-ink">Trade room not found</h1>
    <el-button class="mt-4" type="primary" size="large" @click="router.push('/middleman')">View open jobs</el-button>
  </el-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CircleCheck, Lock, ScaleToOriginal, Switch, VideoCamera, Warning } from '@element-plus/icons-vue'
import ItemRarityCard from '../components/ItemRarityCard.vue'
import TradeTimeline from '../components/TradeTimeline.vue'
import { formatMoney as money } from '../composables/useMoney'
import { useTradeStore } from '../composables/useTradeStore'

const route = useRoute()
const router = useRouter()
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

</script>
