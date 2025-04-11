import type { StockItem } from '@/types/stock.types'
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stockItems: [
      {
        code: '87305928',
        product: 'Smartphone',
        warehouse: 'Warehouse 02',
        quantity: 5,
        alertQuantity: 10,
      },
      {
        code: '87305912',
        product: 'Mask',
        warehouse: 'Warehouse 02',
        quantity: 10,
        alertQuantity: 5,
      },
    ] as StockItem[],
  }),
})
