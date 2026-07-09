<template>
  <div class="card rune-panel p-4 sm:p-5">
    <div class="flex flex-col gap-4 md:flex-row md:items-center">
      <div v-for="(step, index) in steps" :key="step.label" class="flex flex-1 items-start gap-3 md:items-center">
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-black transition" :class="bubbleClass(index)">
          {{ step.glyph }}
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold" :class="index <= currentStep ? 'text-ivory' : 'text-ash'">{{ step.label }}</p>
          <p class="text-xs leading-5 text-ash">{{ step.copy }}</p>
        </div>
        <div v-if="index < steps.length - 1" class="hidden h-px flex-1 md:block" :class="index < currentStep ? 'bg-gold' : 'bg-line'"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    default: 0,
  },
})

const steps = [
  { glyph: 'I', label: 'Created', copy: 'Trade terms captured' },
  { glyph: 'M', label: 'Middleman Assigned', copy: 'Freelancer accepts job' },
  { glyph: 'L', label: 'Margin Locked', copy: 'Item value secured' },
  { glyph: 'X', label: 'Items Exchanged', copy: 'Both sides verify' },
  { glyph: 'V', label: 'Completed / Dispute', copy: 'Release or review' },
]

function bubbleClass(index) {
  if (index < props.currentStep) return 'border-gold bg-gold text-void'
  if (index === props.currentStep) return 'border-gold bg-gold/20 text-gold'
  return 'border-line bg-raised text-ash'
}
</script>
