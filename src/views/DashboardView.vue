<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <admin-layout>
    <div
      class="bg-white border border-gray-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-5 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <!-- Top Selling Products -->
      <div class="p-4 rounded-lg">
        <PieChartComponents />
      </div>

      <!-- This Week’s Sales & Purchases -->
      <div class="p-4 rounded-lg text-lg font-semibold text-gray-800 dark:text-white/90">
        <h2 class="text-lg font-bold mb-2">This Week’s Sales & Purchases</h2>
        <!-- <BarChart :options="barChartOptions" :series="barChartSeries" /> -->
      </div>

      <!-- Stock Alert -->
      <div class="p-4 rounded-lg text-lg font-semibold text-gray-800 dark:text-white/90">
        <h2 class="text-lg font-bold mb-2">Stock Alert</h2>
        <!-- <StockAlertTable :items="stockItems" /> -->
      </div>

      <!-- Top 05 Customer -->
      <div class="p-4 rounded-lg text-lg font-semibold text-gray-800 dark:text-white/90">
        <h2 class="text-lg font-bold mb-2">Top 05 Customer (January)</h2>
        <!-- <DonutChart :options="donutChartOptions" :series="donutChartSeries" /> -->
      </div>
    </div>
  </admin-layout>
</template>

<script lang="ts" setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PieChartComponents from '@/components/dashboard/PieChartComponents.vue'
</script>
