---
title: hexo+typora写文章
author: Leion Charrrrls
date: 2025-07-23 10:45:37
cover: "https://tc.alcy.cc/i/2025/07/11/686ffafc88691.webp"
tags:
  - Hexo
  - Typora
  - Blog
categories:
  - 个人经历
  - 技术分享
password: ""
---

# 本文详细讲解一下hexo+typora本地写文章的完整流程

## 🚀 Typora下载与配置

### 下载安装
首先从官网下载Typora：https://typoraio.cn/

![Typora官网下载页面](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115029933.png)

Typora是一款优秀的Markdown编辑器，具有以下特点：
- 🎨 所见即所得的编辑体验
- 📝 支持实时预览
- 🖼️ 强大的图片处理功能
- 🎯 简洁优雅的界面设计

### 主题配置
从官网右上角的[主题库](https://theme.typoraio.cn/)选择心仪的主题。我推荐使用[Mdmdt主题](https://theme.typoraio.cn/theme/Mdmdt/)，效果如下：

![Mdmdt主题效果展示](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115045973.png)

**安装步骤：**
1. 从GitHub下载主题文件
2. 打开Typora偏好设置
3. 点击"打开主题文件夹"
4. 将下载的主题文件复制到文件夹中
5. 重启Typora并选择主题

![主题文件夹位置](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115100054.png)

⚠️ **注意：** 每种主题的安装方式可能略有不同，请仔细阅读作者提供的安装说明。

## 📝 Hexo配置与发文

### Hexo Markdown参数详解

在Hexo中，每篇文章的front-matter（文件头部的YAML配置）支持多种参数，以下是完整的参数说明：

| 配置选项 | 默认值 | 描述 |
|---------|--------|------|
| `title` | Markdown文件标题 | **文章标题**，强烈建议填写此选项 |
| `date` | 文件创建时间 | **发布时间**，建议填写且保证全局唯一 |
| `author` | 根_config.yml中的author | **文章作者**，可覆盖全局设置 |
| `img` | featureImages中的某个值 | **文章特征图**，推荐使用图床服务 |
| `top` | `false` | **推荐文章**，设为`true`时文章置顶 |
| `cover` | `false` | **轮播封面**，是否加入首页轮播 |
| `coverImg` | 无 | **轮播图片**，首页轮播显示的图片路径 |
| `password` | 无 | **阅读密码**，需要SHA256加密 |
| `toc` | `true` | **目录开关**，是否显示文章目录 |
| `mathjax` | `false` | **数学公式**，是否支持LaTeX公式 |
| `summary` | 无 | **文章摘要**，自定义摘要内容 |
| `categories` | 无 | **文章分类**，建议一篇文章一个分类 |
| `tags` | 无 | **文章标签**，一篇文章可以多个标签 |
| `keywords` | 文章标题 | **关键词**，用于SEO优化 |
| `reprintPolicy` | `cc_by` | **转载规则**，版权声明类型 |

### 完整配置示例

以下是包含所有参数的完整示例：

```yaml
---
title: hexo+typora写文章完整指南
author: Leion Charrrrls
date: 2025-07-23 10:45:37
img: /source/images/hexo-typora-guide.jpg
top: true
cover: true
coverImg: /images/covers/hexo-typora-banner.jpg
password: 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
toc: true
mathjax: false
summary: 这是一篇详细介绍如何使用Hexo+Typora进行博客写作的完整指南，包含环境配置、主题设置、图片处理等全流程。
categories: 
  - 技术分享
tags:
  - Hexo
  - Typora
  - Markdown
  - 博客搭建
keywords: Hexo, Typora, Markdown, 博客, 写作工具
reprintPolicy: cc_by_nc_sa
---
```

### 创建新文章

使用Hexo命令创建新文章：

```bash
# 创建新文章
hexo new "文章标题"
# 简写形式
hexo n "文章标题"
```

### 自定义文章模板

默认的文章模板比较简单，我们可以通过修改 `blog/scaffolds/post.md` 来自定义模板：

**原始模板：**
```yaml
---
title: {{ title }}
date: {{ date }}
tags:
---
```

**推荐的增强模板：**
```yaml
---
title: {{ title }}
date: {{ date }}
author: Leion Charrrrls
cover: ""
tags: []
categories: []
password: ""
summary: ""
toc: true
---
```

⚠️ **重要提醒：** 
- YAML语法要求冒号后必须有空格：`key: value`
- 空值必须用引号：`cover: ""`
- 数组可以用 `[]` 或多行格式
- 不能留空值，否则会导致解析错误

### 图片处理最佳实践

我使用Typora配合[uPic](https://github.com/gee1k/uPic)进行图片自动上传：

![uPic配置界面](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115741019.png)

**配置步骤：**
1. 安装uPic图床工具
2. 配置GitHub作为图床服务
3. 在Typora中设置自动上传

![GitHub图床配置](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115919932.png)

**优势：**
- ✅ 自动上传，无需手动处理
- ✅ CDN加速，访问速度快
- ✅ 版本控制，图片有备份
- ✅ 跨平台同步，随时随地写作

## 🎯 写作流程总结

1. **环境准备**
   - 安装配置Typora
   - 设置喜欢的主题
   - 配置图片自动上传

2. **创建文章**
   ```bash
   hexo new "文章标题"
   ```

3. **编写内容**
   - 使用Typora打开md文件
   - 完善front-matter配置
   - 编写文章内容
   - 插入图片（自动上传）

4. **预览发布**
   ```bash
   hexo clean    # 清理缓存
   hexo generate # 生成静态文件
   hexo server   # 本地预览
   hexo deploy   # 部署发布
   ```

## 💡 总结

Hexo + Typora 的组合具有以下优势：

- 🚀 **高效写作**：所见即所得的编辑体验
- 🎨 **美观界面**：简约优雅的设计风格  
- 🖼️ **图片便利**：自动上传，无需手动处理
- ⚡ **快速发布**：一键生成静态博客
- 🔧 **高度定制**：丰富的主题和插件生态

这套工具链非常适合技术博客写作，强烈推荐给所有博主使用！✨
