#!/bin/bash

# 双语博客本地开发服务器脚本
# LeionWeb Bilingual Blog Development Server Script
# 作者: Leion Charrrrls

echo "🚀 启动双语博客开发环境 / Starting bilingual blog development environment..."

# 首先构建双语站点
echo "🏗️ 构建双语站点 / Building bilingual sites..."
./build-bilingual.sh

echo ""
echo "📝 本地开发访问说明 / Local Development Access Guide:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌍 中文站点: http://localhost:4000/"
echo "🌍 英文站点: http://localhost:4000/en/"
echo ""
echo "⚠️  注意事项 / Important Notes:"
echo "   • 在本地开发环境中，语言切换链接可能需要手动修改URL"
echo "   • 部署到生产环境后，语言切换功能将正常工作"
echo "   • In local development, language switching may require manual URL modification"  
echo "   • Language switching will work properly after deployment to production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔥 启动开发服务器 / Starting development server..."
echo "   按 Ctrl+C 停止服务器 / Press Ctrl+C to stop server"

# 启动 hexo 服务器
hexo server --port 4000