---
title: Python虚拟环境venv使用命令大全
slug: venv-usage-commands
author: Leion Charrrrls
cover: 'https://tc.alcy.cc/i/2025/07/29/6887a920c08de.webp'
tags:
  - Python
  - venv
  - 虚拟环境
  - 开发工具
categories:
  - Python开发
description: 实用、不啰嗦的 venv 指南：创建、激活、依赖管理、排雷与部署一篇说清。
toc: true
abbrlink: 4b730665
date: 2025-08-20 16:24:27
---
venv 就是 Python 自带的虚拟环境工具：给项目单独放一套解释器和依赖，互不打扰。用它的目的就两个：不脏全局，依赖可控。下面按“先用会—再优化—再避坑”循序看，能复制就别硬记，够用即可.

## 🧭 目录
- [1. venv 基础](#1-venv-基础)
- [2. 核心命令详解](#2-核心命令详解)
- [3. 高级操作与实用技巧](#3-高级操作与实用技巧)
- [4. 多版本与多环境协作](#4-多版本与多环境协作)
- [5. 常见坑与排雷](#5-常见坑与排雷)
- [6. venv vs 其它工具](#6-venv-vs-其它工具)
- [7. 部署与迁移小贴士](#7-部署与迁移小贴士)
- [8. 速查清单-cheat-sheet](#8-速查清单-cheat-sheet)
- [9. 收个尾](#9-收个尾)

## 1. venv 基础
### 什么是 venv？为什么需要它？

`venv` 是 Python 用于创建轻量级“虚拟环境”的模块。每个虚拟环境都有自己独立的 Python 解释器、库和脚本。

**使用虚拟环境的核心优势：**

- **依赖隔离**：防止不同项目之间的依赖包版本冲突。
- **环境纯净**：保持全局 Python 环境的干净整洁。
- **便于协作**：通过 `requirements.txt` 文件，团队成员可以轻松复制相同的开发环境。

---

## 2. 核心命令详解

### 创建虚拟环境

在你的项目根目录下，使用以下命令创建一个虚拟环境。通常，我们会将虚拟环境命名为 `venv` 或 `.venv`。

```bash
# 将 venv-demo 替换为你的环境名称
python -m venv venv-demo
```

执行后，当前目录下会生成一个 `venv-demo` 文件夹，其中包含了 Python 解释器、标准库和各种支持文件。

### 激活与停用虚拟环境

创建环境后，你需要激活它才能开始使用。

- **Windows 系统:**

  ```powershell
  # 使用 PowerShell 或 CMD
  .\venv-demo\Scripts\activate
  ```

- **macOS / Linux 系统:**

  ```bash
  # 使用 bash 或 zsh
  source venv-demo/bin/activate
  ```

激活成功后，你的命令行提示符前会显示虚拟环境的名称，如 `(venv-demo) ...`。

要退出虚拟环境，只需运行以下命令：

```bash
deactivate
```

### 管理依赖包

在激活的虚拟环境中，你可以使用 `pip` 来管理项目依赖。

- **安装包**:

  ```bash
  pip install requests
  ```

- **查看已安装的包**:

  ```bash
  pip list
  ```

- **生成依赖文件**:
  将当前环境中所有已安装的第三方包及其版本号导出到 `requirements.txt` 文件中，这是项目协作的关键。

  ```bash
  pip freeze > requirements.txt
  ```

- **从文件安装依赖**:
  当新成员加入项目或在另一台机器上部署时，可以使用此命令一键安装所有依赖。

  ```bash
  pip install -r requirements.txt
  ```

---

## 3. 高级操作与实用技巧

### 移除虚拟环境

`venv` 创建的虚拟环境是完全独立的文件夹。要删除一个虚拟环境，只需停用它，然后直接删除对应的文件夹即可。

- **macOS / Linux 系统:**

  ```bash
  # 确保已停用环境
  rm -rf venv-demo
  ```

- **Windows 系统:**
  直接在文件资源管理器中删除 `venv-demo` 文件夹，或使用 `rmdir` 命令。

  ```powershell
  # /s 表示递归删除，/q 表示安静模式
  rmdir /s /q venv-demo
  ```

### 在 `.gitignore` 中忽略虚拟环境

虚拟环境文件夹体积庞大且包含本地配置，**永远不要**将它提交到 Git 仓库。在项目根目录的 `.gitignore` 文件中添加你的虚拟环境文件夹名称。

```gitignore
# .gitignore

# 忽略 venv 虚拟环境
/venv-demo/
```

### 团队协作与项目部署

`venv` 和 `requirements.txt` 是团队协作的黄金搭档。

**标准协作流程：**
1.  项目负责人创建项目，建立 `venv` 环境并安装基础依赖。
2.  负责人执行 `pip freeze > requirements.txt` 并将该文件提交到 Git。
3.  其他成员克隆项目后，在本地创建自己的 `venv` 环境。
4.  激活环境后，执行 `pip install -r requirements.txt` 来同步开发环境。
5.  当有人添加或更新依赖时，需要更新 `requirements.txt` 文件并提交。

这个流程同样适用于服务器部署，确保了生产环境与开发环境的一致性。

## 4. 多版本与多环境协作

有时你机器里同时装了 3.8 / 3.10 / 3.12，想指定版本建环境：

```bash
# macOS / Linux 常见
python3.10 -m venv .venv
python3.12 -m venv .venv-py312

# Windows (安装了官方多版本)
py -3.10 -m venv venv310
py -3.12 -m venv venv312
```

快速切换项目可用命名规范:
- `.venv`：当前项目默认
- `.venv-py310`：区分 Python 版本
- `env.test / env.prod`：区分用途

如果想在 shell 里显示 Python 版本，可在激活后执行：
```bash
python -V
```

## 5. 常见坑与排雷

| 场景 | 现象 | 解决 |
|------|------|------|
| 忘记激活 | 安装包却进了全局 | 看提示符是否有 (venv-name)，无则先激活 |
| Windows PowerShell 提示执行策略限制 | 激活报错 | 以管理员执行: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| requirements.txt 臃肿 | 记录了偶然安装的临时包 | 干净环境重装后再 freeze |
| 复制项目环境失败 | 安装不完整/版本对不上 | 确保同一 Python 主版本，必要时备注 |
| 包版本漂移 | 多机版本不一致 | 锁版本：`requests==2.32.3` |
| pip 源慢 | 下载拖沓 | 临时：`pip install -i https://pypi.tuna.tsinghua.edu.cn/simple 包` |

## 6. venv vs 其它工具

| 工具 | 场景 | 优势 | 不足 |
|------|------|------|
| venv | 标准库内置，轻量 | 无额外依赖 | 不含包版本锁文件机制 |
| virtualenv | 早期方案 | 创建更快(部分场景) | 需单独安装 |
| pipenv | 想要 Pipfile 管理 | 依赖锁 + 简化 | 生态热度下降 |
| poetry | 包发布/管理一体化 | pyproject.toml+锁定 | 比 venv 重 |
| conda | 科学计算/跨语言 | 自带编译包 | 体积大，非官方发行 |

venv 适合：Web 项目 / 轻量脚本 / 教学 / 服务部署主流场景。

## 7. 部署与迁移小贴士

本地到服务器最核心：永远只同步代码 + requirements.txt，不拷贝本地虚拟环境目录。

典型部署流程：
```bash
# 服务器
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

建议：
- 锁版本：生产关键包如 `fastapi==0.111.*`
- 使用 `pip install --no-cache-dir -r requirements.txt` 减少镜像膨胀（容器场景）
- 容器里常见: 基础镜像 + venv（或直接使用系统层，不必重复优化早期包缓存）

## 8. 速查清单 (Cheat Sheet)

```text
创建: python -m venv .venv
激活 (Unix): source .venv/bin/activate
激活 (Win): .\.venv\Scripts\activate
退出: deactivate
安装包: pip install <name>
导出依赖: pip freeze > requirements.txt
还原依赖: pip install -r requirements.txt
删除环境: rm -rf .venv  (Win: rmdir /s /q .venv)
指定版本: python3.12 -m venv .venv-py312
```

## 9. 收个尾

虚拟环境这套流程熟了以后就很机械：进目录 -> 创建 -> 激活 -> 装包 -> freeze。踩坑大多来自“忘激活”和“版本不锁”。后面要升级玩法再看 poetry、uv、容器镜像、CI 缓存加速都行，别一上来全压。现在先把 venv 用扎实，项目干净，后续扩展才不乱。

愿你不再被“依赖冲突”打断思路。👋