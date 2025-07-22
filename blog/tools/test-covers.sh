#!/bin/bash

# 博客封面图片测试脚本
# 使用方法: chmod +x tools/test-covers.sh && ./tools/test-covers.sh

echo "🚀 开始测试博客封面图片..."

# 检查当前目录
if [ ! -f "_config.yml" ]; then
    echo "❌ 请在博客根目录运行此脚本"
    exit 1
fi

# 清理之前的生成文件
echo "🧹 清理之前的生成文件..."
rm -rf public/
rm -rf .deploy_git/

# 生成静态文件
echo "📦 生成静态文件..."
npx hexo clean
npx hexo generate

# 检查生成是否成功
if [ $? -eq 0 ]; then
    echo "✅ 静态文件生成成功"
else
    echo "❌ 静态文件生成失败"
    exit 1
fi

# 启动本地服务器
echo "🌐 启动本地服务器..."
echo "📱 请在浏览器中访问: http://localhost:4000"
echo "🔍 检查首页文章卡片的封面图片是否正确显示"
echo "⏹️  按 Ctrl+C 停止服务器"

npx hexo server
