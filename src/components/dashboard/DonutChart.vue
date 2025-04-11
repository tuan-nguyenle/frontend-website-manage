<template>
  <apexchart type="donut" :options="options" :series="series" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'DonutChart',
  components: { apexchart: VueApexCharts },
  props: {
    options: Object,
    series: Array,
  },
})
</script>
