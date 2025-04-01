import BarChart from '@/views/Chart/BarChart/BarChart.vue'
import LineChart from '@/views/Chart/LineChart/LineChart.vue'

export default [
  {
    path: '/line-chart',
    name: 'Line Chart',
    component: LineChart,
  },
  {
    path: '/bar-chart',
    name: 'Bar Chart',
    component: BarChart,
  },
]
