import { ref } from 'vue'

const notifications = ref([])
let notificationId = 0

export function useNotification() {
  const notify = (message, type = 'info', duration = 4000) => {
    const id = ++notificationId
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      visible: true
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value[index].visible = false
      setTimeout(() => {
        notifications.value.splice(index, 1)
      }, 300) // 等待动画完成
    }
  }

  const success = (message, duration) => notify(message, 'success', duration)
  const error = (message, duration = 6000) => notify(message, 'error', duration)
  const warning = (message, duration = 5000) => notify(message, 'warning', duration)
  const info = (message, duration) => notify(message, 'info', duration)

  return {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    removeNotification
  }
}
