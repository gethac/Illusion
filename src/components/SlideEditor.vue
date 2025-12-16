<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="game-container w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8 animate-slide-up">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <Icon name="edit" :size="24" class="text-[var(--accent-gold)]"/>
            编辑幻灯片
          </h2>
          <p class="text-[#8a9a9a] text-sm mt-1">第 {{ slideIndex + 1 }} 页</p>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-white/10 rounded transition-colors">
          <Icon name="x" :size="24" class="text-[#8a9a9a] hover:text-white"/>
        </button>
      </div>

      <!-- 编辑表单 -->
      <div class="space-y-6">
        <!-- 标题 -->
        <div>
          <label class="text-xs text-[#8a9a9a] uppercase mb-2 block flex items-center gap-2">
            <Icon name="heading" :size="14" class="text-[var(--accent-gold)]"/>
            标题
          </label>
          <input v-model="editData.title" class="magic-input w-full p-3 rounded text-lg font-bold" placeholder="输入标题...">
        </div>

        <!-- 内容 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-[#8a9a9a] uppercase flex items-center gap-2">
              <Icon name="file-text" :size="14" class="text-[var(--accent-cyan)]"/>
              内容
            </label>
            <!-- AI重写按钮组 -->
            <div class="flex gap-2">
              <button @click="rewriteContent('simplify')" :disabled="isRewriting" class="ai-mini-btn" title="精简">
                <Icon :name="isRewriting && rewriteMode === 'simplify' ? 'loader-2' : 'minimize-2'" :size="12" :class="{'animate-spin': isRewriting && rewriteMode === 'simplify'}"/>
                精简
              </button>
              <button @click="rewriteContent('expand')" :disabled="isRewriting" class="ai-mini-btn" title="扩写">
                <Icon :name="isRewriting && rewriteMode === 'expand' ? 'loader-2' : 'maximize-2'" :size="12" :class="{'animate-spin': isRewriting && rewriteMode === 'expand'}"/>
                扩写
              </button>
              <button @click="rewriteContent('rephrase')" :disabled="isRewriting" class="ai-mini-btn" title="换个说法">
                <Icon :name="isRewriting && rewriteMode === 'rephrase' ? 'loader-2' : 'refresh-cw'" :size="12" :class="{'animate-spin': isRewriting && rewriteMode === 'rephrase'}"/>
                换说法
              </button>
            </div>
          </div>
          <textarea v-model="editData.content" rows="4" class="magic-input w-full p-3 rounded resize-none" placeholder="输入内容..."></textarea>
        </div>

        <!-- 列表项 -->
        <div v-if="editData.items && editData.items.length > 0">
          <label class="text-xs text-[#8a9a9a] uppercase mb-3 block flex items-center gap-2">
            <Icon name="list" :size="14" class="text-[var(--accent-cyan)]"/>
            要点列表
          </label>
          <div class="space-y-2">
            <div v-for="(item, index) in editData.items" :key="index" class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-[var(--accent-gold)] shrink-0"></div>
              <input v-model="editData.items[index]" class="magic-input flex-1 p-2 rounded text-sm" :placeholder="`要点 ${index + 1}...`">
              <button @click="removeItem(index)" class="p-2 text-[#8a9a9a] hover:text-red-400 transition-colors">
                <Icon name="trash-2" :size="16"/>
              </button>
            </div>
          </div>
          <button @click="addItem" class="mt-3 px-4 py-2 text-xs text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 hover:bg-[var(--accent-cyan)]/10 rounded transition-colors flex items-center gap-2">
            <Icon name="plus" :size="12"/>
            添加要点
          </button>
        </div>

        <!-- 布局选择 -->
        <div>
          <label class="text-xs text-[#8a9a9a] uppercase mb-2 block">布局类型</label>
          <select v-model="editData.layout" class="magic-input w-full p-3 rounded">
            <option value="classic">经典布局</option>
            <option value="classic-vertical">垂直布局</option>
            <option value="classic-center">居中布局</option>
            <option value="big-data">大数据展示</option>
            <option value="timeline">时间线</option>
            <option value="comparison">对比</option>
            <option value="chart">图表</option>
          </select>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
        <button @click="$emit('close')" class="px-6 py-2 text-[#8a9a9a] hover:text-white hover:bg-white/5 rounded transition-colors">
          取消
        </button>
        <button @click="saveChanges" class="game-btn px-8 py-2 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-cyan)] text-[#0a1111] font-bold">
          保存更改
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  show: Boolean,
  slide: Object,
  slideIndex: Number,
  config: Object
})

const emit = defineEmits(['close', 'save'])

const editData = ref({
  title: '',
  content: '',
  items: [],
  layout: 'classic'
})

const isRewriting = ref(false)
const rewriteMode = ref(null)

// 当show变化时，复制slide数据到editData
watch(() => props.show, (newVal) => {
  if (newVal && props.slide) {
    editData.value = {
      title: props.slide.title || '',
      content: props.slide.content || '',
      items: [...(props.slide.items || [])],
      layout: props.slide.layout || 'classic'
    }
  }
})

// AI重写内容
async function rewriteContent(mode) {
  if (!editData.value.content || !editData.value.content.trim()) {
    return
  }

  isRewriting.value = true
  rewriteMode.value = mode

  try {
    const { rewriteText } = await import('../services/rewrite.js')

    const rewrittenText = await rewriteText(
      editData.value.content,
      mode,
      props.config
    )

    editData.value.content = rewrittenText
  } catch (error) {
    if (error.name !== 'AbortError') {
      alert('重写失败: ' + error.message)
    }
  } finally {
    isRewriting.value = false
    rewriteMode.value = null
  }
}

// 添加列表项
function addItem() {
  if (!editData.value.items) {
    editData.value.items = []
  }
  editData.value.items.push('')
}

// 移除列表项
function removeItem(index) {
  editData.value.items.splice(index, 1)
}

// 保存更改
function saveChanges() {
  emit('save', props.slideIndex, editData.value)
  emit('close')
}
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.ai-mini-btn {
  padding: 0.375rem 0.625rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(111, 255, 233, 0.3);
  border-radius: 0.375rem;
  color: var(--accent-cyan);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;
  font-size: 0.625rem;
}

.ai-mini-btn:hover:not(:disabled) {
  background: rgba(111, 255, 233, 0.2);
  border-color: rgba(111, 255, 233, 0.5);
  transform: translateY(-1px);
}

.ai-mini-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
