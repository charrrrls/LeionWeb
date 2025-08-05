---
title: Git Command Line Efficiency Guide
slug: git-command-line-guide
author: Leion Charrrrls
cover: 'https://img.loliapi.com/i/pc/img567.webp'
lang: en
tags:
  - Git
  - Version Control
  - Development Tools
categories:
  - DevOps
description: >-
  Git core commands and efficient workflow practices, essential command quick
  reference for developers
abbrlink: 6524923a
date: 2025-07-24 10:10:05
---

# Master Git Command Line, Boost Development Efficiency 🚀

Git is an indispensable version control tool in modern software development. This article organizes the most commonly used Git commands, categorized by function, for quick reference and learning.

## 1. Repository Initialization & Basic Configuration ⚙️

### Repository Initialization
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git init` | Initialize new Git repository | `--bare` create bare repository<br>`--template=<template_directory>` specify template | Starting new project |
| `git clone <url>` | Clone remote repository | `-b <branch>` specify branch<br>`--depth 1` shallow clone<br>`--recursive` recursively clone submodules | Getting existing project |

### Configuration Management
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git config` | Configure Git settings | `--global` global config<br>`--local` local config<br>`--system` system config | Environment initialization |
| `git config --list` | View all configurations | `--show-origin` show config source | Check configuration status |
| `git config --unset` | Remove configuration | `--global` remove global config | Clean incorrect config |

### Common Configuration Commands
```bash
# Set user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default editor
git config --global core.editor "code --wait"
git config --global core.editor "vim"

# Set default branch name
git config --global init.defaultBranch main

# Set line ending handling
git config --global core.autocrlf input  # Mac/Linux
git config --global core.autocrlf true   # Windows

# Set aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# View configuration
git config --list
git config user.name
```

## 2. File Status & Commit Management 📝

### File Status Check
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git status` | Check working directory status | `-s` short output<br>`--porcelain` script-friendly format<br>`-b` show branch info | Check file status |
| `git ls-files` | List files in index | `--cached` staged files<br>`--deleted` deleted files<br>`--modified` modified files | View tracked files |
| `git diff` | View differences | `--cached` staged differences<br>`--staged` same as --cached<br>`--name-only` show only filenames | Compare file changes |

### File Operations
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git add` | Add files to staging area | `.` add all files<br>`-A` add all changes<br>`-p` interactive add<br>`-u` add only tracked files | Prepare for commit |
| `git rm` | Remove files | `--cached` remove from staging only<br>`-r` recursively remove directory<br>`-f` force remove | Remove files |
| `git mv` | Move/rename files | No special parameters | Rename files |
| `git restore` | Restore files | `--staged` unstage<br>`--worktree` restore working tree | Undo changes |

### Commit Management
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git commit` | Commit staged content | `-m "message"` commit message<br>`-a` auto stage tracked files<br>`--amend` modify last commit<br>`-v` show diff | Save changes |
| `git commit --fixup` | Create fixup commit | `<commit>` specify commit to fix | Fix historical commit |
| `git commit --squash` | Create squash commit | `<commit>` specify commit to squash | Prepare commit merge |

### Practical Scenarios
```bash
# Quick commit all changes
git add . && git commit -m "feat: add new feature"

# Modify last commit message
git commit --amend -m "fix: correct commit message"

# Modify last commit content (add forgotten file)
git add forgotten_file.txt
git commit --amend --no-edit

# Unstage file
git restore --staged <file>
git reset HEAD <file>  # legacy command

# Undo working directory changes
git restore <file>
git checkout -- <file>  # legacy command

# Interactive add partial file content
git add -p <file>
```

## 3. Version History & Rollback 🔄

### History Viewing
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git log` | View commit history | `--oneline` single line display<br>`--graph` graphical display<br>`-n <num>` limit display count<br>`--since="2 weeks ago"` time filter | View project history |
| `git log --follow` | Track file history | `<file>` specify file | View file change history |
| `git show` | Show commit details | `<commit-id>` specify commit<br>`--stat` show statistics<br>`--name-only` show filenames only | View specific commit |
| `git blame` | View file modification record | `-L <start>,<end>` specify line range<br>`-w` ignore whitespace | Track code author |
| `git shortlog` | Commit summary grouped by author | `-n` sort by commit count<br>`-s` show statistics only | Generate changelog |

### Advanced History Viewing
```bash
# Pretty commit history
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

# View file modification history
git log --follow -p <file>

# View differences between branches
git log master..feature-branch

# View commits by author
git log --author="John Doe"

# Search commits with keywords
git log --grep="bug fix"

# View commits in time range
git log --since="2023-01-01" --until="2023-12-31"
```

### Version Rollback & Reset
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git reset` | Reset to specified state | `--soft` keep working tree and staging<br>`--mixed` keep working tree<br>`--hard` complete reset | Undo commits |
| `git revert` | Create reverse commit | `--no-edit` don't edit commit message<br>`-n` don't auto commit | Safe undo |
| `git checkout` | Switch branch or restore file | `<file>` restore file<br>`<commit> -- <file>` restore to specific version | Restore files |
| `git reflog` | View reference log | `--all` show all references | Recover lost commits |

### Rollback Scenario Examples
```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, don't keep changes
git reset --hard HEAD~1

# Undo last 3 commits
git reset --hard HEAD~3

# Reset to specific commit
git reset --hard <commit-id>

# Create reverse commit to undo
git revert HEAD
git revert <commit-id>

# Recover mistakenly deleted commit
git reflog
git reset --hard <commit-id>
```

## 4. Branch Management Strategy 🌿

### Basic Branch Operations
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git branch` | Branch management | `-a` show all branches<br>`-r` show remote branches<br>`-d` delete branch<br>`-D` force delete<br>`-m` rename branch | Manage branches |
| `git checkout` | Switch branch | `-b` create and switch<br>`-` switch to previous branch<br>`-t` track remote branch | Branch switching |
| `git switch` | Switch branch (new command) | `-c` create and switch<br>`-` switch to previous branch | Modern branch switching |
| `git branch --set-upstream-to` | Set upstream branch | `origin/<branch>` specify remote branch | Associate remote branch |

### Branch Merge & Rebase
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git merge` | Merge branch | `--no-ff` disable fast-forward merge<br>`--squash` squash merge<br>`--abort` abort merge | Integrate branches |
| `git rebase` | Rebase operation | `-i` interactive rebase<br>`--onto` specify new base<br>`--abort` abort rebase<br>`--continue` continue rebase | Clean commit history |
| `git cherry-pick` | Pick commits | `-n` don't auto commit<br>`-x` record original commit info | Selective merge |

### Branch Workflow Examples
```bash
# Create and switch to new branch
git checkout -b feature/user-auth
git switch -c feature/user-auth  # new command

# View all branches
git branch -a

# Rename branch
git branch -m old-name new-name

# Delete local branch
git branch -d feature/completed-feature
git branch -D feature/abandoned-feature  # force delete

# Delete remote branch
git push origin --delete feature/old-feature

# Set upstream branch
git branch --set-upstream-to=origin/main main

# Merge branch (preserve merge record)
git checkout main
git merge --no-ff feature/user-auth

# Squash merge (combine multiple commits into one)
git merge --squash feature/user-auth
git commit -m "feat: add user authentication feature"

# Rebase merge (linear history)
git checkout feature/user-auth
git rebase main
git checkout main
git merge feature/user-auth

# Interactive rebase (clean commit history)
git rebase -i HEAD~3

# Cherry-pick specific commits
git cherry-pick <commit-id>
```

## 5. Remote Repository Collaboration 🌐

### Remote Repository Management
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git remote` | Manage remote repositories | `-v` show detailed info<br>`add <name> <url>` add remote repo<br>`remove <name>` remove remote repo<br>`rename <old> <new>` rename | Configure remote repos |
| `git remote show` | Show remote repository info | `<remote-name>` specify remote repo | View remote status |
| `git remote prune` | Clean remote branch references | `<remote-name>` specify remote repo | Clean invalid references |

### Data Synchronization
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git fetch` | Fetch remote updates | `--all` fetch all remote branches<br>`--prune` clean invalid references<br>`--tags` fetch tags | Sync remote data |
| `git pull` | Pull and merge | `--rebase` use rebase merge<br>`--ff-only` fast-forward only<br>`--no-ff` disable fast-forward | Update local branch |
| `git push` | Push to remote | `-u` set upstream branch<br>`--force-with-lease` safe force push<br>`--tags` push tags<br>`--delete` delete remote branch | Publish changes |

### Collaboration Scenarios
```bash
# Add remote repository
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# View remote repositories
git remote -v
git remote show origin

# First push and set upstream
git push -u origin main

# Fetch remote updates without merge
git fetch origin
git fetch --all

# Pull and merge
git pull origin main
git pull --rebase origin main  # use rebase

# Push to remote
git push origin feature-branch

# Safe force push
git push --force-with-lease origin main

# Push tags
git push --tags
git push origin v1.0.0

# Delete remote branch
git push origin --delete feature-branch

# Clean local remote branch references
git remote prune origin
```

## 6. Tag Management 🏷️

### Tag Operations
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git tag` | Tag management | `-a` create annotated tag<br>`-d` delete tag<br>`-l` list tags<br>`-f` force create | Version marking |
| `git tag -l` | List tags | `"v1.*"` pattern matching | Find specific tags |
| `git show <tag>` | Show tag info | No special parameters | View tag details |
| `git push --tags` | Push tags | `--follow-tags` push annotated tags only | Release versions |

### Tag Usage Examples
```bash
# Create lightweight tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Create tag for historical commit
git tag -a v0.9.0 <commit-id> -m "Version 0.9.0"

# List all tags
git tag
git tag -l "v1.*"

# View tag information
git show v1.0.0

# Push tags to remote
git push origin v1.0.0
git push --tags

# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0

# Checkout tag (create branch)
git checkout -b version-1.0.0 v1.0.0
```

## 7. Stashing & Recovery 💾

### Stash Operations
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git stash` | Stash current work | `push -m "message"` add description<br>`-u` include untracked files<br>`-a` include all files | Temporarily save work |
| `git stash list` | List stash entries | No special parameters | View stash records |
| `git stash pop` | Restore and delete stash | `stash@{n}` specify stash | Restore work state |
| `git stash apply` | Restore but keep stash | `stash@{n}` specify stash | Reuse stash |
| `git stash drop` | Delete stash | `stash@{n}` specify stash | Clean stash |
| `git stash clear` | Clear all stashes | No special parameters | Clean all stashes |

### Stash Usage Scenarios
```bash
# Stash current work
git stash
git stash push -m "temporary save: work state before bug fix"

# Stash including untracked files
git stash -u

# View stash list
git stash list

# Restore latest stash
git stash pop

# Restore specific stash
git stash apply stash@{1}

# View stash content
git stash show
git stash show -p stash@{1}

# Delete specific stash
git stash drop stash@{1}

# Clear all stashes
git stash clear

# Create branch from stash
git stash branch new-feature stash@{1}
```

## 8. Submodule Management 📦

### Submodule Operations
| Command | Function | Common Parameters | Use Case |
|---------|----------|-------------------|----------|
| `git submodule add` | Add submodule | `<url> <path>` specify URL and path | Include external project |
| `git submodule init` | Initialize submodule | No special parameters | Initialize configuration |
| `git submodule update` | Update submodule | `--recursive` recursive update<br>`--remote` update to remote latest | Sync submodules |
| `git submodule foreach` | Execute command on all submodules | `<command>` specify command | Batch operations |

### Submodule Usage Examples
```bash
# Add submodule
git submodule add https://github.com/user/library.git libs/library

# Clone project with submodules
git clone --recursive https://github.com/user/project.git

# Initialize and update submodules
git submodule init
git submodule update

# Update submodules to latest version
git submodule update --remote

# Execute command on all submodules
git submodule foreach git pull origin main

# Remove submodule
git submodule deinit libs/library
git rm libs/library
```

## 9. Practical Tips & Alias Configuration ⚡

### Recommended Alias Configuration
```bash
# Basic aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Advanced aliases
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.ll "log --oneline --graph --decorate --all"
git config --global alias.ls "log --pretty=format:'%C(yellow)%h %C(blue)%ad %C(red)%d %C(reset)%s %C(green)[%cn]' --decorate --date=short"
git config --global alias.hist "log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short"

# Practical aliases
git config --global alias.amend 'commit --amend --no-edit'
git config --global alias.uncommit 'reset --soft HEAD~1'
git config --global alias.unstage 'reset HEAD --'
git config --global alias.discard 'checkout --'
git config --global alias.graph 'log --graph --oneline --decorate --all'
git config --global alias.aliases "config --get-regexp '^alias\.'"
```

### .gitignore Common Template
```bash
# Dependencies
node_modules/
vendor/
bower_components/

# Build output
dist/
build/
out/
target/
*.min.js
*.min.css

# Log files
*.log
logs/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# System files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE configuration
.vscode/
.idea/
*.swp
*.swo
*~
.project
.classpath
.settings/

# Environment configuration
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Cache files
.cache/
.parcel-cache/
.next/
.nuxt/

# Test coverage
coverage/
*.lcov

# Temporary files
*.tmp
*.temp
.tmp/
```

### Git Hook Examples
```bash
# Pre-commit check (.git/hooks/pre-commit)
#!/bin/sh
# Run code check
npm run lint
if [ $? -ne 0 ]; then
    echo "Code check failed, please fix before commit"
    exit 1
fi

# Commit message check (.git/hooks/commit-msg)
#!/bin/sh
# Check commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'
if ! grep -qE "$commit_regex" "$1"; then
    echo "Wrong commit message format, please use: type(scope): description"
    exit 1
fi
```

## 10. Common Problem Solutions 🔧

### Typical Scenario Handling

**Undo last commit but keep changes**
```bash
git reset --soft HEAD~1
```

**Modify pushed commit message**
```bash
git commit --amend -m "new commit message"
git push --force-with-lease
```

**Merge multiple commits**
```bash
git rebase -i HEAD~3  # merge last 3 commits
# In editor, change pick to squash
```

**Resolve merge conflicts**
```bash
# View conflict files
git status

# After manually resolving conflicts
git add <resolved-file>
git commit

# Or abort merge
git merge --abort
```

**Recover mistakenly deleted branch**
```bash
# Find branch's last commit
git reflog

# Recover branch
git checkout -b <branch-name> <commit-id>
```

**Clean local branches**
```bash
# Delete merged branches
git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d

# Delete local branches for remote deleted
git remote prune origin
```

**Undo git add**
```bash
# Undo all staging
git reset HEAD

# Undo specific file staging
git reset HEAD <file>
```

**Modify historical commits**
```bash
# Interactive rebase to modify history
git rebase -i HEAD~3

# Modify specific commit
git commit --fixup <commit-id>
git rebase -i --autosquash HEAD~3
```

## 11. Advanced Tips 🎯

### Search & Find
```bash
# Search code in commit history
git log -S "function_name" --source --all

# Search commit messages
git log --grep="bug fix" --oneline

# Find commit that introduced bug
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

# Find keywords in files
git grep "TODO" HEAD~5
```

### Performance Optimization
```bash
# Clean unnecessary files and optimize repository
git gc --aggressive --prune=now

# View repository size
git count-objects -vH

# Clean reflog
git reflog expire --expire=now --all
git gc --prune=now
```

### Workflow Integration
```bash
# Set up Git Flow
git flow init

# Start new feature
git flow feature start new-feature

# Finish feature
git flow feature finish new-feature

# Start release
git flow release start 1.0.0
git flow release finish 1.0.0
```

## 12. Recommended Learning Resources 📚

### Official Resources
- **Official Documentation**: [Git Official Docs](https://git-scm.com/doc)
- **Pro Git Book**: [Pro Git](https://git-scm.com/book)
- **Git Tutorial**: [Git Tutorial](https://git-scm.com/docs/gittutorial)

### Interactive Learning
- **Learn Git Branching**: [learngitbranching.js.org](https://learngitbranching.js.org/)
- **Git Immersion**: [gitimmersion.com](http://gitimmersion.com/)
- **Atlassian Git Tutorials**: [atlassian.com/git/tutorials](https://www.atlassian.com/git/tutorials)

### Quick Reference
- **Git Cheat Sheet**: [education.github.com](https://education.github.com/git-cheat-sheet-education.pdf)
- **Visual Git Cheat Sheet**: [ndpsoftware.com](http://ndpsoftware.com/git-cheatsheet.html)

### Advanced Reading
- "Pro Git" Book - Scott Chacon & Ben Straub
- "Git Version Control Management" - Jon Loeliger & Matthew McCullough
- "Git Authoritative Guide" - Jiang Xin

---

💡 **Tips**: It's recommended to set frequently used commands as aliases and regularly practice branch operations and conflict resolution to greatly improve daily development efficiency!

🔖 **Quick Search**: Use `Ctrl+F` to search for specific commands or functional keywords to quickly locate needed content.

⚡ **Efficiency Boost**: After mastering these commands, consider learning Git Flow workflow and semantic commit conventions to further improve team collaboration efficiency.