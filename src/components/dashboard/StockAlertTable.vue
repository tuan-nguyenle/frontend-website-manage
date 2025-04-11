<template>
  <table class="w-full border-collapse">
    <thead>
      <tr class="bg-gray-200">
        <th class="p-2 border">CODE</th>
        <th class="p-2 border">PRODUCT</th>
        <th class="p-2 border">WAREHOUSE</th>
        <th class="p-2 border text-right">QUANTITY</th>
        <th class="p-2 border text-right">ALERT QUANTITY</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in items"
        :key="item.code"
        :class="{ 'bg-gray-50': index % 2 === 0 }"
      >
        <td class="p-2 border">{{ item.code }}</td>
        <td class="p-2 border">{{ item.product }}</td>
        <td class="p-2 border">{{ item.warehouse }}</td>
        <td
          class="p-2 border text-right"
          :class="{ 'text-red-500': item.quantity < item.alertQuantity }"
        >
          {{ item.quantity }}
        </td>
        <td class="p-2 border text-right">{{ item.alertQuantity }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StockAlertTable',
  props: {
    items: {
      type: Array as () => {
        code: string
        product: string
        warehouse: string
        quantity: number
        alertQuantity: number
      }[],
      required: true,
    },
  },
})
</script>
