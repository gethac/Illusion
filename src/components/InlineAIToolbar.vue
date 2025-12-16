<template>
  <Teleport to="body">
    <Transition name="fade-scale">
      <div v-if="visible && selectedText"
           class="inline-ai-toolbar"
           :style="toolbarStyle">
        <!-- AI工具按钮 -->
        <div class="toolbar-buttons">
          <button @click="handleAIAction('simplify')"
                  :disabled="isProcessing"
                  class="toolbar-btn"
                  title="精简文字">
            <Icon :name="isProcessing && currentAction === 'simplify' ? 'loader-2' : 'minimize-2'"
                  :size="14"
                  :class="{'animate-spin': isProcessing && currentAction === 'simplify'}"/>
            <span>精简</span>
          </button>

          <button @click="handleAIAction('expand')"
                  :disabled="isProcessing"
                  class="toolbar-btn"
                  title="扩写内容">
            <Icon :name="isProcessing && currentAction === 'expand' ? 'loader-2' : 'maximize-2'"
                  :size="14"
                  :class="{'animate-spin': isProcessing && currentAction === 'expand'}"/>
            <span>扩写</span>
          </button>

          <button @click="handleAIAction('rephrase')"
                  :disabled="isProcessing"
                  class="toolbar-btn"
                  title="换一种说法">
            <Icon :name="isProcessing && currentAction === 'rephrase' ? 'loader-2' : 'refresh-cw'"
                  :size="14"
                  :class="{'animate-spin': isProcessing && currentAction === 'rephrase'}"/>
            <span>换说法</span>
          </button>

          <button @click="handleAIAction('polish')"
                  :disabled="isProcessing"
                  class="toolbar-btn"
                  title="润色文字">
            <Icon :name="isProcessing && currentAction === 'polish' ? 'loader-2' : 'sparkles'"
                  :size="14"
                  :class="{'animate-spin': isProcessing && currentAction === 'polish'}"/>
            <span>润色</span>
          </button>

          <div class="toolbar-divider"></div>

          <button @click="$emit('close')"
                  class="toolbar-btn toolbar-btn-close"
                  title="关闭">
            <Icon name="x" :size="14"/>
          </button>
        </div>

        <!-- 三角形指示器 -->
        <div class="toolbar-arrow"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  visible: Boolean,
  position: Object, // { x, y }
  selectedText: String,
  config: Object
})

const emit = defineEmits(['close', 'replace-text'])

const isProcessing = ref(false)
const currentAction = ref(null)

const toolbarStyle = computed(() => {
  if (!props.position) return {}

  return {
    left: `${props.position.x}px`,
    top: `${props.position.y - 60}px`, // 在选中文字上方60px
  }
})

async function handleAIAction(action) {
  if (isProcessing.value || !props.selectedText) return

  isProcessing.value = true
  currentAction.value = action

  try {
    const { rewriteText } = await import('../services/rewrite.js')

    const rewrittenText = await rewriteText(
      props.selectedText,
      action,
      props.config
    )

    emit('replace-text', rewrittenText)
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('AI处理失败:', error)
      alert('AI处理失败: ' + error.message)
    }
  } finally {
    isProcessing.value = false
    currentAction.value = null
  }
}
</script>

<style scoped>
.inline-ai-toolbar {
  position: fixed;
  z-index: 9999;
  background: rgba(10, 17, 17, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(111, 255, 233, 0.3);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(111, 255, 233, 0.2);
  transform: translateX(-50%);
}

.toolbar-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.toolbar-btn:hover:not(:disabled) {
  background: rgba(111, 255, 233, 0.1);
  border-color: rgba(111, 255, 233, 0.3);
  transform: translateY(-1px);
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn-close {
  color: #8a9a9a;
}

.toolbar-btn-close:hover:not(:disabled) {
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 4px;
}

.toolbar-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: rgba(10, 17, 17, 0.98);
  border-right: 1px solid rgba(111, 255, 233, 0.3);
  border-bottom: 1px solid rgba(111, 255, 233, 0.3);
  transform: translateX(-50%) rotate(45deg);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px) scale(0.95);
}
</style>
