/**
 * 幻灯片拖拽排序组合式函数
 * 处理幻灯片的拖放排序功能
 */

import { ref } from 'vue'

export function useSlideDragDrop(emit) {
  const draggingSlideIndex = ref(null)
  const dropTargetIndex = ref(null)

  /**
   * 开始拖拽
   */
  function handleSlideDragStart(index, event) {
    draggingSlideIndex.value = index
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', index.toString())
  }

  /**
   * 拖拽经过
   */
  function handleSlideDragOver(index, event) {
    event.preventDefault()
    dropTargetIndex.value = index
  }

  /**
   * 放置
   */
  function handleSlideDrop(toIndex, event, slides) {
    event.preventDefault()
    const fromIndex = draggingSlideIndex.value

    if (fromIndex !== null && fromIndex !== toIndex) {
      // 通知父组件重新排序幻灯片
      const newSlides = [...slides]
      const [movedSlide] = newSlides.splice(fromIndex, 1)
      newSlides.splice(toIndex, 0, movedSlide)

      // 发送事件让父组件更新所有幻灯片
      emit('reorder-slides', newSlides)

      // 返回新的选中索引
      return {
        fromIndex,
        toIndex,
        newSlides
      }
    }

    draggingSlideIndex.value = null
    dropTargetIndex.value = null
    return null
  }

  /**
   * 结束拖拽
   */
  function handleSlideDragEnd() {
    draggingSlideIndex.value = null
    dropTargetIndex.value = null
  }

  return {
    draggingSlideIndex,
    dropTargetIndex,
    handleSlideDragStart,
    handleSlideDragOver,
    handleSlideDrop,
    handleSlideDragEnd
  }
}
