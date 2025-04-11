<template>
  <apexchart type="bar" :options="options" :series="series" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'BarChart',
  components: { apexchart: VueApexCharts },
  props: {
    options: Object,
    series: Array,
  },
})
</script>
