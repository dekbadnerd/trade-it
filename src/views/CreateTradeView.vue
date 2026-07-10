<template>
  <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
    <el-card class="rune-panel" shadow="never">
      <template #header>
        <p class="text-sm font-bold text-cocoa">Create Artifact Trade</p>
        <h1 class="mt-3 flex items-start gap-3 text-3xl font-black text-ink">
          <el-icon class="mt-1 shrink-0 text-cocoa" :size="32"><CirclePlus /></el-icon>
          <span>Price the swap before anyone hands over loot.</span>
        </h1>
        <p class="mt-3 leading-7 text-muted">
          Premium Protection prices the higher-value artifact by rarity tier, so expensive rare loot gets a clear protection fee before either party commits.
        </p>
      </template>

      <el-form class="trade-form" label-position="top" @submit.prevent>
        <div class="grid gap-4 sm:grid-cols-2">
          <el-form-item label="Your Artifact A" required>
            <el-input v-model="form.itemA.name" size="large" />
          </el-form-item>
          <el-form-item label="Artifact A Value" required>
            <el-input-number v-model="form.itemA.value" class="w-full" :min="1" :controls="false" size="large" />
          </el-form-item>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <el-form-item label="Counterparty Artifact B" required>
            <el-input v-model="form.itemB.name" size="large" />
          </el-form-item>
          <el-form-item label="Artifact B Value" required>
            <el-input-number v-model="form.itemB.value" class="w-full" :min="1" :controls="false" size="large" />
          </el-form-item>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <el-form-item label="Artifact A Rarity">
            <el-select v-model="form.itemA.rarity" class="w-full" size="large">
              <el-option v-for="rarity in rarityOptions" :key="rarity" :label="rarity" :value="rarity" />
            </el-select>
          </el-form-item>
          <el-form-item label="Artifact B Rarity">
            <el-select v-model="form.itemB.rarity" class="w-full" size="large">
              <el-option v-for="rarity in rarityOptions" :key="rarity" :label="rarity" :value="rarity" />
            </el-select>
          </el-form-item>
        </div>

        <el-card class="insurance-option" shadow="never">
          <el-checkbox v-model="form.insurance" size="large">
            <span class="inline-flex items-center gap-2 font-bold text-ink">
              <el-icon><CircleCheck /></el-icon>
              Premium Protection (Insurance)
            </span>
          </el-checkbox>
          <p class="mt-2 text-sm leading-6 text-muted">Adds tier-based coverage fee and prioritizes dispute review.</p>
        </el-card>

        <el-button class="mt-5 w-full" type="primary" size="large" :loading="isCreating" @click="submitTrade">
          {{ isCreating ? 'Creating escrow room...' : 'Create Trade' }}
        </el-button>
      </el-form>
    </el-card>

    <aside>
      <el-card class="overflow-hidden" shadow="never">
        <template #header>
          <p class="inline-flex items-center gap-2 text-sm font-bold text-cocoa">
            <el-icon><Discount /></el-icon>
            Fee Preview
          </p>
          <h2 class="mt-2 text-2xl font-black text-ink">Premium Protection economics</h2>
        </template>

        <div class="space-y-4">
          <div class="wallet-row">
            <span>Protected value</span>
            <strong>{{ money(protectedValue) }}</strong>
          </div>
          <div class="wallet-row">
            <span>Protected rarity</span>
            <strong>{{ protectedRarity }}</strong>
          </div>
          <div class="wallet-row">
            <span>Protection rate</span>
            <strong>{{ form.insurance ? formatPercent(protectionRate) : '0%' }}</strong>
          </div>
          <div class="wallet-row">
            <span>Premium Protection fee</span>
            <strong class="text-cocoa">{{ money(insuranceFee) }}</strong>
          </div>
          <div class="flex justify-between gap-4 text-lg">
            <span class="text-muted">Escrow total</span>
            <strong class="text-cocoa">{{ money(protectedValue + insuranceFee) }}</strong>
          </div>
        </div>
      </el-card>

      <el-card class="mt-5" shadow="never">
        <template #header>
          <p class="inline-flex items-center gap-2 font-semibold text-ink">
            <el-icon><Star /></el-icon>
            Rarity preview
          </p>
        </template>
        <p class="text-sm leading-6 text-muted">
          Mock rarity helps the pitch feel like an MMORPG inventory while keeping all trade data local.
        </p>
        <div class="mt-4 grid gap-3">
          <ItemRarityCard :item="previewItemA" :insured="form.insurance" seal="Your Vault" />
          <ItemRarityCard :item="previewItemB" :insured="form.insurance" seal="Counterparty" />
        </div>
      </el-card>
    </aside>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CircleCheck, CirclePlus, Discount, Star } from '@element-plus/icons-vue'
import ItemRarityCard from '../components/ItemRarityCard.vue'
import { formatMoney as money, formatPercent } from '../composables/useMoney'
import { useTradeStore } from '../composables/useTradeStore'

const router = useRouter()
const { createTrade, feeRateForRarity, insuranceFeeFor, rarityOptions } = useTradeStore()
const isCreating = ref(false)

const form = reactive({
  itemA: { name: 'Celestial Bow +15', value: 2600, rarity: 'Legendary' },
  itemB: { name: 'Valkyrie Armor Set', value: 2500, rarity: 'Epic' },
  counterparty: 'Counterparty',
  insurance: true,
})

const protectedValue = computed(() => Math.max(Number(form.itemA.value) || 0, Number(form.itemB.value) || 0))
const protectedRarity = computed(() =>
  Number(form.itemA.value) >= Number(form.itemB.value) ? form.itemA.rarity : form.itemB.rarity,
)
const protectionRate = computed(() => feeRateForRarity(protectedRarity.value))
const insuranceFee = computed(() => insuranceFeeFor(protectedValue.value, form.insurance, protectedRarity.value))
const previewItemA = computed(() => ({ owner: 'You', ...form.itemA }))
const previewItemB = computed(() => ({ owner: form.counterparty, ...form.itemB }))

function submitTrade() {
  if (!form.itemA.name || !form.itemB.name || protectedValue.value <= 0) return

  isCreating.value = true
  window.setTimeout(() => {
    const trade = createTrade(form)
    isCreating.value = false
    router.push(`/trade/${trade.id}`)
  }, 1400)
}

</script>
