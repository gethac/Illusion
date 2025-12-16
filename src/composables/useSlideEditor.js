/**
 * 幻灯片编辑器组合式函数
 * 处理幻灯片内容的行内编辑功能
 */

export function useSlideEditor(emit) {
  /**
   * 编辑标题
   */
  function onTitleEdit(event, slideIndex, currentSlide) {
    const newTitle = event.target.innerText.trim()
    if (!newTitle || slideIndex < 0) return

    emit('update-slide', slideIndex, {
      ...currentSlide,
      title: newTitle
    })

    return newTitle
  }

  /**
   * 编辑内容
   */
  function onContentEdit(event, slideIndex, currentSlide) {
    const newContent = event.target.innerText.trim()
    if (!newContent || slideIndex < 0) return

    emit('update-slide', slideIndex, {
      ...currentSlide,
      content: newContent
    })

    return newContent
  }

  /**
   * 编辑列表项
   */
  function onItemEdit(event, itemIndex, slideIndex, currentSlide) {
    const newItem = event.target.innerText.trim()
    if (!newItem || slideIndex < 0) return

    const updatedItems = [...currentSlide.items]
    updatedItems[itemIndex] = newItem

    emit('update-slide', slideIndex, {
      ...currentSlide,
      items: updatedItems
    })

    return updatedItems
  }

  /**
   * 编辑大数据值
   */
  function onDataValueEdit(event, slideIndex, currentSlide) {
    const newValue = event.target.innerText.trim()
    if (!newValue || slideIndex < 0) return

    emit('update-slide', slideIndex, {
      ...currentSlide,
      dataValue: newValue
    })

    return newValue
  }

  /**
   * 编辑大数据标签
   */
  function onDataLabelEdit(event, slideIndex, currentSlide) {
    const newLabel = event.target.innerText.trim()
    if (!newLabel || slideIndex < 0) return

    emit('update-slide', slideIndex, {
      ...currentSlide,
      dataLabel: newLabel
    })

    return newLabel
  }

  return {
    onTitleEdit,
    onContentEdit,
    onItemEdit,
    onDataValueEdit,
    onDataLabelEdit
  }
}
