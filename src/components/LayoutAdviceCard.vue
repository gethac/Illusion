<template>
  <Transition name="fade">
    <div v-if="visible && recommendation" class="mt-3 p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 shadow-lg">
      <div class="flex items-start gap-2 mb-2">
        <Icon name="lightbulb" :size="16" class="text-cyan-400 mt-0.5 shrink-0"/>
        <div class="flex-1">
          <div class="text-white text-xs font-bold mb-1 flex items-center gap-1">
            💡 布局建议
            <span class="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[8px]">
              {{ Math.round(recommendation.confidence * 100) }}% 匹配
            </span>
          </div>
          <div class="text-[#8a9a9a] text-[10px] leading-relaxed mb-2">
            {{ recommendation.reason }}
          </div>
          <div class="text-cyan-300 text-xs font-bold">
            推荐：{{ layoutNameMap[recommendation.recommendedLayout] || recommendation.recommendedLayout }}
          </div>
        </div>
      </div>
      <div class="flex gap-2 mt-2">
        <button @click="$emit('apply')"
                class="flex-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded text-[10px] font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
          <Icon name="check" :size="12"/>
          应用建议
        </button>
        <button @click="$emit('dismiss')"
                class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] transition-colors flex items-center justify-center gap-1">
          <Icon name="x" :size="12"/>
          忽略
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import Icon from './Icon.vue'

defineProps({
  visible: Boolean,
  recommendation: Object
})

defineEmits(['apply', 'dismiss'])

const layoutNameMap = {
  'classic': '经典布局',
  'classic-vertical': '垂直布局',
  'classic-center': '居中布局',
  'big-data': '大数据展示',
  'timeline': '时间线',
  'comparison': '对比',
  'chart': '图表',
  'image-grid': '多图网格',
  'image-full': '全图布局'
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
