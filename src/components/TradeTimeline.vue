<template>
  <el-card class="timeline-card rune-panel" shadow="never">
    <el-steps
      class="vault-steps vault-steps-desktop"
      :active="currentStep"
      finish-status="success"
      process-status="process"
      align-center
    >
      <el-step
        v-for="step in steps"
        :key="step.label"
        :title="step.label"
        :description="step.copy"
        :icon="step.icon"
      />
    </el-steps>

    <div
      class="vault-steps-mobile"
      aria-label="Escrow progress"
      :style="{ '--vault-progress': progressPercent }"
    >
      <div class="vault-progress-mobile">
        <div>
          <span class="vault-progress-kicker">Escrow process</span>
          <p>Step {{ activeStep + 1 }} of {{ steps.length }}</p>
        </div>
        <span>{{ steps[activeStep].mobileLabel || steps[activeStep].label }}</span>
      </div>

      <div class="vault-progress-track" aria-hidden="true">
        <span />
      </div>

      <div
        v-for="(step, index) in steps"
        :key="step.label"
        class="vault-step-mobile"
        :class="{
          'is-complete': index < activeStep,
          'is-current': index === activeStep,
        }"
        :aria-current="index === activeStep ? 'step' : undefined"
      >
        <span class="vault-step-mobile-node">
          <span class="vault-step-mobile-number">{{ index + 1 }}</span>
          <span class="vault-step-mobile-icon">
            <el-icon><component :is="step.icon" /></el-icon>
          </span>
        </span>
        <span class="min-w-0">
          <span class="vault-step-mobile-meta">
            <span>{{ stateLabel(index) }}</span>
          </span>
          <span class="block text-sm font-black leading-tight text-ink">{{ step.mobileLabel || step.label }}</span>
          <span class="mt-0.5 block text-xs font-semibold leading-5 text-muted">{{ step.copy }}</span>
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed, markRaw } from 'vue'
import { CircleCheck, DocumentAdd, Finished, Lock, Switch, UserFilled } from '@element-plus/icons-vue'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 0,
  },
})

const steps = [
  { icon: markRaw(DocumentAdd), label: 'Created', copy: 'Trade terms captured' },
  { icon: markRaw(UserFilled), label: 'Middleman Assigned', mobileLabel: 'Middleman', copy: 'Freelancer accepts job' },
  { icon: markRaw(Lock), label: 'Margin Locked', mobileLabel: 'Margin Locked', copy: 'Item value secured' },
  { icon: markRaw(Switch), label: 'Items Exchanged', mobileLabel: 'Items Exchanged', copy: 'Both sides verify' },
  { icon: markRaw(Finished || CircleCheck), label: 'Completed / Dispute', mobileLabel: 'Complete / Dispute', copy: 'Release or review' },
]

const activeStep = computed(() => Math.min(Math.max(props.currentStep, 0), steps.length - 1))
const progressPercent = computed(() => `${((activeStep.value + 1) / steps.length) * 100}%`)

function stateLabel(index) {
  if (index < activeStep.value) return 'Done'
  if (index === activeStep.value) return 'Now'
  return 'Next'
}
</script>
