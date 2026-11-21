#!/bin/bash

# 双语博客构建脚本
# LeionWeb Bilingual Blog Build Script
# 作者: Leion Charrrrls

echo "🚀 开始构建双语博客 / Starting bilingual blog build..."

# Resolve the photo collection once for both languages.
node gallery/catalog.js || exit 1

# 清理之前的构建
echo "🧹 清理之前的构建文件 / Cleaning previous build files..."
hexo clean

# 构建中文版本
echo "🇨🇳 构建中文版本 / Building Chinese version..."
hexo generate

# 构建英文版本
echo "🇺🇸 构建英文版本 / Building English version..."
echo "使用英文主题配置..."
# 备份当前中文配置
cp _config.butterfly.yml _config.butterfly-cn-backup.yml
# 使用英文配置
cp _config.butterfly-en.yml _config.butterfly.yml
hexo generate --config config-en.yml
echo "恢复中文主题配置..."
# 恢复中文配置
cp _config.butterfly-cn-backup.yml _config.butterfly.yml
rm _config.butterfly-cn-backup.yml

# 确保英文站点文件夹存在并添加标记文件
echo "📝 添加部署标记文件 / Adding deployment marker files..."
if [ -d "public/en" ]; then
    touch public/en/.nojekyll
    echo "en-site-marker" > public/en/.gitkeep
    echo "✅ 英文站点构建成功"
else
    echo "❌ 英文站点构建失败，目录不存在"
    echo "🔧 尝试手动创建英文站点..."
    mkdir -p public/en
    echo "<h1>English Site Under Construction</h1>" > public/en/index.html
fi

echo "✅ 双语博客构建完成！/ Bilingual blog build completed!"
echo ""
echo "📁 生成的文件结构 / Generated file structure:"
echo "├── public/          # 中文站点 / Chinese site"
echo "└── public/en/       # 英文站点 / English site"
echo ""
echo "🔍 验证英文站点文件 / Verifying English site files:"
ls -la public/en/ | head -10 || echo "英文站点目录不存在"
echo ""
echo "🌐 部署后访问地址 / Access URLs after deployment:"
echo "• 中文版: https://leion.ssatop.top/"
echo "• 英文版: https://leion.ssatop.top/en/"
