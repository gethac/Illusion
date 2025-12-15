/**
 * Lucide Icon 组件
 * 动态渲染 Lucide 图标
 */

export const IconComponent = {
    props: ['name', 'size'],
    setup(props) {
        const { ref, onMounted, watch } = Vue;

        const container = ref(null);

        const updateIcon = () => {
            if (!container.value) return;

            // 清空容器
            container.value.innerHTML = '';

            // 创建图标元素
            const i = document.createElement('i');
            i.setAttribute('data-lucide', props.name);

            if (props.size) {
                i.setAttribute('width', props.size);
                i.setAttribute('height', props.size);
            }

            container.value.appendChild(i);

            // 使用 Lucide 渲染图标
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons({ root: container.value });
            }
        };

        onMounted(updateIcon);
        watch(() => [props.name, props.size], updateIcon);

        return { container };
    },
    template: `<span ref="container" style="display:inline-flex; vertical-align: middle;"></span>`
};
