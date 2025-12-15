/**
 * 幻境 PPT 助手 - 主入口文件
 * 整合所有模块，创建 Vue 应用实例
 */

// 导入配置和组件
import { PPT_THEMES, getTheme } from './config/themes.js';
import { IconComponent } from './components/Icon.js';

// 导入生成器
import { generateOutline } from './generators/outline.js';
import { generateAllSlides, generateSlideContent } from './generators/content.js';
import { generateSlideImage, suggestLayoutWithImage } from './generators/image.js';

// 导入导出器
import { exportToPPTX } from './exporters/pptx.js';

// 导入工具
import { loadConfig, saveConfig } from './utils/storage.js';
import { initParticles } from './utils/particle.js';

// 导入 Composables
import { useSteps } from './composables/useSteps.js';
import { useSlides } from './composables/useSlides.js';
import { useModal } from './composables/useModal.js';

// 解构 Vue API
const { createApp, ref, reactive, computed, watch, onMounted } = Vue;

// 创建 Vue 应用
createApp({
    components: {
        'v-icon': IconComponent
    },

    setup() {
        // ========== 状态管理 ==========

        // 基础状态
        const loading = ref(false);
        const progressWidth = ref(0);
        const generationLog = ref("Waiting...");
        const error = ref('');
        const topic = ref('');
        const additionalInfo = ref('');

        // UI 状态
        const uiState = reactive({
            showApi: false,
            modalImg: null,
            isEditing: false,
            editingIndex: -1,
            selectedSlideIndex: -1,  // 当前选中的幻灯片索引 (-1 表示封面)
            isLaunchingGeneration: false  // 是否正在启动生成仪式
        });

        // 配置状态
        const config = reactive({
            baseUrl: 'https://api.openai.com/v1',
            apiKey: '',
            textModel: 'gpt-5.2',
            imageModel: 'dall-e-3'
        });

        const pptConfig = reactive({
            pageCount: 8,
            templateBg: null,
            themeColor: '#d4b778'
        });

        // 视觉效果配置
        const visualConfig = reactive({
            enableAnimations: true  // 手动控制动画开关
        });

        // 生成控制器（用于取消请求）
        let generationAbortController = null;

        // 编辑表单状态
        const editForm = reactive({
            layout: 'classic',
            title: '',
            content: '',
            pointsStr: '',
            dataValue: '',
            dataLabel: '',
            leftTitle: '',
            rightTitle: '',
            customPrompt: ''
        });

        // 主题相关
        const currentPptStyleKey = ref('business');
        const currentPptStyle = computed(() => getTheme(currentPptStyleKey.value));

        // 当前选中的幻灯片（用于大预览）
        const currentSlide = computed(() => {
            if (uiState.selectedSlideIndex === -1) {
                // 封面
                return {
                    title: topic.value,
                    date: new Date().toLocaleDateString(),
                    isCover: true
                };
            } else {
                // 内容页
                return {
                    ...slides.value[uiState.selectedSlideIndex],
                    isCover: false
                };
            }
        });

        // ========== 使用 Composables ==========

        const { step, nextStep, prevStep, goToStep } = useSteps();

        const { outline, slides, addSlide, removeSlide, regenerateSlide } = useSlides(topic, config);

        const {
            modalImg,
            isEditing,
            editingIndex,
            editForm: modalEditForm,
            openImageModal,
            closeImageModal,
            openEditModal: openEditModalBase,
            closeEditModal,
            saveEdit: saveEditBase
        } = useModal();

        // ========== 生命周期 ==========

        onMounted(() => {
            // 初始化粒子背景
            initParticles();

            // 加载保存的配置
            const savedConfig = loadConfig();
            if (savedConfig) {
                Object.assign(config, savedConfig);
            }

            // 移除加载遮罩
            const loadingEl = document.getElementById('app-loading');
            if (loadingEl) {
                loadingEl.style.opacity = '0';
                loadingEl.style.transition = 'opacity 0.3s';
                setTimeout(() => loadingEl.remove(), 300);
            }
        });

        // 监听配置变化并保存
        watch(config, (newConfig) => {
            saveConfig(newConfig);
        }, { deep: true });

        // 监听步骤变化，触发酷炫视差效果
        watch(step, (newStep, oldStep) => {
            if (!visualConfig.enableAnimations) return; // 如果动画禁用，不触发视差

            const canvas = document.getElementById('particle-canvas');
            const accentLines = document.querySelectorAll('.parallax-accent-line');
            const launchGlow = document.getElementById('launch-glow');

            // 判断前进还是后退
            const isForward = newStep > oldStep;
            const direction = isForward ? 1 : -1;

            // 更夸张的移动距离
            const canvasOffset = 50 * direction;      // 背景层：50px
            const linesOffset = 150 * direction;      // 装饰层：150px
            const glowOffset = 80 * direction;        // 光晕层：80px

            // 重置所有元素
            if (canvas) canvas.style.transform = '';
            accentLines.forEach(line => line.style.transform = '');
            if (launchGlow) launchGlow.style.transform = '';

            // 触发粒子爆发效果
            if (canvas) {
                canvas.classList.add('parallax-burst');
                setTimeout(() => canvas.classList.remove('parallax-burst'), 600);
            }

            // 触发波纹效果
            if (launchGlow) {
                launchGlow.classList.add('parallax-ripple');
                setTimeout(() => launchGlow.classList.remove('parallax-ripple'), 1000);
            }

            // 延迟10ms后触发视差动画
            setTimeout(() => {
                // 背景粒子层 - 慢速平滑移动
                if (canvas) {
                    canvas.style.transition = 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
                    canvas.style.transform = `translateX(${canvasOffset}px) scale(1.05)`;
                }

                // 光晕层 - 中速弹性移动
                if (launchGlow) {
                    launchGlow.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    launchGlow.style.transform = `translateX(${glowOffset}px)`;
                }

                // 装饰线条层 - 快速弹性移动 + 旋转
                accentLines.forEach((line, index) => {
                    line.style.transition = 'all 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    const rotation = (index % 2 === 0 ? 2 : -2) * direction;
                    line.style.transform = `translateX(${linesOffset}px) rotate(${rotation}deg) scaleX(1.2)`;
                });

                // 动画完成后恢复
                setTimeout(() => {
                    if (canvas) canvas.style.transform = '';
                    if (launchGlow) launchGlow.style.transform = '';
                    accentLines.forEach(line => line.style.transform = '');
                }, 1200);
            }, 10);
        });

        // ========== 业务逻辑函数 ==========

        /**
         * 生成 PPT 大纲
         */
        const handleGenerateOutline = async () => {
            if (!topic.value.trim()) {
                alert('请输入主题');
                return;
            }

            if (!config.apiKey) {
                alert('请先配置 API Key');
                goToStep(1);
                return;
            }

            loading.value = true;
            error.value = '';

            try {
                outline.value = await generateOutline(
                    topic.value,
                    additionalInfo.value,
                    config,
                    pptConfig.pageCount
                );
                goToStep(3); // 跳转到大纲确认页
            } catch (e) {
                error.value = e.message;
                alert('生成大纲失败: ' + e.message);
            } finally {
                loading.value = false;
            }
        };

        /**
         * 开始生成完整 PPT 内容 (逐页生成)
         */
        const handleStartGeneration = async () => {
            // 创建新的 AbortController
            generationAbortController = new AbortController();

            // 标记启动仪式开始
            uiState.isLaunchingGeneration = true;

            // 触发粒子爆发效果
            const canvas = document.getElementById('particle-canvas');
            if (canvas) {
                canvas.classList.add('launch-particle-burst');
                setTimeout(() => canvas.classList.remove('launch-particle-burst'), 800);
            }

            // 触发光晕效果
            const glow = document.getElementById('launch-glow');
            if (glow) {
                glow.classList.add('active');
                setTimeout(() => glow.classList.remove('active'), 1200);
            }

            // 延迟跳转，让启动动画完整播放
            await new Promise(resolve => setTimeout(resolve, 400));

            goToStep(5); // 跳转到结果页

            // 默认选中封面
            uiState.selectedSlideIndex = -1;

            // 重置启动标志
            setTimeout(() => {
                uiState.isLaunchingGeneration = false;
            }, 1200);

            // 初始化幻灯片数组，显示占位状态
            slides.value = outline.value.map(o => ({
                title: o.title,
                content: '等待生成...',
                layout: 'classic',
                items: [],
                imgLoading: false,
                isRegenerating: false,
                isGenerating: true // 新增生成中标志
            }));

            // 逐页生成内容
            for (let i = 0; i < outline.value.length; i++) {
                // 检查是否被取消
                if (generationAbortController.signal.aborted) {
                    console.log('生成已被取消');
                    break;
                }

                try {
                    // 标记当前页为生成中
                    slides.value[i].content = '正在具象化...';
                    slides.value[i].isGenerating = true;

                    // 生成单页内容（传入 signal）
                    const slideData = await generateSlideContent(
                        topic.value,
                        outline.value[i],
                        config,
                        generationAbortController.signal
                    );

                    // 立即更新该页数据
                    Object.assign(slides.value[i], {
                        ...slideData,
                        title: outline.value[i].title,
                        imgLoading: false,
                        isRegenerating: false,
                        isGenerating: false
                    });

                    console.log(`✓ 第 ${i + 1}/${outline.value.length} 页生成完成`);

                } catch (e) {
                    // 如果是取消错误，不显示失败信息
                    if (e.name === 'AbortError') {
                        console.log(`第 ${i + 1} 页生成被取消`);
                        slides.value[i].content = '生成已取消';
                        slides.value[i].isGenerating = false;
                        break;
                    }

                    console.error(`第 ${i + 1} 页生成失败:`, e);

                    // 标记该页生成失败
                    Object.assign(slides.value[i], {
                        layout: "classic",
                        content: `生成失败: ${e.message}`,
                        items: ["点击上方【重新生成】按钮重试"],
                        imgLoading: false,
                        isRegenerating: false,
                        isGenerating: false
                    });
                }

                // 短暂延迟，避免 API 频率限制
                if (i < outline.value.length - 1 && !generationAbortController.signal.aborted) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            console.log('✓ 所有幻灯片生成完成（或已取消）');
            generationAbortController = null; // 清理控制器
        };

        /**
         * 为单页生成 AI 配图（两步法：先生成提示词，再生成图片）
         */
        const handleGenerateImage = async (index) => {
            const slide = slides.value[index];
            slide.imgLoading = true;

            try {
                // 准备幻灯片内容（用于生成更准确的提示词）
                const contentForPrompt = `${slide.content || ''}\n${(slide.items || []).join('\n')}`.substring(0, 500);

                // Step 1 & 2: 生成提示词并生成图片
                slide.imgData = await generateSlideImage(
                    slide.title,
                    contentForPrompt,
                    currentPptStyle.value,
                    config
                );

                // Step 3: 智能调整布局
                const suggestedLayout = suggestLayoutWithImage(
                    slide.content,
                    slide.items,
                    slide.layout
                );

                // 如果建议的布局不同，更新布局
                if (suggestedLayout !== slide.layout) {
                    console.log(`智能排版：${slide.layout} → ${suggestedLayout}`);
                    slide.layout = suggestedLayout;
                }

                console.log(`✓ 图片生成成功，布局：${slide.layout}`);

            } catch (e) {
                alert('图片生成失败: ' + e.message);
                console.error('图片生成错误:', e);
            } finally {
                slide.imgLoading = false;
            }
        };

        /**
         * 使用自定义提示词重新生成幻灯片
         */
        const regenerateSlideWithPrompt = async (index) => {
            if (index < 0 || index >= slides.value.length) return;

            const slide = slides.value[index];
            slide.isRegenerating = true;

            try {
                // 获取原始大纲
                const originalOutline = outline.value[index];

                // 构建增强的大纲对象
                const enhancedOutline = {
                    title: originalOutline.title,
                    desc: editForm.customPrompt.trim()
                        ? `${originalOutline.desc}。额外要求: ${editForm.customPrompt}`
                        : originalOutline.desc
                };

                // 生成新内容
                const newContent = await generateSlideContent(
                    topic.value,
                    enhancedOutline,
                    config
                );

                // 更新幻灯片数据
                Object.assign(slide, {
                    ...newContent,
                    title: slide.title, // 保持原标题
                    isRegenerating: false
                });

                // 同步更新编辑表单
                Object.assign(editForm, {
                    layout: newContent.layout || 'classic',
                    content: newContent.content,
                    pointsStr: (newContent.items || []).join('\n'),
                    dataValue: newContent.dataValue || '',
                    dataLabel: newContent.dataLabel || '',
                    leftTitle: newContent.leftTitle || '方案 A',
                    rightTitle: newContent.rightTitle || '方案 B',
                    customPrompt: ''
                });

            } catch (e) {
                alert('AI 重新生成失败: ' + e.message);
                slide.isRegenerating = false;
            }
        };

        /**
         * 导出 PPTX 文件
         */
        const handleExport = () => {
            try {
                exportToPPTX(
                    topic.value,
                    slides.value,
                    currentPptStyle.value,
                    currentPptStyleKey.value,
                    pptConfig
                );
            } catch (e) {
                alert('导出失败: ' + e.message);
            }
        };

        /**
         * 获取预览样式
         */
        const getPptPreviewStyle = () => {
            const s = currentPptStyle.value;
            if (pptConfig.templateBg) {
                return {
                    backgroundImage: `url(${pptConfig.templateBg})`,
                    backgroundSize: 'cover'
                };
            }
            return { backgroundColor: s.colors.bg };
        };

        // ========== UI 交互函数 ==========

        /**
         * 选择 PPT 风格
         */
        const selectPptStyle = (key) => {
            currentPptStyleKey.value = key;
        };

        /**
         * 处理背景上传
         */
        const handleBgUpload = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                pptConfig.templateBg = ev.target.result;
            };
            reader.readAsDataURL(file);
        };

        /**
         * 打开编辑模态框
         */
        const openEditModalHandler = (idx) => {
            uiState.editingIndex = idx;
            const s = slides.value[idx];

            // 更新编辑表单
            Object.assign(editForm, {
                layout: s.layout || 'classic',
                title: s.title,
                content: s.content,
                pointsStr: (s.items || []).join('\n'),
                dataValue: s.dataValue || '',
                dataLabel: s.dataLabel || '',
                leftTitle: s.leftTitle || '方案 A',
                rightTitle: s.rightTitle || '方案 B',
                customPrompt: ''
            });

            uiState.isEditing = true;
        };

        /**
         * 关闭编辑模态框
         */
        const closeEditModalHandler = () => {
            uiState.isEditing = false;
        };

        /**
         * 保存编辑内容
         */
        const saveEditHandler = () => {
            const s = slides.value[uiState.editingIndex];

            Object.assign(s, {
                layout: editForm.layout,
                title: editForm.title,
                content: editForm.content,
                items: editForm.pointsStr.split('\n').filter(x => x.trim()),
                dataValue: editForm.dataValue,
                dataLabel: editForm.dataLabel,
                leftTitle: editForm.leftTitle,
                rightTitle: editForm.rightTitle
            });

            closeEditModalHandler();
        };

        /**
         * 打开图片预览模态框
         */
        const openModal = (img) => {
            uiState.modalImg = img;
        };

        /**
         * 选择幻灯片进行预览
         */
        const selectSlide = (index) => {
            uiState.selectedSlideIndex = index;
        };

        /**
         * 取消生成
         */
        const cancelGeneration = () => {
            if (generationAbortController) {
                generationAbortController.abort();
                console.log('已请求取消生成');
            }
        };

        /**
         * 返回调整风格（并取消生成）
         */
        const goBackToStyleSelection = () => {
            cancelGeneration(); // 取消正在进行的生成
            goToStep(4); // 返回到风格选择页
        };

        // ========== 返回所有需要在模板中使用的内容 ==========

        return {
            // 状态
            step,
            loading,
            progressWidth,
            generationLog,
            error,
            topic,
            additionalInfo,
            outline,
            slides,
            config,
            pptConfig,
            visualConfig,
            uiState,
            editForm,

            // 主题相关
            PPT_THEMES,
            currentPptStyleKey,
            currentPptStyle,
            currentSlide,

            // 步骤导航
            nextStep,
            prevStep,

            // 幻灯片操作
            addSlide,
            removeSlide,
            regenerateSlide,

            // 业务逻辑
            generateOutline: handleGenerateOutline,
            startFullGeneration: handleStartGeneration,
            generateImage: handleGenerateImage,
            regenerateSlideWithPrompt,
            exportPPT: handleExport,

            // UI 交互
            selectPptStyle,
            handleBgUpload,
            openModal,
            selectSlide,
            cancelGeneration,
            goBackToStyleSelection,
            openEditModal: openEditModalHandler,
            closeEditModal: closeEditModalHandler,
            saveEdit: saveEditHandler,
            getPptPreviewStyle
        };
    }
}).mount('#app');
