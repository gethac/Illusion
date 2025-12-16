<template>
  <div class="mb-2 px-2 py-1.5 rounded text-[9px] flex items-center gap-1"
       :class="{
         'bg-green-500/10 text-green-400 border border-green-500/20': status.type === 'success',
         'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20': status.type === 'warning',
         'bg-blue-500/10 text-blue-400 border border-blue-500/20': status.type === 'info'
       }">
    <Icon :name="iconName" :size="10"/>
    {{ status.message }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  status: Object
})

const iconName = computed(() => {
  if (props.status.type === 'success') return 'check-circle'
  if (props.status.type === 'warning') return 'alert-circle'
  return 'info'
})
</script>
