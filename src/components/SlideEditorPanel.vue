<template>
  <div class="editor-panel">
    <!-- 编辑器标题栏 --><div class="editor-header">
      <div>
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <Icon name="settings" :size="20" class="text-[var(--accent-gold)]"/>
          幻灯片设置
        </h3>
        <p class="text-[#8a9a9a] text-xs mt-1">第 {{ selectedIndex + 1 }} 页</p>
      </div>
    </div>

    <!-- 快捷操作按钮区 -->
    <div class="px-4 py-3 border-b border-white/10 space-y-2">
      <button @click="$emit('regenerate-content')"
              :disabled="isRegenerating"
              class="w-full px-3 py-2 bg-[var(--accent-cyan)]/20 hover:bg-[var(--accent-cyan)]/30 border border-[var(--accent-cyan)]/30 rounded text-[var(--accent-cyan)] text-xs flex items-center justify-center gap-2 transition-colors">
        <Icon :name="isRegenerating ? 'loader-2' : 'refresh-cw'" :size="14" :class="{ 'animate-spin': isRegenerating }"/>
        {{ isRegenerating ? '正在生成...' : '重新生成内容' }}
      </button>
    </div>

    <!-- 编辑表单 -->
    <div class="editor-content">
      <!-- 标题 -->
      <div class="editor-field">
        <label class="editor-label">
          <Icon name="heading" :size="12" class="text-[var(--accent-gold)]"/>
          标题
        </label>
        <input v-model="editData.title"
               class="magic-input w-full p-2 rounded text-sm font-bold"
               placeholder="输入标题..."
               @input="$emit('update')">
      </div>

      <!-- 图片管理 -->
      <div class="editor-field">
        <div class="flex items-center justify-between mb-2">
          <label class="editor-label">
            <Icon name="image" :size="12" class="text-[var(--accent-gold)]"/>
            配图管理
          </label>
          <!-- 添加图片下拉菜单 -->
          <div class="relative group">
            <button :disabled="isAddingImage" class="ai-mini-btn">
              <Icon :name="isAddingImage ? 'loader-2' : 'plus'" :size="10" :class="{'animate-spin': isAddingImage}"/>
              添加图片
              <Icon name="chevron-down" :size="8"/>
            </button>
            <div class="absolute top-full right-0 mt-1 bg-black/95 border border-white/20 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[140px] z-50">
              <button @click="$emit('add-image', 'ai')"
                      :disabled="isAddingImage"
                      class="w-full px-3 py-2 hover:bg-white/10 flex items-center gap-2 border-b border-white/10 transition-colors text-left">
                <Icon name="sparkles" :size="12" class="text-[var(--accent-gold)]"/>
                <div class="flex-1">
                  <div class="text-white text-[10px] font-bold">AI 生成</div>
                </div>
              </button>
              <button @click="$emit('add-image', 'web')"
                      :disabled="isAddingImage"
                      class="w-full px-3 py-2 hover:bg-white/10 flex items-center gap-2 transition-colors text-left">
                <Icon name="search" :size="12" class="text-[var(--accent-cyan)]"/>
                <div class="flex-1">
                  <div class="text-white text-[10px] font-bold">网络搜图</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- 图片数量状态提示 -->
        <ImageStatusHint :status="imageCountStatus" />

        <!-- 图片列表 -->
        <div v-if="editData.images && editData.images.length > 0" class="space-y-2">
          <div v-for="(image, imgIndex) in editData.images" :key="imgIndex"
               class="image-item">
            <div class="image-preview">
              <img :src="'data:image/png;base64,' + image" class="w-full h-full object-cover">
            </div>
            <div class="image-actions">
              <button @click="$emit('remove-image', imgIndex)"
                      class="p-1 text-[#8a9a9a] hover:text-red-400 transition-colors">
                <Icon name="trash-2" :size="12"/>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-[#8a9a9a] text-[10px] text-center py-4 border border-dashed border-white/10 rounded">
          暂无配图
        </div>
      </div>

      <!-- 布局选择 -->
      <div class="editor-field">
        <div class="flex items-center justify-between mb-2">
          <label class="editor-label">布局类型</label>
          <button @click="$emit('generate-custom-layout')"
                  :disabled="isGeneratingLayout"
                  class="ai-mini-btn">
            <Icon :name="isGeneratingLayout ? 'loader-2' : 'wand-2'" :size="10" :class="{'animate-spin': isGeneratingLayout}"/>
            AI自定义排版
          </button>
        </div>
        <select v-model="editData.layout" class="magic-input w-full p-2 rounded text-xs" @change="$emit('update')">
          <option value="classic">经典布局</option>
          <option value="classic-vertical">垂直布局</option>
          <option value="classic-center">居中布局</option>
          <option value="big-data">大数据展示</option>
          <option value="timeline">时间线</option>
          <option value="comparison">对比</option>
          <option value="chart">图表</option>
          <option value="image-grid">多图网格</option>
          <option value="custom" v-if="customLayout">✨ {{ customLayout.layoutName || '自定义布局' }}</option>
        </select>

        <!-- 智能布局建议卡片 -->
        <LayoutAdviceCard
          :visible="showLayoutAdvice"
          :recommendation="layoutRecommendation"
          @apply="$emit('apply-layout-recommendation')"
          @dismiss="$emit('dismiss-layout-recommendation')"
        />

        <!-- AI自定义布局结果卡片 -->
        <Transition name="fade">
          <div v-if="customLayout" class="mt-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
            <div class="flex items-start gap-2 mb-2">
              <Icon name="wand-2" :size="16" class="text-purple-400 mt-0.5 shrink-0"/>
              <div class="flex-1">
                <div class="text-white text-xs font-bold mb-1">
                  AI创作：{{ customLayout.layoutName }}
                </div>
                <div class="text-[#8a9a9a] text-[10px] leading-relaxed mb-2">
                  {{ customLayout.description }}
                </div>
                <!-- 布局元素预览 -->
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-if="customLayout.elements.title" class="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[8px]">
                    标题
                  </span>
                  <span v-if="customLayout.elements.content" class="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[8px]">
                    内容
                  </span>
                  <span v-if="customLayout.elements.list" class="px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded text-[8px]">
                    列表
                  </span>
                  <span v-if="customLayout.elements.images && customLayout.elements.images.length > 0" class="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-[8px]">
                    {{ customLayout.elements.images.length }}张图片
                  </span>
                  <span v-if="customLayout.elements.decorations && customLayout.elements.decorations.length > 0" class="px-1.5 py-0.5 bg-pink-500/20 text-pink-300 rounded text-[8px]">
                    装饰元素
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 mt-2">
              <button @click="$emit('apply-custom-layout')"
                      class="flex-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-[10px] font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                <Icon name="check" :size="12"/>
                应用此排版
              </button>
              <button @click="$emit('dismiss-custom-layout')"
                      class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] transition-colors flex items-center justify-center gap-1">
                <Icon name="x" :size="12"/>
                忽略
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 高级设置 -->
      <div class="editor-field">
        <label class="editor-label mb-2">
          <Icon name="sliders" :size="12" class="text-[var(--accent-cyan)]"/>
          高级设置
        </label>

        <!-- 演讲备注 -->
        <div class="mb-3">
          <label class="text-[9px] text-[#8a9a9a] mb-1 block">演讲备注</label>
          <textarea v-model="editData.notes"
                    rows="3"
                    class="magic-input w-full p-2 rounded resize-none text-[10px]"
                    placeholder="添加演讲备注和提示..."
                    @input="$emit('update')"></textarea>
        </div>

        <!-- 背景透明度 -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-1">
            <label class="text-[9px] text-[#8a9a9a]">背景透明度</label>
            <span class="text-[9px] text-white">{{ editData.bgOpacity || 100 }}%</span>
          </div>
          <input type="range"
                 v-model="editData.bgOpacity"
                 min="0"
                 max="100"
                 class="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                 @input="$emit('update')">
        </div>

        <!-- 字体缩放 -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-1">
            <label class="text-[9px] text-[#8a9a9a]">字体缩放</label>
            <span class="text-[9px] text-white">{{ editData.fontScale || 100 }}%</span>
          </div>
          <input type="range"
                 v-model="editData.fontScale"
                 min="50"
                 max="150"
                 class="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                 @input="$emit('update')">
        </div>

        <!-- 内容对齐 -->
        <div class="mb-3">
          <label class="text-[9px] text-[#8a9a9a] mb-1 block">内容对齐</label>
          <div class="grid grid-cols-3 gap-1">
            <button @click="editData.textAlign = 'left'; $emit('update')"
                    :class="editData.textAlign === 'left' ? 'bg-[var(--accent-cyan)]/30 border-[var(--accent-cyan)]' : 'bg-white/5 border-white/10'"
                    class="px-2 py-1.5 border rounded text-[9px] text-white hover:bg-white/10 transition-colors">
              <Icon name="align-left" :size="12"/>
            </button>
            <button @click="editData.textAlign = 'center'; $emit('update')"
                    :class="editData.textAlign === 'center' ? 'bg-[var(--accent-cyan)]/30 border-[var(--accent-cyan)]' : 'bg-white/5 border-white/10'"
                    class="px-2 py-1.5 border rounded text-[9px] text-white hover:bg-white/10 transition-colors">
              <Icon name="align-center" :size="12"/>
            </button>
            <button @click="editData.textAlign = 'right'; $emit('update')"
                    :class="editData.textAlign === 'right' ? 'bg-[var(--accent-cyan)]/30 border-[var(--accent-cyan)]' : 'bg-white/5 border-white/10'"
                    class="px-2 py-1.5 border rounded text-[9px] text-white hover:bg-white/10 transition-colors">
              <Icon name="align-right" :size="12"/>
            </button>
          </div>
        </div>

        <!-- 动画效果 -->
        <div>
          <label class="text-[9px] text-[#8a9a9a] mb-1 block">入场动画</label>
          <select v-model="editData.animation"
                  class="magic-input w-full p-1.5 rounded text-[10px]"
                  @change="$emit('update')">
            <option value="none">无动画</option>
            <option value="fade">淡入</option>
            <option value="slide">滑入</option>
            <option value="zoom">缩放</option>
            <option value="bounce">弹跳</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'
import ImageStatusHint from './ImageStatusHint.vue'
import LayoutAdviceCard from './LayoutAdviceCard.vue'

defineProps({
  selectedIndex: Number,
  editData: Object,
  isRegenerating: Boolean,
  isAddingImage: Boolean,
  isGeneratingLayout: Boolean,
  imageCountStatus: Object,
  customLayout: Object,
  showLayoutAdvice: Boolean,
  layoutRecommendation: Object
})

defineEmits([
  'regenerate-content',
  'update',
  'add-image',
  'remove-image',
  'generate-custom-layout',
  'apply-layout-recommendation',
  'dismiss-layout-recommendation',
  'apply-custom-layout',
  'dismiss-custom-layout'
])
</script>

<style scoped>
/* 右侧编辑面板 */
.editor-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 28rem;
  background: var(--immersive-surface, rgba(0, 0, 0, 0.95));
  border-left: 1px solid var(--immersive-border, rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  z-index: 20;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 1rem;
  border-bottom: 1px solid var(--immersive-border, rgba(255, 255, 255, 0.1));
  background: var(--immersive-surface, rgba(0, 0, 0, 0.6));
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  scrollbar-width: thin;
}

.editor-content::-webkit-scrollbar {
  width: 6px;
}

.editor-content::-webkit-scrollbar-track {
  background: var(--immersive-surface, rgba(0, 0, 0, 0.3));
}

.editor-content::-webkit-scrollbar-thumb {
  background: var(--immersive-primary, rgba(111, 255, 233, 0.3));
  border-radius: 3px;
}

.editor-field {
  margin-bottom: 1rem;
}

.editor-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.625rem;
  text-transform: uppercase;
  color: var(--immersive-text-secondary, #8a9a9a);
  margin-bottom: 0.375rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* AI 重写按钮 */
.ai-mini-btn {
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(111, 255, 233, 0.3);
  border-radius: 0.25rem;
  color: var(--accent-cyan, #6fffe9);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;
  font-size: 0.5625rem;
  cursor: pointer;
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

/* 图片管理 */
.image-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--immersive-surface, rgba(0, 0, 0, 0.4));
  border: 1px solid var(--immersive-border, rgba(255, 255, 255, 0.1));
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.image-item:hover {
  border-color: var(--immersive-primary, rgba(111, 255, 233, 0.3));
  background: var(--immersive-surface, rgba(0, 0, 0, 0.6));
}

.image-preview {
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.image-actions {
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
}

/* 高级设置 - 滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-cyan, #6fffe9);
  cursor: pointer;
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 8px var(--accent-cyan, #6fffe9);
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-cyan, #6fffe9);
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 8px var(--accent-cyan, #6fffe9);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
