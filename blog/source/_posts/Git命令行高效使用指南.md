---
title: "Git命令行高效使用指南"
slug: git-command-line-guide
date: 2025-07-24 10:10:05
author: Leion Charrrrls
cover: "https://img.loliapi.com/i/pc/img567.webp"
tags: 
  - Git
  - 版本控制
  - 开发工具
categories: 
  - DevOps
description: "Git核心命令与高效工作流实践，开发者必备命令速查手册"
---

# 掌握Git命令行，提升开发效率 🚀

Git是现代软件开发中不可或缺的版本控制工具。本文整理了最常用的Git命令，按功能分类，便于快速查找和学习。

## 1. 仓库初始化与基础配置 ⚙️

### 仓库初始化
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git init` | 初始化新的Git仓库 | `--bare` 创建裸仓库<br>`--template=<template_directory>` 指定模板 | 新项目开始时 |
| `git clone <url>` | 克隆远程仓库 | `-b <branch>` 指定分支<br>`--depth 1` 浅克隆<br>`--recursive` 递归克隆子模块 | 获取现有项目 |

### 配置管理
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git config` | 配置Git设置 | `--global` 全局配置<br>`--local` 本地配置<br>`--system` 系统配置 | 环境初始化 |
| `git config --list` | 查看所有配置 | `--show-origin` 显示配置来源 | 检查配置状态 |
| `git config --unset` | 删除配置项 | `--global` 删除全局配置 | 清理错误配置 |

### 常用配置命令
```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 设置默认编辑器
git config --global core.editor "code --wait"
git config --global core.editor "vim"

# 设置默认分支名
git config --global init.defaultBranch main

# 设置换行符处理
git config --global core.autocrlf input  # Mac/Linux
git config --global core.autocrlf true   # Windows

# 设置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# 查看配置
git config --list
git config user.name
```

## 2. 文件状态与提交管理 📝

### 文件状态查看
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git status` | 查看工作区状态 | `-s` 简洁输出<br>`--porcelain` 脚本友好格式<br>`-b` 显示分支信息 | 检查文件状态 |
| `git ls-files` | 列出索引中的文件 | `--cached` 暂存区文件<br>`--deleted` 已删除文件<br>`--modified` 已修改文件 | 查看跟踪文件 |
| `git diff` | 查看差异 | `--cached` 暂存区差异<br>`--staged` 同--cached<br>`--name-only` 仅显示文件名 | 比较文件变化 |

### 文件操作
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git add` | 添加文件到暂存区 | `.` 添加所有文件<br>`-A` 添加所有变更<br>`-p` 交互式添加<br>`-u` 仅添加已跟踪文件 | 准备提交 |
| `git rm` | 删除文件 | `--cached` 仅从暂存区删除<br>`-r` 递归删除目录<br>`-f` 强制删除 | 移除文件 |
| `git mv` | 移动/重命名文件 | 无特殊参数 | 重命名文件 |
| `git restore` | 恢复文件 | `--staged` 取消暂存<br>`--worktree` 恢复工作区 | 撤销修改 |

### 提交管理
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git commit` | 提交暂存区内容 | `-m "message"` 提交信息<br>`-a` 自动暂存已跟踪文件<br>`--amend` 修改最后一次提交<br>`-v` 显示差异 | 保存变更 |
| `git commit --fixup` | 创建修复提交 | `<commit>` 指定要修复的提交 | 修复历史提交 |
| `git commit --squash` | 创建压缩提交 | `<commit>` 指定要压缩的提交 | 合并提交准备 |

### 实用场景
```bash
# 快速提交所有变更
git add . && git commit -m "feat: 添加新功能"

# 修改最后一次提交信息
git commit --amend -m "fix: 修正提交信息"

# 修改最后一次提交内容（添加遗漏文件）
git add forgotten_file.txt
git commit --amend --no-edit

# 撤销文件的暂存状态
git restore --staged <file>
git reset HEAD <file>  # 旧版本命令

# 撤销工作区的修改
git restore <file>
git checkout -- <file>  # 旧版本命令

# 交互式添加文件部分内容
git add -p <file>
```

## 3. 版本历史与回退 🔄

### 历史查看
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git log` | 查看提交历史 | `--oneline` 单行显示<br>`--graph` 图形化显示<br>`-n <num>` 限制显示数量<br>`--since="2 weeks ago"` 时间过滤 | 查看项目历史 |
| `git log --follow` | 跟踪文件历史 | `<file>` 指定文件 | 查看文件变更历史 |
| `git show` | 显示提交详情 | `<commit-id>` 指定提交<br>`--stat` 显示统计信息<br>`--name-only` 仅显示文件名 | 查看具体提交 |
| `git blame` | 查看文件修改记录 | `-L <start>,<end>` 指定行范围<br>`-w` 忽略空白字符 | 追踪代码作者 |
| `git shortlog` | 按作者分组的提交摘要 | `-n` 按提交数排序<br>`-s` 仅显示统计 | 生成变更日志 |

### 高级历史查看
```bash
# 美化的提交历史
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

# 查看某个文件的修改历史
git log --follow -p <file>

# 查看两个分支的差异
git log master..feature-branch

# 查看某个作者的提交
git log --author="John Doe"

# 查看包含特定关键词的提交
git log --grep="bug fix"

# 查看某个时间段的提交
git log --since="2023-01-01" --until="2023-12-31"
```

### 版本回退与重置
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git reset` | 重置到指定状态 | `--soft` 保留工作区和暂存区<br>`--mixed` 保留工作区<br>`--hard` 完全重置 | 撤销提交 |
| `git revert` | 创建反向提交 | `--no-edit` 不编辑提交信息<br>`-n` 不自动提交 | 安全撤销 |
| `git checkout` | 切换分支或恢复文件 | `<file>` 恢复文件<br>`<commit> -- <file>` 恢复到指定版本 | 恢复文件 |
| `git reflog` | 查看引用日志 | `--all` 显示所有引用 | 恢复丢失提交 |

### 回退场景示例
```bash
# 撤销最后一次提交，保留修改
git reset --soft HEAD~1

# 撤销最后一次提交，不保留修改
git reset --hard HEAD~1

# 撤销最后3次提交
git reset --hard HEAD~3

# 恢复到指定提交
git reset --hard <commit-id>

# 创建反向提交来撤销
git revert HEAD
git revert <commit-id>

# 恢复误删的提交
git reflog
git reset --hard <commit-id>
```

## 4. 分支管理策略 🌿

### 分支基础操作
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git branch` | 分支管理 | `-a` 显示所有分支<br>`-r` 显示远程分支<br>`-d` 删除分支<br>`-D` 强制删除<br>`-m` 重命名分支 | 管理分支 |
| `git checkout` | 切换分支 | `-b` 创建并切换<br>`-` 切换到上一个分支<br>`-t` 跟踪远程分支 | 分支切换 |
| `git switch` | 切换分支(新命令) | `-c` 创建并切换<br>`-` 切换到上一个分支 | 现代分支切换 |
| `git branch --set-upstream-to` | 设置上游分支 | `origin/<branch>` 指定远程分支 | 关联远程分支 |

### 分支合并与变基
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git merge` | 合并分支 | `--no-ff` 禁用快进合并<br>`--squash` 压缩合并<br>`--abort` 中止合并 | 整合分支 |
| `git rebase` | 变基操作 | `-i` 交互式变基<br>`--onto` 指定新基点<br>`--abort` 中止变基<br>`--continue` 继续变基 | 整理提交历史 |
| `git cherry-pick` | 挑选提交 | `-n` 不自动提交<br>`-x` 记录原提交信息 | 选择性合并 |

### 分支工作流示例
```bash
# 创建并切换到新分支
git checkout -b feature/user-auth
git switch -c feature/user-auth  # 新命令

# 查看所有分支
git branch -a

# 重命名分支
git branch -m old-name new-name

# 删除本地分支
git branch -d feature/completed-feature
git branch -D feature/abandoned-feature  # 强制删除

# 删除远程分支
git push origin --delete feature/old-feature

# 设置上游分支
git branch --set-upstream-to=origin/main main

# 合并分支（保留合并记录）
git checkout main
git merge --no-ff feature/user-auth

# 压缩合并（将多个提交合并为一个）
git merge --squash feature/user-auth
git commit -m "feat: 添加用户认证功能"

# 变基合并（线性历史）
git checkout feature/user-auth
git rebase main
git checkout main
git merge feature/user-auth

# 交互式变基（整理提交历史）
git rebase -i HEAD~3

# 挑选特定提交
git cherry-pick <commit-id>
```

## 5. 远程仓库协作 🌐

### 远程仓库管理
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git remote` | 管理远程仓库 | `-v` 显示详细信息<br>`add <name> <url>` 添加远程仓库<br>`remove <name>` 删除远程仓库<br>`rename <old> <new>` 重命名 | 配置远程仓库 |
| `git remote show` | 显示远程仓库信息 | `<remote-name>` 指定远程仓库 | 查看远程状态 |
| `git remote prune` | 清理远程分支引用 | `<remote-name>` 指定远程仓库 | 清理无效引用 |

### 数据同步
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git fetch` | 获取远程更新 | `--all` 获取所有远程分支<br>`--prune` 清理无效引用<br>`--tags` 获取标签 | 同步远程数据 |
| `git pull` | 拉取并合并 | `--rebase` 使用变基合并<br>`--ff-only` 仅快进合并<br>`--no-ff` 禁用快进 | 更新本地分支 |
| `git push` | 推送到远程 | `-u` 设置上游分支<br>`--force-with-lease` 安全强推<br>`--tags` 推送标签<br>`--delete` 删除远程分支 | 发布更改 |

### 协作场景
```bash
# 添加远程仓库
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# 查看远程仓库
git remote -v
git remote show origin

# 首次推送并设置上游
git push -u origin main

# 获取远程更新但不合并
git fetch origin
git fetch --all

# 拉取并合并
git pull origin main
git pull --rebase origin main  # 使用变基

# 推送到远程
git push origin feature-branch

# 安全的强制推送
git push --force-with-lease origin main

# 推送标签
git push --tags
git push origin v1.0.0

# 删除远程分支
git push origin --delete feature-branch

# 清理本地的远程分支引用
git remote prune origin
```

## 6. 标签管理 🏷️

### 标签操作
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git tag` | 标签管理 | `-a` 创建注释标签<br>`-d` 删除标签<br>`-l` 列出标签<br>`-f` 强制创建 | 版本标记 |
| `git tag -l` | 列出标签 | `"v1.*"` 模式匹配 | 查找特定标签 |
| `git show <tag>` | 显示标签信息 | 无特殊参数 | 查看标签详情 |
| `git push --tags` | 推送标签 | `--follow-tags` 仅推送注释标签 | 发布版本 |

### 标签使用示例
```bash
# 创建轻量标签
git tag v1.0.0

# 创建带注释的标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 为历史提交创建标签
git tag -a v0.9.0 <commit-id> -m "Version 0.9.0"

# 列出所有标签
git tag
git tag -l "v1.*"

# 查看标签信息
git show v1.0.0

# 推送标签到远程
git push origin v1.0.0
git push --tags

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0

# 检出标签（创建分支）
git checkout -b version-1.0.0 v1.0.0
```

## 7. 暂存与恢复 💾

### 暂存操作
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git stash` | 暂存当前工作 | `push -m "message"` 添加描述<br>`-u` 包含未跟踪文件<br>`-a` 包含所有文件 | 临时保存工作 |
| `git stash list` | 列出暂存列表 | 无特殊参数 | 查看暂存记录 |
| `git stash pop` | 恢复并删除暂存 | `stash@{n}` 指定暂存 | 恢复工作状态 |
| `git stash apply` | 恢复但保留暂存 | `stash@{n}` 指定暂存 | 重复使用暂存 |
| `git stash drop` | 删除暂存 | `stash@{n}` 指定暂存 | 清理暂存 |
| `git stash clear` | 清空所有暂存 | 无特殊参数 | 清理所有暂存 |

### 暂存使用场景
```bash
# 暂存当前工作
git stash
git stash push -m "临时保存：修复bug前的工作状态"

# 暂存包含未跟踪文件
git stash -u

# 查看暂存列表
git stash list

# 恢复最新的暂存
git stash pop

# 恢复指定的暂存
git stash apply stash@{1}

# 查看暂存内容
git stash show
git stash show -p stash@{1}

# 删除特定暂存
git stash drop stash@{1}

# 清空所有暂存
git stash clear

# 从暂存创建分支
git stash branch new-feature stash@{1}
```

## 8. 子模块管理 📦

### 子模块操作
| 命令 | 功能说明 | 常用参数 | 使用场景 |
|------|----------|----------|----------|
| `git submodule add` | 添加子模块 | `<url> <path>` 指定URL和路径 | 引入外部项目 |
| `git submodule init` | 初始化子模块 | 无特殊参数 | 初始化配置 |
| `git submodule update` | 更新子模块 | `--recursive` 递归更新<br>`--remote` 更新到远程最新 | 同步子模块 |
| `git submodule foreach` | 对所有子模块执行命令 | `<command>` 指定命令 | 批量操作 |

### 子模块使用示例
```bash
# 添加子模块
git submodule add https://github.com/user/library.git libs/library

# 克隆包含子模块的项目
git clone --recursive https://github.com/user/project.git

# 初始化和更新子模块
git submodule init
git submodule update

# 更新子模块到最新版本
git submodule update --remote

# 对所有子模块执行命令
git submodule foreach git pull origin main

# 删除子模块
git submodule deinit libs/library
git rm libs/library
```

## 9. 实用技巧与别名配置 ⚡

### 推荐别名配置
```bash
# 基础别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# 高级别名
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.ll "log --oneline --graph --decorate --all"
git config --global alias.ls "log --pretty=format:'%C(yellow)%h %C(blue)%ad %C(red)%d %C(reset)%s %C(green)[%cn]' --decorate --date=short"
git config --global alias.hist "log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short"

# 实用别名
git config --global alias.amend 'commit --amend --no-edit'
git config --global alias.uncommit 'reset --soft HEAD~1'
git config --global alias.unstage 'reset HEAD --'
git config --global alias.discard 'checkout --'
git config --global alias.graph 'log --graph --oneline --decorate --all'
git config --global alias.aliases "config --get-regexp '^alias\.'"
```

### .gitignore 常用模板
```bash
# 依赖目录
node_modules/
vendor/
bower_components/

# 构建输出
dist/
build/
out/
target/
*.min.js
*.min.css

# 日志文件
*.log
logs/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 系统文件
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE配置
.vscode/
.idea/
*.swp
*.swo
*~
.project
.classpath
.settings/

# 环境配置
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 缓存文件
.cache/
.parcel-cache/
.next/
.nuxt/

# 测试覆盖率
coverage/
*.lcov

# 临时文件
*.tmp
*.temp
.tmp/
```

### Git钩子示例
```bash
# 提交前检查（.git/hooks/pre-commit）
#!/bin/sh
# 运行代码检查
npm run lint
if [ $? -ne 0 ]; then
    echo "代码检查失败，请修复后再提交"
    exit 1
fi

# 提交信息检查（.git/hooks/commit-msg）
#!/bin/sh
# 检查提交信息格式
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'
if ! grep -qE "$commit_regex" "$1"; then
    echo "提交信息格式错误，请使用: type(scope): description"
    exit 1
fi
```

## 10. 常见问题解决方案 🔧

### 典型场景处理

**撤销最后一次提交但保留更改**
```bash
git reset --soft HEAD~1
```

**修改已推送的提交信息**
```bash
git commit --amend -m "新的提交信息"
git push --force-with-lease
```

**合并多个提交**
```bash
git rebase -i HEAD~3  # 合并最近3个提交
# 在编辑器中将pick改为squash
```

**解决合并冲突**
```bash
# 查看冲突文件
git status

# 手动解决冲突后
git add <resolved-file>
git commit

# 或者中止合并
git merge --abort
```

**恢复误删的分支**
```bash
# 查找分支最后的commit
git reflog

# 恢复分支
git checkout -b <branch-name> <commit-id>
```

**清理本地分支**
```bash
# 删除已合并的分支
git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d

# 删除远程已删除的本地分支
git remote prune origin
```

**撤销git add**
```bash
# 撤销所有暂存
git reset HEAD

# 撤销特定文件暂存
git reset HEAD <file>
```

**修改历史提交**
```bash
# 交互式变基修改历史
git rebase -i HEAD~3

# 修改特定提交
git commit --fixup <commit-id>
git rebase -i --autosquash HEAD~3
```

## 11. 高级技巧 🎯

### 搜索与查找
```bash
# 在提交历史中搜索代码
git log -S "function_name" --source --all

# 搜索提交信息
git log --grep="bug fix" --oneline

# 查找引入bug的提交
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

# 查找文件中的关键词
git grep "TODO" HEAD~5
```

### 性能优化
```bash
# 清理不必要的文件和优化仓库
git gc --aggressive --prune=now

# 查看仓库大小
git count-objects -vH

# 清理reflog
git reflog expire --expire=now --all
git gc --prune=now
```

### 工作流集成
```bash
# 设置Git Flow
git flow init

# 开始新功能
git flow feature start new-feature

# 完成功能
git flow feature finish new-feature

# 开始发布
git flow release start 1.0.0
git flow release finish 1.0.0
```

## 12. 学习资源推荐 📚

### 官方资源
- **官方文档**: [Git官方文档](https://git-scm.com/doc)
- **Pro Git书籍**: [Pro Git](https://git-scm.com/book)
- **Git教程**: [Git Tutorial](https://git-scm.com/docs/gittutorial)

### 交互式学习
- **Learn Git Branching**: [learngitbranching.js.org](https://learngitbranching.js.org/)
- **Git Immersion**: [gitimmersion.com](http://gitimmersion.com/)
- **Atlassian Git教程**: [atlassian.com/git/tutorials](https://www.atlassian.com/git/tutorials)

### 速查手册
- **Git Cheat Sheet**: [education.github.com](https://education.github.com/git-cheat-sheet-education.pdf)
- **Visual Git Cheat Sheet**: [ndpsoftware.com](http://ndpsoftware.com/git-cheatsheet.html)

### 进阶阅读
- 《Pro Git》书籍 - Scott Chacon & Ben Straub
- 《Git版本控制管理》- Jon Loeliger & Matthew McCullough
- 《Git权威指南》- 蒋鑫

---

💡 **小贴士**: 建议将常用命令设置为别名，并定期练习分支操作和冲突解决，这样能大大提升日常开发效率！

🔖 **快速查找**: 使用 `Ctrl+F` 搜索特定命令或功能关键词，快速定位所需内容。

⚡ **效率提升**: 掌握这些命令后，建议学习Git Flow工作流和语义化提交规范，进一步提升团队协作效率。
