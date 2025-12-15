/**
 * 模态框管理 Composable
 */

export function useModal() {
    const { ref, reactive } = Vue;

    // 图片预览模态框
    const modalImg = ref(null);

    // 编辑模态框
    const isEditing = ref(false);
    const editingIndex = ref(-1);
    const editForm = reactive({
        title: '',
        content: '',
        items: []
    });

    /**
     * 打开图片预览模态框
     */
    const openImageModal = (imgData) => {
        modalImg.value = imgData;
    };

    /**
     * 关闭图片预览模态框
     */
    const closeImageModal = () => {
        modalImg.value = null;
    };

    /**
     * 打开编辑模态框
     */
    const openEditModal = (index, slide) => {
        editingIndex.value = index;
        editForm.title = slide.title;
        editForm.content = slide.content;
        editForm.items = [...(slide.items || [])];
        isEditing.value = true;
    };

    /**
     * 关闭编辑模态框
     */
    const closeEditModal = () => {
        isEditing.value = false;
        editingIndex.value = -1;
        editForm.title = '';
        editForm.content = '';
        editForm.items = [];
    };

    /**
     * 保存编辑内容
     */
    const saveEdit = (slides) => {
        if (editingIndex.value >= 0 && slides.value[editingIndex.value]) {
            slides.value[editingIndex.value].title = editForm.title;
            slides.value[editingIndex.value].content = editForm.content;
            slides.value[editingIndex.value].items = [...editForm.items];
        }
        closeEditModal();
    };

    return {
        modalImg,
        isEditing,
        editingIndex,
        editForm,
        openImageModal,
        closeImageModal,
        openEditModal,
        closeEditModal,
        saveEdit
    };
}
