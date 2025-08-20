---
title: "Python虚拟环境venv使用命令大全"
slug: venv-usage-commands
author: Leion Charrrrls
cover: ""
tags:
  - Python
  - venv
  - 虚拟环境
  - 开发工具
categories:
  - Python开发
password: ''
abbrlink: 
date: 2025-08-20 16:24:27
---

# 🧭 Table of Contents
- [1. venv Basics](#1-venv-basics)
- [2. Core Commands Explained](#2-core-commands-explained)
- [3. Advanced Operations & Practical Tips](#3-advanced-operations--practical-tips)
- [4. Multi-Version & Multi-Environment Collaboration](#4-multi-version--multi-environment-collaboration)
- [5. Common Pitfalls & Troubleshooting](#5-common-pitfalls--troubleshooting)
- [6. venv vs. Other Tools](#6-venv-vs--other-tools)
- [7. Deployment & Migration Tips](#7-deployment--migration-tips)
- [8. Quick Reference Checklist (Cheat Sheet)](#8-quick-reference-checklist--cheat-sheet)
- [9. Conclusion](#9-conclusion)

## 1. venv Basics
### What is venv? Why Do We Need It?

`venv` is a module in Python used for creating lightweight "virtual environments." Each virtual environment has its own independent Python interpreter, libraries, and scripts.

**Key Advantages of Using Virtual Environments:**

- **Dependency Isolation**: Prevents version conflicts between dependencies across different projects.
- **Clean Environment**: Keeps the global Python environment tidy and clean.
- **Easy Collaboration**: Through the `requirements.txt` file, team members can easily replicate the same development environment.

---

## 2. Core Commands Explained

### Creating a Virtual Environment

In your project root directory, use the following command to create a virtual environment. Typically, we name the virtual environment `venv` or `.venv`.

```bash
# Replace venv-demo with your environment name
python -m venv venv-demo
```

After execution, a `venv-demo` folder will be generated in the current directory, containing the Python interpreter, standard library, and various support files.

### Activating and Deactivating the Virtual Environment

After creating the environment, you need to activate it to start using it.

- **Windows System:**

  ```powershell
  # Using PowerShell or CMD
  .\venv-demo\Scripts\activate
  ```

- **macOS / Linux System:**

  ```bash
  # Using bash or zsh
  source venv-demo/bin/activate
  ```

After successful activation, your command-line prompt will display the virtual environment's name, such as `(venv-demo) ...`.

To exit the virtual environment, simply run the following command:

```bash
deactivate
```

### Managing Dependency Packages

Within an activated virtual environment, you can use `pip` to manage project dependencies.

- **Installing Packages**:

  ```bash
  pip install requests
  ```

- **Viewing Installed Packages**:

  ```bash
  pip list
  ```

- **Generating Dependency File**:
  Export all installed third-party packages and their version numbers in the current environment to a `requirements.txt` file. This is key for project collaboration.

  ```bash
  pip freeze > requirements.txt
  ```

- **Installing Dependencies from File**:
  When new members join the project or when deploying on another machine, use this command to install all dependencies at once.

  ```bash
  pip install -r requirements.txt
  ```

---

## 3. Advanced Operations & Practical Tips

### Removing a Virtual Environment

The virtual environment created by `venv` is a completely independent folder. To delete a virtual environment, simply deactivate it and then directly delete the corresponding folder.

- **macOS / Linux System:**

  ```bash
  # Ensure the environment is deactivated
  rm -rf venv-demo
  ```

- **Windows System:**
  Directly delete the `venv-demo` folder in File Explorer or use the `rmdir` command.

  ```powershell
  # /s means recursive deletion, /q means quiet mode
  rmdir /s /q venv-demo
  ```

### Ignoring Virtual Environment in `.gitignore`

Virtual environment folders are large in size and contain local configurations, so **never** commit them to a Git repository. Add your virtual environment folder name to the `.gitignore` file in the project root directory.

```gitignore
# .gitignore

# Ignore venv virtual environment
/venv-demo/
```

### Team Collaboration and Project Deployment

`venv` and `requirements.txt` are the golden搭档 for team collaboration.

**Standard Collaboration Workflow:**
1.  The project lead creates the project, sets up the `venv` environment, and installs basic dependencies.
2.  The lead runs `pip freeze > requirements.txt` and commits this file to Git.
3.  Other members clone the project and create their own `venv` environment locally.
4.  After activating the environment, run `pip install -r requirements.txt` to sync the development environment.
5.  When someone adds or updates dependencies, update the `requirements.txt` file and commit.

This workflow also applies to server deployment, ensuring consistency between production and development environments.

## 4. Multi-Version & Multi-Environment Collaboration

Sometimes you have multiple Python versions installed (e.g., 3.8 / 3.10 / 3.12) and want to specify a version to create an environment:

```bash
# macOS / Linux common
python3.10 -m venv .venv
python3.12 -m venv .venv-py312

# Windows (with official multiple versions installed)
py -3.10 -m venv venv310
py -3.12 -m venv venv312
```

Quick project switching can use naming conventions:
- `.venv`: Default for the current project
- `.venv-py310`: To distinguish Python versions
- `env.test / env.prod`: To distinguish purposes

If you want to display the Python version in the shell, execute after activation:
```bash
python -V
```

## 5. Common Pitfalls & Troubleshooting

| Scenario | Issue | Solution |
|------|------|------|
| Forgot to Activate | Installed packages went to global environment | Check if prompt has (venv-name), activate if not |
| Windows PowerShell Execution Policy Restriction | Activation error | Run as administrator: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Bloated requirements.txt | Records temporarily installed incidental packages | Clean environment and reinstall before freezing |
| Failed Environment Replication | Incomplete installation/version mismatch | Ensure same Python major version, add notes if necessary |
| Package Version Drift | Version inconsistency across machines | Lock versions: `requests==2.32.3` |
| Slow pip Source | Download lag | Temporary: `pip install -i https://pypi.tuna.tsinghua.edu.cn/simple package` |

## 6. venv vs. Other Tools

| Tool | Use Case | Advantages | Disadvantages |
|------|------|------|------|
| venv | Built-in standard library, lightweight | No additional dependencies | No package version lock file mechanism |
| virtualenv | Early solution | Faster creation (in some cases) | Requires separate installation |
| pipenv | Want Pipfile management | Dependency locking + simplified | Decreasing ecosystem popularity |
| poetry | Package publishing/management integration | pyproject.toml + locking | Heavier than venv |
| conda | Scientific computing/cross-language | Built-in compiled packages | Large size, non-official distribution |

venv is suitable for: Web projects / lightweight scripts / teaching / mainstream service deployment scenarios.

## 7. Deployment & Migration Tips

The core principle from local to server: Always only sync code + requirements.txt, never copy the local virtual environment directory.

Typical Deployment Workflow:
```bash
# On server
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Recommendations:
- Lock versions: Critical production packages like `fastapi==0.111.*`
- Use `pip install --no-cache-dir -r requirements.txt` to reduce image bloat (container scenarios)
- Common in containers: Base image + venv (or use system-level directly, no need to optimize early package cache)

## 8. Quick Reference Checklist (Cheat Sheet)

```text
Create: python -m venv .venv
Activate (Unix): source .venv/bin/activate
Activate (Win): .\.venv\Scripts\activate
Deactivate: deactivate
Install package: pip install <name>
Export dependencies: pip freeze > requirements.txt
Restore dependencies: pip install -r requirements.txt
Delete environment: rm -rf .venv  (Win: rmdir /s /q .venv)
Specify version: python3.12 -m venv .venv-py312
```

## 9. Conclusion

Once you get familiar with the virtual environment workflow, it becomes mechanical: enter directory -> create -> activate -> install packages -> freeze. Most pitfalls come from "forgetting to activate" and "unlocked versions." If you want to upgrade your workflow later, you can explore poetry, uv, container images, CI cache acceleration, etc., but don't try everything at once. First, master venv, keep your projects clean, and then expand without chaos.

May you no longer be interrupted by "dependency conflicts." 👋