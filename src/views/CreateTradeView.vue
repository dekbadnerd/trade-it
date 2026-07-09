<template>
  <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
    <div class="card p-5 sm:p-6">
      <p class="text-sm font-bold text-gold">Create Artifact Trade</p>
      <h1 class="mt-3 text-3xl font-black text-ivory">Price the swap before anyone hands over loot.</h1>
      <p class="mt-3 leading-7 text-ash">
        Premium Protection adds a clear 1.5% insurance fee to the higher item value. It makes the startup monetization model visible during the pitch.
      </p>

      <form class="mt-6 space-y-5" @submit.prevent="submitTrade">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="text-sm font-medium text-ash">Your Artifact A</span>
            <input v-model="form.itemA.name" required class="focus-gold mt-2 w-full rounded-md border border-line bg-raised px-4 py-3 text-ivory placeholder:text-ash" />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-ash">Artifact A Value</span>
            <input v-model.number="form.itemA.value" required min="1" type="number" class="focus-gold mt-2 w-full rounded-md border border-line bg-raised px-4 py-3 text-ivory" />
          </label>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="text-sm font-medium text-ash">Counterparty Artifact B</span>
            <input v-model="form.itemB.name" required class="focus-gold mt-2 w-full rounded-md border border-line bg-raised px-4 py-3 text-ivory" />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-ash">Artifact B Value</span>
            <input v-model.number="form.itemB.value" required min="1" type="number" class="focus-gold mt-2 w-full rounded-md border border-line bg-raised px-4 py-3 text-ivory" />
          </label>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="text-sm font-medium text-ash">Artifact A Rarity</span>
            <select v-model="form.itemA.rarity" class="focus-gold mt-2 w-full rounded-md border border-line bg-raised px-4 py-3 text-ivory">
              <option v-for="rarity in rarityOptions" :key="rarity" :value="rarity">{{ rarity }}</option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm font-medium text-ash">Artifact B Rarity</span>
            <select v-model="form.itemB.rarity" class="focus-gold mt-2 w-full rounded-md border border-line bg-raised px-4 py-3 text-ivory">
              <option v-for="rarity in rarityOptions" :key="rarity" :value="rarity">{{ rarity }}</option>
            </select>
          </label>
        </div>

        <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-gold/35 bg-gold/10 p-4 transition hover:bg-gold/15">
          <input v-model="form.insurance" type="checkbox" class="mt-1 h-5 w-5 accent-gold" />
          <span>
            <span class="block font-bold text-ivory">Premium Protection (Insurance)</span>
            <span class="text-sm leading-6 text-ash">Adds 1.5% coverage fee and prioritizes dispute review.</span>
          </span>
        </label>

        <button type="submit" :disabled="isCreating" class="min-h-12 w-full rounded-md bg-gold px-5 py-3 font-black text-void transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60">
          <span v-if="isCreating">Creating escrow room...</span>
          <span v-else>Create Trade</span>
        </button>
      </form>
    </div>

    <aside class="card overflow-hidden">
      <div class="bg-ivory p-5 text-void sm:p-6">
        <p class="text-sm font-bold text-void/65">Fee Preview</p>
        <h2 class="mt-2 text-2xl font-black">Premium Protection economics</h2>
      </div>
      <div class="space-y-4 p-5 sm:p-6">
        <div class="flex justify-between gap-4 border-b border-line pb-3">
          <span class="text-ash">Protected value</span>
          <span class="font-bold text-ivory">{{ money(protectedValue) }}</span>
        </div>
        <div class="flex justify-between gap-4 border-b border-line pb-3">
          <span class="text-ash">Insurance rate</span>
          <span class="font-bold text-ivory">{{ form.insurance ? '1.5%' : '0%' }}</span>
        </div>
        <div class="flex justify-between gap-4 border-b border-line pb-3">
          <span class="text-ash">Premium Protection fee</span>
          <span class="font-bold text-gold">{{ money(insuranceFee) }}</span>
        </div>
        <div class="flex justify-between gap-4 text-lg">
          <span class="text-ash">Escrow total</span>
          <span class="font-black text-gold">{{ money(protectedValue + insuranceFee) }}</span>
        </div>
      </div>

      <div class="mx-5 mb-5 rounded-lg border border-line bg-raised p-4 sm:mx-6 sm:mb-6">
        <p class="font-semibold text-ivory">Rarity preview</p>
        <p class="mt-2 text-sm leading-6 text-ash">
          Mock rarity helps the pitch feel like an MMORPG inventory while keeping all trade data local.
        </p>
        <div class="mt-4 grid gap-3">
          <ItemRarityCard :item="previewItemA" :insured="form.insurance" seal="Your Vault" />
          <ItemRarityCard :item="previewItemB" :insured="form.insurance" seal="Counterparty" />
        </div>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ItemRarityCard from '../components/ItemRarityCard.vue'
import { useTradeStore } from '../composables/useTradeStore'

const router = useRouter()
const { createTrade, insuranceFeeFor } = useTradeStore()
const isCreating = ref(false)

const form = reactive({
  itemA: { name: 'Celestial Bow +15', value: 2600, rarity: 'Legendary' },
  itemB: { name: 'Valkyrie Armor Set', value: 2500, rarity: 'Epic' },
  counterparty: 'Counterparty',
  insurance: true,
})

const rarityOptions = ['Epic', 'Legendary', 'Mythic']
const protectedValue = computed(() => Math.max(Number(form.itemA.value) || 0, Number(form.itemB.value) || 0))
const insuranceFee = computed(() => insuranceFeeFor(protectedValue.value, form.insurance))
const previewItemA = computed(() => ({ owner: 'You', ...form.itemA }))
const previewItemB = computed(() => ({ owner: form.counterparty, ...form.itemB }))

function submitTrade() {
  isCreating.value = true
  window.setTimeout(() => {
    const trade = createTrade(form)
    isCreating.value = false
    router.push(`/trade/${trade.id}`)
  }, 1400)
}

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
</script>
