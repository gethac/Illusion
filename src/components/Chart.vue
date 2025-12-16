<template>
  <div class="chart-container">
    <v-chart
      class="chart"
      :option="chartOption"
      :autoresize="true"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册必要的 ECharts 组件
use([
  CanvasRenderer,
  BarChart,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const props = defineProps({
  chartType: {
    type: String,
    required: true,
    validator: (value) => ['bar', 'pie', 'line', 'area'].includes(value)
  },
  chartData: {
    type: Array,
    required: true
  },
  theme: {
    type: Object,
    default: () => ({
      colors: {
        accent: '#6fffe9',
        text: '#ffffff'
      }
    })
  }
})

// 智能判断文字颜色 - 确保在任何背景下都可读
const getSmartTextColor = () => {
  const textCol = props.theme?.colors?.text || '#ffffff'

  // 如果文字颜色太暗（亮度 < 128），强制使用浅色
  const rgb = hexToRgb(textCol)
  if (rgb) {
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    // 如果亮度小于128（偏暗），使用白色；否则使用原色
    return brightness < 128 ? '#ffffff' : textCol
  }

  return textCol
}

// 将十六进制颜色转换为 RGB
const hexToRgb = (hex) => {
  // 移除 # 号
  hex = hex.replace(/^#/, '')

  // 处理 3 位hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }

  const bigint = parseInt(hex, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

// 转换图表数据为 ECharts 配置
const chartOption = computed(() => {
  if (!props.chartData || props.chartData.length === 0) {
    return {}
  }

  const series = props.chartData[0]
  const accentColor = props.theme?.colors?.accent || '#6fffe9'
  const textColor = getSmartTextColor()  // 使用智能文字颜色

  // 基础配置
  const baseOption = {
    backgroundColor: 'transparent',
    textStyle: {
      color: textColor
    },
    tooltip: {
      trigger: props.chartType === 'pie' ? 'item' : 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: accentColor,
      borderWidth: 1,
      textStyle: {
        color: textColor
      }
    },
    legend: {
      show: true,
      textStyle: {
        color: textColor
      },
      top: 'bottom'
    }
  }

  // 根据图表类型生成配置
  switch (props.chartType) {
    case 'bar':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: series.labels,
          axisLine: { lineStyle: { color: textColor } },
          axisLabel: { color: textColor }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: textColor } },
          axisLabel: { color: textColor },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [{
          name: series.name || '数据',
          type: 'bar',
          data: series.values,
          itemStyle: {
            color: accentColor
          },
          barWidth: '60%'
        }]
      }

    case 'line':
    case 'area':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: series.labels,
          boundaryGap: false,
          axisLine: { lineStyle: { color: textColor } },
          axisLabel: { color: textColor }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: textColor } },
          axisLabel: { color: textColor },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [{
          name: series.name || '数据',
          type: 'line',
          data: series.values,
          smooth: true,
          areaStyle: props.chartType === 'area' ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: accentColor + '80'
              }, {
                offset: 1,
                color: accentColor + '10'
              }]
            }
          } : undefined,
          lineStyle: {
            color: accentColor,
            width: 2
          },
          itemStyle: {
            color: accentColor
          }
        }]
      }

    case 'pie':
      const pieData = series.labels.map((label, index) => ({
        name: label,
        value: series.values[index]
      }))
      return {
        ...baseOption,
        series: [{
          name: series.name || '数据',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#05080a',
            borderWidth: 2
          },
          label: {
            show: true,
            color: textColor,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true,
            lineStyle: {
              color: textColor
            }
          },
          data: pieData,
          color: [
            accentColor,
            '#ff6b6b',
            '#51cf66',
            '#ffd43b',
            '#748ffc',
            '#ff8787'
          ]
        }]
      }

    default:
      return baseOption
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
