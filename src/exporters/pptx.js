/**
 * PPT 导出引擎模块
 * 使用 PptxGenJS 生成 PowerPoint 文件
 */

import { cleanHex } from '../utils/helpers.js';

/**
 * 导出 PPTX 文件
 * @param {string} topic - PPT 主题
 * @param {Array} slides - 幻灯片数据数组
 * @param {Object} theme - 当前主题配置
 * @param {string} themeKey - 主题 key
 * @param {Object} pptConfig - PPT 配置 { templateBg, themeColor }（可选）
 */
export function exportToPPTX(topic, slides, theme, themeKey, pptConfig = {}) {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';

    // 安全检查
    if (!theme || !theme.colors) {
        alert("主题数据错误，请重试");
        return;
    }

    // 颜色配置
    const bgCol = pptConfig.templateBg ? null : (theme.pptBg || 'FFFFFF');
    const textCol = cleanHex(theme.colors.text);
    const accentCol = cleanHex(theme.colors.accent);
    const fontFace = theme.pptFont || 'Arial';

    // 定义母版
    setupMasterSlide(pptx, theme, themeKey, pptConfig, bgCol, accentCol);

    // 添加封面
    addCoverSlide(pptx, topic, theme, pptConfig, bgCol, textCol, accentCol, fontFace);

    // 添加内容页
    slides.forEach((slideData, index) => {
        addContentSlide(pptx, slideData, textCol, accentCol, fontFace, index + 1, slides.length);
    });

    // 导出文件
    pptx.writeFile({ fileName: `${themeKey || topic || 'Presentation'}.pptx` });
}

/**
 * 设置母版幻灯片
 */
function setupMasterSlide(pptx, theme, themeKey, pptConfig, bgCol, accentCol) {
    const masterOpts = { title: "MASTER" };

    // 背景设置
    if (pptConfig.templateBg) {
        masterOpts.background = { data: pptConfig.templateBg };
    } else {
        masterOpts.background = { color: bgCol };
    }

    // 根据不同风格添加装饰元素
    masterOpts.objects = getThemeDecorations(themeKey, accentCol);

    pptx.defineSlideMaster(masterOpts);
}

/**
 * 获取主题装饰元素
 */
function getThemeDecorations(themeKey, accentCol) {
    const decorations = {
        'cyberpunk': [
            { rect: { x: 0, y: 0, w: "100%", h: 0.1, fill: { color: accentCol } } },
            { rect: { x: 0, y: 0, w: 0.1, h: "100%", fill: { color: accentCol } } }
        ],
        'business': [
            { rect: { x: 0, y: 5.4, w: "100%", h: 0.225, fill: { color: accentCol } } }
        ],
        'tech': [
            { rect: { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: accentCol } } },
            { rect: { x: 0, y: 5.58, w: "100%", h: 0.08, fill: { color: accentCol } } }
        ],
        'academic': [
            { rect: { x: 0, y: 5.4, w: "100%", h: 0.25, fill: { color: accentCol } } }
        ],
        'nature': [
            { rect: { x: 0, y: 0, w: 0.15, h: "100%", fill: { color: accentCol } } },
            { rect: { x: 0.15, y: 0, w: 0.05, h: "100%", fill: { color: "81c784" }, transparency: 50 } }
        ],
        'vintage': [
            { rect: { x: 0.2, y: 0.2, w: 9.6, h: 0.05, fill: { color: accentCol } } },
            { rect: { x: 0.2, y: 5.4, w: 9.6, h: 0.05, fill: { color: accentCol } } },
            { rect: { x: 0.2, y: 0.2, w: 0.05, h: 5.25, fill: { color: accentCol } } },
            { rect: { x: 9.75, y: 0.2, w: 0.05, h: 5.25, fill: { color: accentCol } } }
        ],
        'gradient': [
            { rect: { x: 0, y: 0, w: 0.3, h: 0.3, fill: { color: accentCol } } },
            { rect: { x: 0.3, y: 0, w: 0.15, h: 0.15, fill: { color: "80d0c7" } } }
        ],
        'corporate': [
            { rect: { x: 0, y: 0, w: 0.12, h: "100%", fill: { color: accentCol } } },
            { rect: { x: 0, y: 5.45, w: "100%", h: 0.2, fill: { color: accentCol }, transparency: 30 } }
        ]
    };

    return decorations[themeKey] || [];
}

/**
 * 添加封面幻灯片
 */
function addCoverSlide(pptx, topic, theme, pptConfig, bgCol, textCol, accentCol, fontFace) {
    const cover = pptx.addSlide();

    // 背景
    if (pptConfig.templateBg) {
        cover.background = { data: pptConfig.templateBg };
    } else {
        cover.background = { color: bgCol };
    }

    // 顶部装饰线
    cover.addShape('rect', {
        x: 0,
        y: 0,
        w: '100%',
        h: 0.08,
        fill: { color: accentCol }
    });

    // 副标题装饰
    cover.addText("PRESENTATION", {
        x: 0.5,
        y: 1.5,
        w: 9,
        fontSize: 16,
        color: accentCol,
        align: "center",
        fontFace,
        bold: true,
        charSpacing: 3
    });

    // 主标题
    cover.addText(topic, {
        x: 0.5,
        y: 2.2,
        w: 9,
        h: 1.5,
        fontSize: 48,
        bold: true,
        color: textCol,
        align: "center",
        fontFace,
        valign: "middle"
    });

    // 装饰分隔线
    cover.addShape('rect', {
        x: 4.5,
        y: 3.9,
        w: 1,
        h: 0.03,
        fill: { color: accentCol }
    });

    // 日期
    cover.addText(new Date().toLocaleDateString(), {
        x: 0.5,
        y: 4.3,
        w: 9,
        fontSize: 16,
        color: textCol,
        align: "center",
        fontFace,
        transparency: 50
    });

    // 底部装饰线
    cover.addShape('rect', {
        x: 0,
        y: 5.58,
        w: '100%',
        h: 0.08,
        fill: { color: accentCol }
    });
}

/**
 * 添加内容幻灯片
 */
function addContentSlide(pptx, slideData, textCol, accentCol, fontFace, pageNum, totalPages) {
    const slide = pptx.addSlide({ masterName: "MASTER" });

    // 标题
    slide.addText(slideData.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.6,
        fontSize: 28,
        bold: true,
        color: textCol,
        fontFace,
        valign: "middle"
    });

    // 标题下方装饰线
    slide.addShape('rect', {
        x: 0.5,
        y: 0.95,
        w: 1.5,
        h: 0.02,
        fill: { color: accentCol }
    });

    // 根据布局类型渲染内容
    switch(slideData.layout) {
        case 'big-data':
            addBigDataLayout(slide, slideData, textCol, accentCol, fontFace);
            break;
        case 'timeline':
            addTimelineLayout(slide, slideData, textCol, accentCol, fontFace);
            break;
        case 'comparison':
            addComparisonLayout(slide, slideData, textCol, accentCol, fontFace);
            break;
        case 'image-grid':
            addImageGridLayout(slide, slideData, textCol, accentCol, fontFace);
            break;
        case 'chart':
            addChartLayout(slide, slideData, textCol, accentCol, fontFace);
            break;
        default:
            addClassicLayout(slide, slideData, textCol, accentCol, fontFace);
    }

    // 页码
    slide.addText(`${pageNum} / ${totalPages}`, {
        x: 9.2,
        y: 5.3,
        w: 0.5,
        fontSize: 10,
        color: textCol,
        align: 'right',
        fontFace,
        transparency: 50
    });
}

/**
 * 大数据布局
 */
function addBigDataLayout(slide, slideData, textCol, accentCol, fontFace) {
    // 大数字
    slide.addText(slideData.dataValue || '89%', {
        x: 0,
        y: 1.8,
        w: '100%',
        align: 'center',
        fontSize: 80,
        bold: true,
        color: accentCol,
        fontFace
    });

    // 数据标签
    slide.addText(slideData.dataLabel || slideData.title, {
        x: 0,
        y: 3.2,
        w: '100%',
        align: 'center',
        fontSize: 20,
        color: textCol,
        fontFace,
        bold: true
    });

    // 装饰线
    slide.addShape('rect', {
        x: 4.5,
        y: 3.7,
        w: 1,
        h: 0.02,
        fill: { color: accentCol }
    });

    // 描述文本
    if (slideData.content) {
        slide.addText(slideData.content, {
            x: 1.5,
            y: 3.9,
            w: 7,
            align: 'center',
            fontSize: 14,
            color: textCol,
            fontFace
        });
    }
}

/**
 * 经典布局（文本 + 列表 + 图片）
 */
function addClassicLayout(slide, slideData, textCol, accentCol, fontFace) {
    const hasImage = slideData.imgData;
    const textW = hasImage ? 5.2 : 9;

    // 主要内容
    if (slideData.content) {
        slide.addText(slideData.content, {
            x: 0.5,
            y: 1.3,
            w: textW,
            h: 1.2,
            fontSize: 14,
            color: textCol,
            fontFace,
            align: 'justify',
            lineSpacing: 16
        });
    }

    // 项目列表
    if (slideData.items && slideData.items.length) {
        const startY = slideData.content ? 2.7 : 1.3;

        slideData.items.forEach((item, idx) => {
            slide.addText(item, {
                x: 0.5,
                y: startY + (idx * 0.55),
                w: textW,
                fontSize: 13,
                color: textCol,
                bullet: { code: "2022", color: accentCol },
                fontFace,
                lineSpacing: 15
            });
        });
    }

    // 图片（圆角矩形框）
    if (hasImage) {
        // 添加阴影背景
        slide.addShape('rect', {
            x: 5.95,
            y: 1.45,
            w: 3.7,
            h: 3.7,
            fill: { color: '000000', transparency: 90 }
        });

        // 添加图片
        slide.addImage({
            data: `image/png;base64,${slideData.imgData}`,
            x: 5.8,
            y: 1.3,
            w: 3.7,
            h: 3.7,
            sizing: { type: "cover", w: 3.7, h: 3.7 }
        });
    }
}

/**
 * 时间线布局
 */
function addTimelineLayout(slide, slideData, textCol, accentCol, fontFace) {
    // 主要内容描述
    slide.addText(slideData.content || '', {
        x: 0.5,
        y: 1.2,
        w: 9,
        fontSize: 12,
        color: textCol,
        fontFace
    });

    // 时间线节点
    if (slideData.items && slideData.items.length) {
        const startY = 2.2;
        const stepY = 0.7;

        slideData.items.forEach((item, idx) => {
            const y = startY + (idx * stepY);

            // 时间点圆圈
            slide.addShape('circle', {
                x: 0.8,
                y: y + 0.1,
                w: 0.2,
                h: 0.2,
                fill: { color: accentCol }
            });

            // 连接线
            if (idx < slideData.items.length - 1) {
                slide.addShape('line', {
                    x: 0.9,
                    y: y + 0.3,
                    w: 0,
                    h: stepY - 0.2,
                    line: { color: accentCol, width: 2 }
                });
            }

            // 文本内容
            slide.addText(item, {
                x: 1.3,
                y: y,
                w: 8,
                fontSize: 11,
                color: textCol,
                fontFace
            });
        });
    }
}

/**
 * 对比布局（左右两列）
 */
function addComparisonLayout(slide, slideData, textCol, accentCol, fontFace) {
    // 内容描述
    if (slideData.content) {
        slide.addText(slideData.content, {
            x: 0.5,
            y: 1.2,
            w: 9,
            fontSize: 12,
            color: textCol,
            fontFace
        });
    }

    // 将列表项分成两列
    if (slideData.items && slideData.items.length) {
        const midPoint = Math.ceil(slideData.items.length / 2);
        const leftItems = slideData.items.slice(0, midPoint);
        const rightItems = slideData.items.slice(midPoint);

        // 左列标题
        slide.addText(slideData.leftTitle || '方案 A', {
            x: 0.5,
            y: 2.0,
            w: 4.2,
            fontSize: 14,
            bold: true,
            color: accentCol,
            fontFace
        });

        // 左列内容
        leftItems.forEach((item, idx) => {
            slide.addText(item, {
                x: 0.5,
                y: 2.5 + (idx * 0.5),
                w: 4.2,
                fontSize: 11,
                color: textCol,
                bullet: { code: "2022", color: accentCol },
                fontFace
            });
        });

        // 分隔线
        slide.addShape('line', {
            x: 5,
            y: 1.8,
            w: 0,
            h: 3.5,
            line: { color: accentCol, width: 2, dashType: 'dash' }
        });

        // 右列标题
        slide.addText(slideData.rightTitle || '方案 B', {
            x: 5.3,
            y: 2.0,
            w: 4.2,
            fontSize: 14,
            bold: true,
            color: accentCol,
            fontFace
        });

        // 右列内容
        rightItems.forEach((item, idx) => {
            slide.addText(item, {
                x: 5.3,
                y: 2.5 + (idx * 0.5),
                w: 4.2,
                fontSize: 11,
                color: textCol,
                bullet: { code: "2022", color: accentCol },
                fontFace
            });
        });
    }
}

/**
 * 图片网格布局
 */
function addImageGridLayout(slide, slideData, textCol, accentCol, fontFace) {
    // 内容描述
    if (slideData.content) {
        slide.addText(slideData.content, {
            x: 0.5,
            y: 1.2,
            w: 9,
            fontSize: 12,
            color: textCol,
            fontFace
        });
    }

    // 图片网格 (2x2)
    if (slideData.images && slideData.images.length) {
        const gridSize = 2;
        const imageW = 4;
        const imageH = 2.5;
        const gap = 0.5;
        const startX = 1;
        const startY = 2.2;

        slideData.images.slice(0, 4).forEach((imgData, idx) => {
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            const x = startX + (col * (imageW + gap));
            const y = startY + (row * (imageH + gap));

            if (imgData) {
                slide.addImage({
                    data: `image/png;base64,${imgData}`,
                    x,
                    y,
                    w: imageW,
                    h: imageH,
                    sizing: { type: "cover", w: imageW, h: imageH }
                });
            } else {
                // 占位框
                slide.addShape('rect', {
                    x,
                    y,
                    w: imageW,
                    h: imageH,
                    fill: { color: 'F0F0F0' },
                    line: { color: accentCol, dashType: 'dash' }
                });
            }
        });
    }
}

/**
 * 图表布局
 */
function addChartLayout(slide, slideData, textCol, accentCol, fontFace) {
    // 内容描述
    if (slideData.content) {
        slide.addText(slideData.content, {
            x: 0.5,
            y: 1.2,
            w: 9,
            fontSize: 12,
            color: textCol,
            fontFace
        });
    }

    // 图表数据
    if (slideData.chartData && slideData.chartType) {
        const chartOptions = {
            x: 1.5,
            y: 2.2,
            w: 7,
            h: 3,
            showLegend: true,
            showTitle: false,
            chartColors: [accentCol, textCol, '6fffe9', 'ff6b6b']
        };

        // 根据图表类型添加图表
        switch(slideData.chartType) {
            case 'bar':
                slide.addChart('bar', slideData.chartData, chartOptions);
                break;
            case 'pie':
                slide.addChart('pie', slideData.chartData, chartOptions);
                break;
            case 'line':
                slide.addChart('line', slideData.chartData, chartOptions);
                break;
            case 'area':
                slide.addChart('area', slideData.chartData, chartOptions);
                break;
            default:
                slide.addChart('bar', slideData.chartData, chartOptions);
        }
    } else if (slideData.items && slideData.items.length) {
        // 如果没有图表数据，使用项目列表作为柱状图数据
        const chartData = [{
            name: slideData.title,
            labels: slideData.items.map((item, idx) => `项${idx + 1}`),
            values: slideData.items.map(() => Math.floor(Math.random() * 100))
        }];

        slide.addChart('bar', chartData, {
            x: 1.5,
            y: 2.2,
            w: 7,
            h: 3,
            showLegend: false,
            showTitle: false,
            chartColors: [accentCol]
        });
    }
}
