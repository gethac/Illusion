<template>
  <component :is="iconName" :size="size" :class="className" />
</template>

<script setup>
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 24
  },
  class: {
    type: String,
    default: ''
  }
})

// 将 kebab-case 转换为 PascalCase
const iconName = computed(() => {
  const name = props.name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return icons[name] || icons.HelpCircle
})

const className = computed(() => props.class)
</script>
