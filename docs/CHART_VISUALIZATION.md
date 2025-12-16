# 图表可视化功能说明

## 功能概述

幻境 PPT 助手现已支持完整的图表可视化功能，包括：
- **Web预览**：使用 ECharts 实时预览图表
- **PPT导出**：使用 PptxGenJS 生成原生 PPT 图表（非截图）

## 支持的图表类型

### 1. 柱状图 (bar)
适用场景：数据对比、排名展示
```json
{
  "layout": "chart",
  "chartType": "bar",
  "chartData": [
    {
      "name": "季度营收",
      "labels": ["Q1", "Q2", "Q3", "Q4"],
      "values": [65, 78, 82, 95]
    }
  ]
}
```

### 2. 饼图 (pie)
适用场景：占比分布、比例展示
```json
{
  "layout": "chart",
  "chartType": "pie",
  "chartData": [
    {
      "name": "市场份额",
      "labels": ["产品A", "产品B", "产品C", "产品D"],
      "values": [35, 25, 20, 20]
    }
  ]
}
```

### 3. 折线图 (line)
适用场景：趋势展示、时间序列
```json
{
  "layout": "chart",
  "chartType": "line",
  "chartData": [
    {
      "name": "用户增长",
      "labels": ["1月", "2月", "3月", "4月", "5月", "6月"],
      "values": [120, 145, 180, 210, 265, 320]
    }
  ]
}
```

### 4. 面积图 (area)
适用场景：累积趋势、数据填充展示
```json
{
  "layout": "chart",
  "chartType": "area",
  "chartData": [
    {
      "name": "累计销售额",
      "labels": ["周一", "周二", "周三", "周四", "周五"],
      "values": [100, 250, 420, 650, 900]
    }
  ]
}
```

## 技术实现

### Web 预览 (Chart.vue)

使用 `vue-echarts` 和 `echarts/core` 实现轻量级图表渲染：

```vue
<template>
  <Chart
    :chartType="slide.chartType"
    :chartData="slide.chartData"
    :theme="currentTheme"
  />
</template>
```

**特性：**
- 自适应主题颜色（accent color 自动应用）
- 响应式尺寸调整
- 透明背景融入赛博朋克UI
- 平滑动画效果

### PPT 导出 (PPTBuilder.js)

使用 `PptxGenJS` 的原生图表 API：

```javascript
renderChart(slide, data) {
  slide.addChart(data.chartType, data.chartData, {
    x: 1.5, y: 2.2, w: 7, h: 3,
    showLegend: true,
    chartColors: [accentColor, textColor, ...]
  })
}
```

**优势：**
- 生成原生 PPT 图表（非图片）
- 可在 PowerPoint 中编辑数据
- 保持主题配色一致性

## AI 生成提示增强

在 `content.js` 中增强了图表生成提示：

```javascript
图表布局的 chartData 要求：
- chartType: 必须是 "bar"/"pie"/"line"/"area" 之一
- chartData: 数组格式，包含数据系列对象
  - name: 数据系列名称
  - labels: 横轴标签数组
  - values: 对应的数值数组（必须与labels长度一致）
- 数据必须真实可信，符合主题内容
```

## 数据格式规范

### chartData 结构
```typescript
interface ChartData {
  name: string;        // 数据系列名称
  labels: string[];    // X轴标签
  values: number[];    // Y轴数值
}

interface SlideData {
  layout: "chart";
  chartType: "bar" | "pie" | "line" | "area";
  chartData: ChartData[];
  title: string;
  content?: string;    // 图表说明文字
  speakerNotes: string;
}
```

### 注意事项

1. **数据一致性**：`labels` 和 `values` 数组长度必须相同
2. **数据真实性**：AI 生成的数据应符合业务逻辑
3. **图表选择**：根据数据特点选择合适的图表类型
   - 对比 → bar
   - 占比 → pie
   - 趋势 → line/area
4. **演讲者备注**：包含图表数据的关键洞察

## 使用示例

### 步骤1：生成包含图表的大纲
```
主题：2025年AI市场分析
大纲项：
- 市场规模增长趋势 (适合line图)
- 各领域市场份额分布 (适合pie图)
- 季度营收对比 (适合bar图)
```

### 步骤2：AI 自动生成图表数据
系统会根据大纲自动选择合适的图表类型并生成真实数据

### 步骤3：Web 预览
在生成页面实时查看 ECharts 渲染的图表预览

### 步骤4：导出 PPT
导出的 PPTX 文件包含原生可编辑的图表

## 主题适配

图表会自动适配选择的主题：
- **accent color**：主数据系列颜色
- **text color**：坐标轴、标签文字颜色
- **background**：透明背景融入幻灯片

示例（Cyberpunk主题）：
- Accent: `#6fffe9` (青色)
- Text: `#e0e0e0` (浅灰)
- 效果：科技感强烈的数据可视化

## 文件清单

相关文件：
```
src/
├── components/
│   └── Chart.vue                 # ECharts图表组件
├── generators/
│   └── content.js                # 增强的内容生成器（含图表数据）
├── exporters/
│   └── PPTBuilder.js             # PPT构建器（renderChart方法）
└── App.vue                       # 集成图表预览
```

## 已知限制

1. 暂不支持多系列图表（计划未来版本支持）
2. 图表样式固定，不支持自定义配色（遵循主题色）
3. 饼图最多建议6个分类（视觉清晰度考虑）

## 未来规划

- [ ] 支持多系列对比图表
- [ ] 雷达图、散点图支持
- [ ] 图表样式自定义
- [ ] 图表动画配置
- [ ] 数据导入功能（CSV/Excel）

---

**实现时间**：2025-12-16
**版本**：V2.0 - 阶段二
