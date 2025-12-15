/**
 * 幻灯片状态管理 Composable
 */

import { generateSlideContent } from '../generators/content.js';

export function useSlides(topic, config) {
    const { ref } = Vue;

    const outline = ref([]);
    const slides = ref([]);

    /**
     * 添加新的幻灯片节点
     */
    const addSlide = () => {
        outline.value.push({
            title: '新节点',
            desc: '内容描述...'
        });
    };

    /**
     * 删除幻灯片节点
     */
    const removeSlide = (index) => {
        if (outline.value.length > 1) {
            outline.value.splice(index, 1);
        }
    };

    /**
     * 重新生成单页幻灯片内容
     */
    const regenerateSlide = async (index) => {
        const slide = slides.value[index];
        slide.isRegenerating = true;

        try {
            const newContent = await generateSlideContent(
                topic.value,
                outline.value[index],
                config
            );

            // 更新幻灯片内容
            Object.assign(slide, newContent);
        } catch (e) {
            console.error('Failed to regenerate slide:', e);
            alert('重写失败: ' + e.message);
        } finally {
            slide.isRegenerating = false;
        }
    };

    return {
        outline,
        slides,
        addSlide,
        removeSlide,
        regenerateSlide
    };
}
