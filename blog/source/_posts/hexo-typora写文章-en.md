---
title: Writing Articles with Hexo + Typora
slug: hexo-typora-writing-guide
author: Leion Charrrrls
lang: en
cover: 'https://tc.alcy.cc/i/2025/07/11/686fe51edeb8c.webp'
tags:
  - Hexo
  - Typora
  - Blog
categories:
  - Tech Sharing
password: ''
abbrlink: 2fcff707
date: 2025-07-23 10:45:37
---
# Complete Guide to Writing Articles Locally with Hexo + Typora

## 🚀 Typora Download & Configuration

### Download and Installation

First, download Typora from the official website: https://typoraio.cn/

![Typora Official Download Page](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115029933.png)

Typora is an excellent Markdown editor with the following features:

- 🎨 WYSIWYG editing experience
- 📝 Real-time preview support
- 🖼️ Powerful image processing functionality
- 🎯 Clean and elegant interface design

### Theme Configuration

Choose your favorite theme from the [Theme Gallery](https://theme.typoraio.cn/) in the top-right corner of the official website. I recommend using the [Mdmdt theme](https://theme.typoraio.cn/theme/Mdmdt/), with the following effect:

![Mdmdt Theme Effect](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115045973.png)

**Installation Steps:**

1. Download theme files from GitHub
2. Open Typora preferences
3. Click "Open Theme Folder"
4. Copy the downloaded theme files to the folder
5. Restart Typora and select the theme

![Theme Folder Location](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115100054.png)

⚠️ **Note:** Installation methods may vary slightly for different themes. Please carefully read the installation instructions provided by the author.

## 📝 Hexo Configuration & Publishing

### Detailed Hexo Markdown Parameters

In Hexo, the front-matter (YAML configuration at the top of files) for each article supports various parameters. Here's a complete parameter explanation:

| Configuration Option | Default Value | Description |
| ------------------- | ------------- | ----------- |
| `title` | Markdown file title | **Article title**, strongly recommended to fill this option |
| `date` | File creation time | **Publication time**, recommended to fill and ensure global uniqueness |
| `author` | author in root _config.yml | **Article author**, can override global settings |
| `img` | A value from featureImages | **Article feature image**, recommend using image hosting service |
| `top` | `false` | **Recommended article**, set to `true` to pin article |
| `cover` | `false` | **Carousel cover**, whether to add to homepage carousel |
| `coverImg` | None | **Carousel image**, image path displayed in homepage carousel |
| `password` | None | **Reading password**, requires SHA256 encryption |
| `toc` | `true` | **Table of contents switch**, whether to show article TOC |
| `mathjax` | `false` | **Math formulas**, whether to support LaTeX formulas |
| `summary` | None | **Article summary**, custom summary content |
| `categories` | None | **Article categories**, recommend one category per article |
| `tags` | None | **Article tags**, one article can have multiple tags |
| `keywords` | Article title | **Keywords**, used for SEO optimization |
| `reprintPolicy` | `cc_by` | **Reprint rules**, copyright declaration type |

### Complete Configuration Example

Here's a complete example including all parameters:

```yaml
---
title: Complete Guide to Writing Articles with Hexo + Typora
author: Leion Charrrrls
date: 2025-07-23 10:45:37
img: /source/images/hexo-typora-guide.jpg
top: true
cover: true
coverImg: /images/covers/hexo-typora-banner.jpg
password: 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
toc: true
mathjax: false
summary: This is a detailed guide on how to use Hexo + Typora for blog writing, including environment configuration, theme setup, image processing, and the complete workflow.
categories: 
  - Tech Sharing
tags:
  - Hexo
  - Typora
  - Markdown
  - Blog Setup
keywords: Hexo, Typora, Markdown, Blog, Writing Tools
reprintPolicy: cc_by_nc_sa
---
```

### Create New Article

Use Hexo commands to create new articles:

```bash
# Create new article
hexo new "Article Title"
# Short form
hexo n "Article Title"
```

### Custom Article Template

The default article template is quite simple. We can customize the template by modifying `blog/scaffolds/post.md`:

**Original template:**

```yaml
---
title: {{ title }}
date: {{ date }}
tags:
---
```

**Recommended enhanced template:**

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

⚠️ **Important Reminder:**

- YAML syntax requires a space after the colon: `key: value`
- Empty values must use quotes: `cover: ""`
- Arrays can use `[]` or multi-line format
- Cannot leave empty values, otherwise parsing errors occur

### Image Processing Best Practices

I use Typora combined with [uPic](https://github.com/gee1k/uPic) for automatic image upload:

![uPic Configuration Interface](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115741019.png)

**Configuration Steps:**

1. Install uPic image hosting tool
2. Configure GitHub as image hosting service
3. Set up automatic upload in Typora

![GitHub Image Hosting Configuration](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250723115919932.png)

**Advantages:**

- ✅ Automatic upload, no manual processing needed
- ✅ CDN acceleration, fast access speed
- ✅ Version control, image backup available
- ✅ Cross-platform sync, write anywhere anytime

## 🎯 Writing Workflow Summary

1. **Environment Setup**

   - Install and configure Typora
   - Set favorite theme
   - Configure automatic image upload

2. **Create Article**

   ```bash
   hexo new "Article Title"
   ```

3. **Write Content**

   - Open md file with Typora
   - Complete front-matter configuration
   - Write article content
   - Insert images (auto-upload)

4. **Preview and Publish**

   ```bash
   hexo clean    # Clean cache
   hexo generate # Generate static files
   hexo server   # Local preview
   hexo deploy   # Deploy and publish
   ```

## 💡 Summary

The Hexo + Typora combination has the following advantages:

- 🚀 **Efficient Writing**: WYSIWYG editing experience
- 🎨 **Beautiful Interface**: Clean and elegant design style
- 🖼️ **Image Convenience**: Auto-upload, no manual processing needed
- ⚡ **Quick Publishing**: One-click static blog generation
- 🔧 **Highly Customizable**: Rich theme and plugin ecosystem

This toolchain is perfect for technical blog writing and highly recommended for all bloggers! ✨