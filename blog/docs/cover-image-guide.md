# 📸 博客封面图片规范指南

## 🎯 推荐尺寸和格式

### 最佳尺寸
- **主要推荐**: 1200x630px (1.91:1 比例)
- **备选方案**: 1920x1080px (16:9 比例)
- **最小尺寸**: 800x400px
- **最大尺寸**: 2000x1000px

### 支持格式
- **首选**: JPG (压缩效果好，文件小)
- **备选**: PNG (支持透明背景)
- **现代**: WebP (更好的压缩比，现代浏览器支持)
- **避免**: GIF (文件大，不适合封面)

### 文件大小
- **理想大小**: 100-300KB
- **最大限制**: 500KB
- **压缩建议**: 使用在线工具如 TinyPNG 压缩

## 🎨 设计建议

### 视觉要求
1. **清晰度**: 图片清晰，避免模糊
2. **对比度**: 确保文字在图片上可读
3. **主题相关**: 图片内容与文章主题相关
4. **色彩搭配**: 与博客整体色调协调

### 内容建议
- **技术文章**: 代码、电路板、科技元素
- **生活分享**: 自然风景、生活场景
- **教程类**: 工具、步骤示意图
- **思考类**: 抽象图案、简约设计

## 📁 文件组织

### 目录结构
```
blog/source/img/covers/
├── tech/           # 技术类封面
├── life/           # 生活类封面
├── tutorial/       # 教程类封面
└── abstract/       # 抽象类封面
```

### 命名规范
```
tech-javascript-01.jpg
life-travel-tokyo.jpg
tutorial-hexo-setup.jpg
abstract-gradient-blue.jpg
```

## 🔧 图片优化工具

### 在线工具
- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- **Compressor.io**: https://compressor.io/

### 本地工具
- **ImageOptim** (macOS)
- **GIMP** (跨平台)
- **Photoshop** (付费)

## 📱 响应式考虑

### 不同设备显示
- **桌面端**: 完整显示 1200x630
- **平板端**: 自动缩放保持比例
- **手机端**: 可能裁剪，重要内容居中

### 安全区域
- 重要文字和元素放在中央 60% 区域
- 避免在边缘放置关键信息

## 🚀 性能优化

### 懒加载
```yaml
# _config.butterfly.yml
lazyload:
  enable: true
  field: site
```

### CDN加速
```yaml
# 使用图片CDN
cover: https://cdn.example.com/covers/image.jpg
```

### 多格式支持
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="封面图片">
</picture>
```

## ✅ 检查清单

在上传封面图片前，请确认：

- [ ] 尺寸符合推荐规格 (1200x630px)
- [ ] 文件大小小于500KB
- [ ] 图片清晰，无版权问题
- [ ] 与文章主题相关
- [ ] 文件名规范，易于管理
- [ ] 已进行压缩优化
- [ ] 在不同设备上测试显示效果

## 🎯 实际应用示例

### 文章front-matter示例
```markdown
---
title: JavaScript异步编程详解
date: 2025-07-22
cover: /img/covers/tech/javascript-async.jpg
tags: [JavaScript, 异步编程]
categories: [前端开发]
---
```

### 批量处理示例
```bash
# 运行批量更新脚本
cd blog
node scripts/update-covers.js
```
