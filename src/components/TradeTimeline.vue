<template>
  <div class="card rune-panel p-4 sm:p-5">
    <div class="flex flex-col gap-4 md:flex-row md:items-center">
      <div v-for="(step, index) in steps" :key="step.label" class="flex flex-1 items-start gap-3 md:items-center">
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-black transition" :class="bubbleClass(index)">
          <component :is="step.icon" class="h-5 w-5" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold" :class="index <= currentStep ? 'text-ink' : 'text-muted'">{{ step.label }}</p>
          <p class="text-xs leading-5 text-muted">{{ step.copy }}</p>
        </div>
        <div v-if="index < steps.length - 1" class="hidden h-px flex-1 md:block" :class="index < currentStep ? 'bg-gold' : 'bg-line'"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import {
  ArrowsRightLeftIcon,
  CheckBadgeIcon,
  DocumentPlusIcon,
  LockClosedIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 0,
  },
})

const steps = [
  { icon: markRaw(DocumentPlusIcon), label: 'Created', copy: 'Trade terms captured' },
  { icon: markRaw(UserGroupIcon), label: 'Middleman Assigned', copy: 'Freelancer accepts job' },
  { icon: markRaw(LockClosedIcon), label: 'Margin Locked', copy: 'Item value secured' },
  { icon: markRaw(ArrowsRightLeftIcon), label: 'Items Exchanged', copy: 'Both sides verify' },
  { icon: markRaw(CheckBadgeIcon), label: 'Completed / Dispute', copy: 'Release or review' },
]

function bubbleClass(index) {
  if (index < props.currentStep) return 'border-gold bg-gold text-ink'
  if (index === props.currentStep) return 'border-gold bg-gold/25 text-ink'
  return 'border-line bg-raised text-muted'
}
</script>
