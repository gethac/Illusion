<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`, { 'notification-hidden': !notification.visible }]"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-icon">
          <Icon v-if="notification.type === 'success'" name="check-circle" :size="20"/>
          <Icon v-else-if="notification.type === 'error'" name="x-circle" :size="20"/>
          <Icon v-else-if="notification.type === 'warning'" name="alert-triangle" :size="20"/>
          <Icon v-else name="info" :size="20"/>
        </div>
        <div class="notification-message">{{ notification.message }}</div>
        <button class="notification-close" @click.stop="removeNotification(notification.id)">
          <Icon name="x" :size="16"/>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotification } from '../composables/useNotification'
import Icon from './Icon.vue'

const { notifications, removeNotification } = useNotification()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.notification {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 320px;
  max-width: 480px;
  padding: 1rem 1.25rem;
  background: rgba(0, 0, 0, 0.95);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification:hover {
  transform: translateX(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.notification-icon {
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #fff;
  word-break: break-word;
}

.notification-close {
  flex-shrink: 0;
  padding: 0.25rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* 类型样式 */
.notification-success {
  border-left: 3px solid #6fffe9;
}

.notification-success .notification-icon {
  color: #6fffe9;
}

.notification-error {
  border-left: 3px solid #ff6b6b;
}

.notification-error .notification-icon {
  color: #ff6b6b;
}

.notification-warning {
  border-left: 3px solid #ffd93d;
}

.notification-warning .notification-icon {
  color: #ffd93d;
}

.notification-info {
  border-left: 3px solid #d4b778;
}

.notification-info .notification-icon {
  color: #d4b778;
}

/* 过渡动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 隐藏状态 */
.notification-hidden {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .notification-container {
    left: 1rem;
    right: 1rem;
  }

  .notification {
    min-width: auto;
    max-width: none;
  }
}
</style>
