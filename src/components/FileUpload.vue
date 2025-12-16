<template>
  <div class="file-upload-container">
    <!-- 拖拽上传区域 -->
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      class="upload-zone"
      :class="{ 'dragging': isDragging, 'uploaded': uploadedFile }"
    >
      <!-- 未上传状态 -->
      <div v-if="!uploadedFile" class="upload-prompt">
        <Icon name="upload-cloud" :size="32" class="text-[var(--accent-cyan)] mb-3" />
        <p class="text-white text-sm mb-2">拖拽文件到此处，或点击上传</p>
        <p class="text-[#8a9a9a] text-xs mb-4">支持 .md / .txt / .docx 格式，最大 5MB</p>
        <input
          ref="fileInput"
          type="file"
          accept=".md,.markdown,.txt,.docx"
          @change="handleFileSelect"
          class="hidden"
        />
        <button @click="$refs.fileInput.click()" class="game-btn px-6 py-2 bg-[var(--accent-cyan)] text-[#0a1111] text-sm font-bold">
          选择文件
        </button>
      </div>

      <!-- 已上传状态 -->
      <div v-else class="uploaded-file">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <Icon name="file-text" :size="24" class="text-[var(--accent-gold)]" />
            <div>
              <div class="text-white text-sm font-bold">{{ uploadedFile.fileName }}</div>
              <div class="text-[#8a9a9a] text-xs">
                {{ uploadedFile.fileType.toUpperCase() }} • {{ uploadedFile.wordCount }} 字
              </div>
            </div>
          </div>
          <button @click="clearFile" class="text-[#8a9a9a] hover:text-red-400 transition-colors">
            <Icon name="x" :size="20" />
          </button>
        </div>

        <!-- 预览内容 -->
        <div v-if="uploadedFile.topic" class="content-preview mb-2">
          <div class="text-[var(--accent-gold)] text-xs font-bold mb-1">提取的主题：</div>
          <div class="text-white text-sm">{{ uploadedFile.topic }}</div>
        </div>
        <div v-if="uploadedFile.content" class="content-preview">
          <div class="text-[var(--accent-cyan)] text-xs font-bold mb-1">提取的内容：</div>
          <div class="text-[#8a9a9a] text-xs line-clamp-3">{{ uploadedFile.content }}</div>
        </div>

        <!-- 应用按钮 -->
        <div class="flex gap-2 mt-4">
          <button
            v-if="uploadedFile.topic"
            @click="applyTopic"
            class="flex-1 px-4 py-2 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 rounded text-xs font-bold transition-colors"
          >
            应用主题
          </button>
          <button
            v-if="uploadedFile.content"
            @click="applyContent"
            class="flex-1 px-4 py-2 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 rounded text-xs font-bold transition-colors"
          >
            应用内容
          </button>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs flex items-start gap-2">
      <Icon name="alert-circle" :size="16" class="shrink-0 mt-0.5" />
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'
import { parseDocument, validateFileSize, validateFileType } from '../utils/parseDocument'

const emit = defineEmits(['topic-extracted', 'content-extracted'])

// State
const isDragging = ref(false)
const uploadedFile = ref(null)
const error = ref('')
const fileInput = ref(null)

// 处理文件选择
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    await processFile(file)
  }
}

// 处理拖拽上传
const handleDrop = async (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    await processFile(file)
  }
}

// 处理文件
const processFile = async (file) => {
  error.value = ''

  // 验证文件类型
  if (!validateFileType(file)) {
    error.value = '不支持的文件格式，请上传 .md、.txt 或 .docx 文件'
    return
  }

  // 验证文件大小
  if (!validateFileSize(file, 5)) {
    error.value = '文件大小超过限制（最大 5MB）'
    return
  }

  try {
    // 解析文件
    const result = await parseDocument(file)
    uploadedFile.value = result

    // 如果没有提取到有效内容，显示警告
    if (!result.topic && !result.content) {
      error.value = '文件内容为空或无法解析'
    }
  } catch (err) {
    error.value = err.message || '文件解析失败，请检查文件格式'
    console.error('文件处理失败:', err)
  }
}

// 清除文件
const clearFile = () => {
  uploadedFile.value = null
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 应用主题
const applyTopic = () => {
  if (uploadedFile.value?.topic) {
    emit('topic-extracted', uploadedFile.value.topic)
  }
}

// 应用内容
const applyContent = () => {
  if (uploadedFile.value?.content) {
    emit('content-extracted', uploadedFile.value.content)
  }
}
</script>

<style scoped>
.upload-zone {
  border: 2px dashed rgba(111, 255, 233, 0.3);
  border-radius: 0.75rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-zone.dragging {
  border-color: var(--accent-cyan);
  background: rgba(111, 255, 233, 0.05);
  transform: scale(1.02);
}

.upload-zone.uploaded {
  border-color: rgba(212, 183, 120, 0.3);
  cursor: default;
}

.upload-prompt {
  text-align: center;
}

.uploaded-file {
  padding: 0.5rem;
}

.content-preview {
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.error-message {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
