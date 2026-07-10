<template>
  <el-card class="rarity-card" :class="rarityClass" shadow="never">
    <div class="rarity-card-shell">
      <div class="rarity-card-header">
        <div class="min-w-0">
        <p class="text-xs font-bold uppercase tracking-[0.14em] text-muted">{{ item.owner }}</p>
          <h2 class="rarity-item-name">{{ item.name }}</h2>
      </div>
      <el-tag class="rarity-tag shrink-0" :class="badgeClass" effect="light">
        <el-icon class="mr-1"><Star /></el-icon>
        {{ normalizedRarity }}
      </el-tag>
    </div>

      <div class="rarity-card-footer">
        <div class="rarity-price-block">
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Vault Value</p>
          <p class="rarity-price">{{ money(item.value) }}</p>
      </div>
        <div class="rarity-seal-stack">
        <el-tag v-if="insured" class="protected-tag" effect="light">
          <el-icon class="mr-1"><CircleCheck /></el-icon>
          Protected
        </el-tag>
        <el-tag class="seal-tag" effect="plain">
          <el-icon class="mr-1"><CollectionTag /></el-icon>
          {{ seal }}
        </el-tag>
      </div>
    </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { CircleCheck, CollectionTag, Star } from '@element-plus/icons-vue'
import { formatMoney as money } from '../composables/useMoney'

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
  if (rarityKey.value === 'mythic') return 'rarity-tag-mythic'
  if (rarityKey.value === 'epic') return 'rarity-tag-epic'
  return 'rarity-tag-legendary'
})

</script>
