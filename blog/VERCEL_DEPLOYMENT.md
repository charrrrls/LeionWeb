# Vercel 双语博客部署指南

## 🚀 部署配置

### 1. Vercel项目设置

在Vercel Dashboard中：

1. **Build Command**: 留空 (Vercel会自动使用 `npm run build`)
2. **Output Directory**: `public`
3. **Install Command**: `npm install`

### 2. 环境变量 (可选)

如果需要设置特定环境变量，可在Vercel Environment Variables中添加：

```
NODE_ENV=production
```

### 3. 项目结构说明

```
blog/
├── build-bilingual.sh      # 双语构建脚本
├── package.json            # NPM配置，包含构建命令
├── vercel.json            # Vercel部署配置
├── _config.yml            # Hexo中文站点配置
├── config-en.yml          # Hexo英文站点配置
├── themes/
│   ├── butterfly/         # 中文主题
│   └── butterfly-en/      # 英文主题
└── source/
    ├── _data/
    │   ├── link.yml       # 中文友链数据
    │   └── link-en.yml    # 英文友链数据
    └── _posts/
        ├── *-zh.md        # 中文文章
        └── *-en.md        # 英文文章
```

### 4. 构建过程

Vercel部署时会自动执行：

1. `npm install` - 安装依赖
2. `npm run build` - 执行双语构建脚本
   - `hexo clean` - 清理缓存
   - `hexo generate` - 生成中文站点 (public/)
   - `hexo generate --config config-en.yml` - 生成英文站点 (public/en/)

### 5. 访问地址

部署完成后：

- **中文站点**: `https://your-domain.com/`
- **英文站点**: `https://your-domain.com/en/`

### 6. 域名配置

在Vercel中配置自定义域名：

1. 进入项目 Settings > Domains
2. 添加自定义域名
3. 按提示配置DNS记录

### 7. 构建状态检查

可以在Vercel项目的 Functions > View Function Logs 中查看构建日志，确认双语构建是否成功。

## 🔧 故障排除

### 构建失败

如果构建失败，检查：

1. `package.json` 中的构建命令是否正确
2. `hexo-cli` 是否已安装 (已包含在依赖中)
3. 主题文件是否完整

### 页面显示异常

如果页面显示异常：

1. 检查 `_config.yml` 和 `config-en.yml` 中的路径配置
2. 确认主题配置文件是否正确
3. 检查友链数据文件格式

### 友链不显示

如果友链页面空白：

1. 确认 `source/_data/link.yml` 和 `link-en.yml` 格式正确
2. 检查主题的友链模板是否正确修改
3. 验证页面类型设置为 `type: "link"`

## 📝 更新流程

1. 本地修改内容
2. 测试构建: `npm run build`
3. 提交到Git仓库
4. Vercel自动部署

---

**提示**: 首次部署可能需要几分钟时间，后续更新会更快。