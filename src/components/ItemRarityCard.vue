<template>
  <article class="rarity-card" :class="rarityClass">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-ash">{{ item.owner }}</p>
        <h2 class="mt-2 break-words text-xl font-black leading-snug text-ivory">{{ item.name }}</h2>
      </div>
      <span class="status-pill shrink-0" :class="badgeClass">{{ normalizedRarity }}</span>
    </div>

    <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-ash">Vault Value</p>
        <p class="mt-1 text-3xl font-black text-gold">{{ money(item.value) }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <span v-if="insured" class="status-pill border-gold/45 bg-gold/10 text-gold">Protected</span>
        <span class="status-pill border-ivory/20 bg-ivory/10 text-ivory">{{ seal }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  insured: {
    type: Boolean,
    default: false,
  },
  seal: {
    type: String,
    default: 'KYC Seal',
  },
})

const normalizedRarity = computed(() => props.item.rarity || 'Legendary')
const rarityKey = computed(() => normalizedRarity.value.toLowerCase())
const rarityClass = computed(() => `rarity-${rarityKey.value}`)

const badgeClass = computed(() => {
  if (rarityKey.value === 'mythic') return 'border-mythic/50 bg-mythic/15 text-mythic'
  if (rarityKey.value === 'epic') return 'border-epic/50 bg-epic/15 text-epic'
  return 'border-gold/50 bg-gold/15 text-gold'
})

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
</script>
