<template>
  <div class="chart-canvas-wrap">
    <canvas ref="canvasRef" :aria-label="ariaLabel" role="img"></canvas>
  </div>
</template>

<script setup>
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
)

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  ariaLabel: {
    type: String,
    default: 'Kawai888 chart',
  },
})

const canvasRef = ref(null)
let chartInstance = null

function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

async function renderChart() {
  await nextTick()
  if (!canvasRef.value) return

  destroyChart()
  chartInstance = new Chart(canvasRef.value, props.config)
}

onMounted(renderChart)
onBeforeUnmount(destroyChart)

watch(
  () => props.config,
  () => {
    renderChart()
  },
)
</script>
