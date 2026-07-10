<template>
  <article class="rarity-card" :class="rarityClass">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-muted">{{ item.owner }}</p>
        <h2 class="mt-2 break-words text-xl font-black leading-snug text-ink">{{ item.name }}</h2>
      </div>
      <span class="status-pill inline-flex shrink-0 items-center gap-1.5" :class="badgeClass">
        <SparklesIcon class="h-3.5 w-3.5" aria-hidden="true" />
        {{ normalizedRarity }}
      </span>
    </div>

    <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Vault Value</p>
        <p class="mt-1 text-3xl font-black text-cocoa">{{ money(item.value) }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <span v-if="insured" class="status-pill inline-flex items-center gap-1.5 border-gold/70 bg-gold/25 text-ink">
          <ShieldCheckIcon class="h-3.5 w-3.5" aria-hidden="true" />
          Protected
        </span>
        <span class="status-pill inline-flex items-center gap-1.5 border-line bg-raised text-cocoa">
          <TagIcon class="h-3.5 w-3.5" aria-hidden="true" />
          {{ seal }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { ShieldCheckIcon, SparklesIcon, TagIcon } from '@heroicons/vue/24/outline'

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
  if (rarityKey.value === 'mythic') return 'border-mythic/40 bg-mythic/10 text-mythic'
  if (rarityKey.value === 'epic') return 'border-epic/40 bg-epic/10 text-epic'
  return 'border-gold/70 bg-gold/25 text-ink'
})

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
</script>
