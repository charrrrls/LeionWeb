#!/bin/bash

# 快速推送脚本
git add .
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "✅ 推送完成！"