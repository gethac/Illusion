# 双源配图机制说明

## 功能概述

幻境 PPT 助手现已支持两种配图方式：
1. **AI生成**：使用 DALL-E 3 根据内容生成定制图片
2. **网络搜图**：从 Unsplash 或 Pexels 搜索免费高质量图片

用户可以在配置中选择图片源，实现灵活的配图策略。

## 两种配图模式对比

| 特性 | AI生成 | 网络搜图 |
|-----|--------|---------|
| 图片质量 | 定制化，与内容完美匹配 | 专业摄影作品，质量极高 |
| 相关性 | 非常高 | 中等（依赖关键词） |
| 生成速度 | 较慢（10-30秒/张） | 较快（1-3秒/张） |
| 成本 | 需要API调用（有费用） | 免费 |
| API要求 | OpenAI API Key | Unsplash/Pexels API Key（免费） |
| 适用场景 | 特定概念、抽象内容 | 具体事物、风景、人物 |

## AI生成模式

### 工作流程
1. **生成提示词**：使用文本模型分析幻灯片内容，生成英文提示词
2. **生成图片**：使用 DALL-E 3 根据提示词生成图片
3. **返回Base64**：直接嵌入PPT

### 优势
- ✅ 内容高度相关
- ✅ 风格可控（根据PPT主题）
- ✅ 适合抽象概念
- ✅ 无版权问题

### 限制
- ⚠️ 生成速度较慢
- ⚠️ 需要API调用费用
- ⚠️ 每次生成结果略有不同

### 示例
```javascript
幻灯片标题：人工智能的未来
幻灯片内容：AI技术将深刻改变人类社会...

生成的提示词：
"Professional futuristic AI technology concept,
robotic brain with neural networks, blue and
purple color scheme, minimal modern style"

生成的图片：定制化的AI概念图
```

## 网络搜图模式

### 工作流程
1. **生成关键词**：使用文本模型提取英文搜索关键词
2. **搜索图片**：从 Unsplash/Pexels 搜索相关图片
3. **返回列表**：用户可选择最合适的图片

### 支持的图片源

#### Unsplash
- **图片数量**：超过300万张
- **图片质量**：专业摄影作品
- **API限制**：免费50次/小时
- **注册地址**：https://unsplash.com/developers

#### Pexels
- **图片数量**：数百万张
- **图片质量**：免费商用图片
- **API限制**：免费200次/小时
- **注册地址**：https://www.pexels.com/api/

### 配置方法

1. **注册API Key**
   ```bash
   # Unsplash
   访问 https://unsplash.com/developers
   创建应用，获取Access Key

   # Pexels
   访问 https://www.pexels.com/api/
   注册并获取API Key
   ```

2. **配置到系统**

   在 `src/services/imageSearch.js` 中：
   ```javascript
   const UNSPLASH_ACCESS_KEY = 'your_access_key_here'
   const PEXELS_API_KEY = 'your_api_key_here'
   ```

   或在 ConfigStore 中配置：
   ```javascript
   configStore.unsplashApiKey = 'your_access_key_here'
   configStore.pexelsApiKey = 'your_api_key_here'
   ```

### 优势
- ✅ 图片质量极高
- ✅ 搜索速度快
- ✅ 完全免费（API免费）
- ✅ 无版权问题（CC0许可）

### 限制
- ⚠️ 依赖关键词质量
- ⚠️ 可能找不到完美匹配的图片
- ⚠️ 需要配置API Key

### 示例
```javascript
幻灯片标题：数据分析趋势
幻灯片内容：大数据技术的应用场景...

生成的关键词："data analysis technology"

搜索结果：
1. 数据可视化图表照片
2. 分析师工作照片
3. 电脑屏幕上的数据图表
（用户可选择最合适的一张）
```

## 技术实现

### 文件结构
```
src/
├── services/
│   └── imageSearch.js          # 网络图片搜索服务
├── generators/
│   └── image.js                # 图片生成器（双源支持）
└── stores/
    └── config.js               # 配置Store（新增图片源选项）
```

### API接口

#### 1. generateSlideImage()
```javascript
/**
 * 统一的配图生成接口（支持双源）
 * @param {string} imageSource - 'ai' | 'web'
 * @returns {Promise<Object>} { type, data, images? }
 */
const result = await generateSlideImage(
  slideTitle,
  slideContent,
  theme,
  config,
  'ai' // or 'web'
)

// AI模式返回：
{ type: 'base64', data: 'iVBORw0KGgoAAAA...' }

// 网络搜图模式返回：
{
  type: 'url',
  data: 'https://images.unsplash.com/...',
  images: [...] // 所有搜索结果
}
```

#### 2. searchSlideImages()
```javascript
/**
 * 搜索网络图片
 */
const images = await searchSlideImages(
  slideTitle,
  slideContent,
  config,
  'auto' // or 'unsplash' | 'pexels'
)

// 返回：
[
  {
    id: '...',
    url: 'https://...',
    thumbnail: 'https://...',
    description: '...',
    author: '...',
    source: 'unsplash'
  },
  ...
]
```

#### 3. downloadImageAsBase64()
```javascript
/**
 * 下载网络图片并转换为Base64
 */
const base64 = await downloadImageAsBase64(imageUrl)
```

### CORS代理

网络图片下载使用 `images.weserv.nl` 作为代理，避免CORS问题：

```javascript
const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`
```

## 使用场景建议

### 使用AI生成
- 抽象概念（创新、未来、愿景）
- 特定风格要求（与PPT主题一致）
- 独特性要求（避免撞图）
- 无法用具体物体表达的内容

### 使用网络搜图
- 具体事物（产品、建筑、人物）
- 自然风景（山川、海洋、天空）
- 商业场景（办公室、会议、团队）
- 技术设备（电脑、手机、仪器）

## 配置示例

### 步骤1：选择图片源
```vue
<!-- 在步骤1配置页面 -->
<select v-model="configStore.imageSource">
  <option value="ai">AI生成（DALL-E 3）</option>
  <option value="web">网络搜图（Unsplash/Pexels）</option>
</select>
```

### 步骤2：配置API Key
```vue
<!-- AI模式 -->
<input v-if="imageSource === 'ai'"
       v-model="configStore.apiKey"
       placeholder="OpenAI API Key" />

<!-- 网络搜图模式 -->
<input v-if="imageSource === 'web'"
       v-model="configStore.unsplashApiKey"
       placeholder="Unsplash Access Key" />
```

## 错误处理

### 常见错误

1. **API Key无效**
   ```
   错误：Unsplash API密钥无效
   解决：检查配置，确保API Key正确
   ```

2. **未找到相关图片**
   ```
   错误：未找到相关图片
   解决：切换到AI生成模式
   ```

3. **CORS问题**
   ```
   错误：图片下载失败
   解决：系统自动使用代理，一般不会出现
   ```

4. **网络超时**
   ```
   错误：请求超时
   解决：检查网络连接，重试
   ```

## 性能优化

1. **图片缓存**
   - 搜索结果缓存（避免重复搜索）
   - Base64缓存（避免重复下载）

2. **懒加载**
   - 只在需要时搜索图片
   - 缩略图优先加载

3. **并发控制**
   - 限制同时下载的图片数量
   - 避免API限流

## 未来增强

- [ ] 图片编辑功能（裁剪、滤镜）
- [ ] 本地图片上传
- [ ] 更多图片源（Pixabay、Flickr）
- [ ] 图片智能推荐（根据主题自动选图）
- [ ] 图片预览对比（多张图并排选择）

## API配额说明

| 服务 | 免费配额 | 付费方案 |
|-----|---------|---------|
| DALL-E 3 | 按调用收费 | $0.04/张（1024x1024） |
| Unsplash | 50次/小时 | 无限制（申请商业计划） |
| Pexels | 200次/小时 | 无限制 |

## 版权说明

- **AI生成**：生成的图片归用户所有，无版权问题
- **Unsplash**：CC0许可，可商用，需注明出处（建议）
- **Pexels**：Pexels许可，可商用，无需注明出处

---

**实现时间**：2025-12-16
**版本**：V2.0 - 阶段三
