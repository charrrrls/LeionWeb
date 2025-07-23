#!/bin/bash

echo "📝 开始推送博客源码到GitHub..."

# 检查是否在正确目录
if [ ! -f "_config.yml" ]; then
    echo "❌ 请在博客根目录运行此脚本"
    exit 1
fi

# 检查Git状态
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ 没有新的更改需要提交"
    exit 0
fi

# 添加所有更改
echo "📦 添加文件到暂存区..."
git add .

# 提交更改
echo "💾 提交更改..."
read -p "请输入提交信息 (直接回车使用默认信息): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update blog content: $(date '+%Y-%m-%d %H:%M:%S')"
fi

git commit -m "$commit_msg"

# 推送到远程仓库
echo "🚀 推送到GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ 推送成功！"
    echo "🔗 仓库地址: https://github.com/charrrrls/LeionWeb"
else
    echo "❌ 推送失败！"
    exit 1
fi