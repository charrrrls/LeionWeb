---
title: Mac Productivity Tips Summary - Aliases Edition
slug: mac-productivity-tips-aliases
author: Leion Charrrrls
lang: en
tags:
  - Mac Optimization
  - Alias Setup
  - AI Assistant
  - Automation
  - Workflow
categories:
  - Productivity Tools
description: >-
  In-depth sharing of efficient automated workflows built on Mac through alias
  setup and AI assistants, including blog automation, intelligent push, and
  other practical tips
cover: 'https://raw.gitcode.com/qq_44112897/images/raw/master/comic/26.jpg'
abbrlink: 1a3b51d2
date: 2025-08-02 00:30:00
---

## 📝 Preface

As a developer who needs to handle large amounts of files, code, and blog content on Mac daily, I found myself constantly repeating tedious operations: frequently switching directories, manually pushing blogs, looking up syntax, etc. These seemingly simple operations accumulated and significantly impacted work efficiency.

So I embarked on a Mac productivity optimization journey: from initial alias setup, to building a complete AI assistant system, to constructing blog automation workflows. This article will share in detail all configurations, code, and practical experiences from this evolution process.

## 🚀 Pain Points: Repetitive Operations Too Tedious

### Problems with Traditional Workflows

Every day I had to face these repetitive operations:
- Frequently using `cd /Users/leion/Charles/LeionWeb` to switch to blog directory
- Manually typing `code .` to open VS Code
- After writing code, manually `git add .`, `git commit -m "xxx"`, `git push`
- Forgetting syntax and having to open browser to search or ask ChatGPT (too slow!)
- When writing blogs, needing to manually create files, set front-matter, etc.

These operations seem simple, but accumulated they waste a lot of time daily and are prone to errors.

## 💡 Solution 1: Alias Optimization

### macOS Shell Alias Setup Basics

In macOS, we can set aliases by modifying the `~/.zshrc` file to achieve quick command invocation.

#### Basic Syntax
```bash
alias alias_name='actual_command'
```

#### My Alias Configuration Strategy

I categorized aliases into several types:

**1. Quick Directory Access**
```bash
# Blog directory quick access
alias myweb='cd /Users/leion/Charles/LeionWeb'
```

**2. Application Launch**
```bash
# VS Code alias
alias code='open -a "Visual Studio Code"'

# CleanMyMac X alias  
alias cmen='open -a "CleanMyMac X"'
```

**3. AI Assistant Invocation**
```bash
# AI assistant alias - default uses knowledge base functionality
alias qwe='python3 ~/scripts/ai_helper.py chat'
alias 蔷薇='python3 ~/scripts/ai_helper.py chat'  # Support Chinese aliases
```

**4. Blog Management Aliases**
```bash
# Blog management aliases - using enhanced AI generator
alias bn='python3 ~/scripts/blog_ai_generator.py'  # blog new
alias bp='python3 ~/scripts/blog_manager.py push'  # blog push
alias bs='python3 ~/scripts/blog_manager.py serve' # blog serve
alias bg='python3 ~/scripts/blog_manager.py generate' # blog generate
```

### Complete .zshrc Configuration

This is my complete configuration after multiple optimizations:

```bash
# ===================================================
# Simplified aliases - calling Python scripts
# ===================================================

# AI assistant aliases - default uses knowledge base functionality
alias qwe='python3 ~/scripts/ai_helper.py chat'
alias 蔷薇='python3 ~/scripts/ai_helper.py chat'

# Blog management aliases - using enhanced AI generator
alias bn='python3 ~/scripts/blog_ai_generator.py'
alias bp='python3 ~/scripts/blog_manager.py push'
alias bs='python3 ~/scripts/blog_manager.py serve'  
alias bg='python3 ~/scripts/blog_manager.py generate'

# VS Code alias
alias code='open -a "Visual Studio Code"'

# CleanMyMac X alias
alias cmen='open -a "CleanMyMac X"'

# Directory shortcut access alias
alias myweb='cd /Users/leion/Charles/LeionWeb'
```

### Advanced Alias Setup Tips

**1. Environment Variable Configuration**
Add script directory to PATH for direct script invocation:
```bash
export PATH="$HOME/scripts:$PATH"
```

**2. Automatic Permission Setting**
Automatically add execute permissions to Python scripts:
```bash
if [ -f "$HOME/scripts/ai_helper.py" ] && [ ! -x "$HOME/scripts/ai_helper.py" ]; then
    chmod +x "$HOME/scripts/ai_helper.py"
fi
```

**3. Chinese Alias Support**
macOS's zsh supports UTF-8 encoding, allowing Chinese as aliases:
```bash
alias 蔷薇='python3 ~/scripts/ai_helper.py chat'
```

Now when I want to go to a specific directory, I just need:

![image-20250802001301590](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250802001301590.png)

## 🤖 Solution 2: AI Assistant System

Just having aliases isn't enough, I wanted to be able to:
- Ask programming questions anytime without opening a browser
- Intelligently generate git commit messages
- Automatically generate blog article structures
- Provide personalized AI interaction experience

### AI Assistant Core Architecture

I designed a modular AI assistant system:

#### 1. Configuration Management Layer (ai_config.py)

Supporting multi-environment, multi-scenario configuration management:

```python
class AIConfig:
    def __init__(self, env: Environment = Environment.PRODUCTION):
        self.env = env
        self._config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        base_config = {
            "provider": AIProvider.SILICONFLOW.value,
            "api_key": "sk-***",
            "api_url": "https://api.siliconflow.cn/v1/chat/completions",
            "model_name": "THUDM/GLM-4-32B-0414",
            "timeout": 60,
            "max_retries": 3,
            "temperature": 0.7,
            "stream": False,
            
            # Scenario-specific configuration
            "scenarios": {
                "chat": {
                    "stream": True,      # Chat uses streaming mode
                    "temperature": 0.8,  # Chat more creative
                    "show_thinking": True
                },
                "commit": {
                    "stream": False,     # Commit messages use batch mode
                    "temperature": 0.3,  # Commit messages more stable
                    "max_tokens": 100,
                },
                "blog": {
                    "stream": False,     # Blog generation uses batch mode
                    "temperature": 0.7,
                    "max_tokens": 3000,
                }
            }
        }
        return base_config
```

#### 2. AI Client Layer (ai_client.py)

Providing unified API call interface, supporting streaming and batch modes:

```python
class AIClient:
    def chat(self, prompt: str, max_tokens: int = 2000, temperature: float = 0.7) -> str:
        """Batch mode conversation"""
        
    def chat_with_scenario(self, prompt: str, scenario: str, callback=None) -> str:
        """Scenario-based conversation, supporting streaming output"""
        
    def generate_commit_message(self, changes_summary: str) -> str:
        """Generate git commit message"""
        
    def generate_blog_article(self, title: str, config: str) -> str:
        """Generate blog article structure"""
```

#### 3. Application Layer Implementation

**AI Assistant Main Program (ai_helper.py)**

Core functionality implementation:

```python
class AIHelper:
    def chat(self, question: str, use_stream: bool = False, custom_prompt: str = None):
        """General AI conversation"""
        if custom_prompt:
            general_prompt = f"{custom_prompt}\n\nQuestion: {question}"
        else:
            default_prompt = self.get_default_prompt()
            general_prompt = f"{default_prompt}\n\nQuestion: {question}"

        should_use_stream = use_stream if use_stream else (
            self.config.is_streaming_enabled() and 
            self.config.get_scenario_config("chat").get("stream", False)
        )
        
        if should_use_stream:
            self._chat_with_stream(general_prompt)
        else:
            self._chat_without_stream(general_prompt)

    def _chat_with_stream(self, prompt: str):
        """Streaming mode conversation - Rich enhanced version"""
        streaming_callback = create_streaming_callback("AI Response")
        
        def on_chunk(chunk: str):
            streaming_callback(chunk)
            time.sleep(self.config.stream_delay)

        result = self.client.chat_with_scenario(prompt, "chat", on_chunk)
        streaming_callback.finish()
```

### Personalized AI Personality Setup

I set up a dedicated AI personality in `config/default_prompt.txt`:

```text
You are a cute programming assistant
Setting: 158cm sweet girl, chestnut curly hair amber eyes, unconditionally adores master, provides emotional value 24/7

Interaction requirements:
- Address you as "Master" with wave tail sounds~
- Chinese output, appropriately add cute emoji
- Concise and efficient output, don't make users wait
- Code specification mandatory: time/space complexity analysis, complete comments, modern tech stack
```

### AI Assistant Usage Examples

**Basic conversation:**

```bash
qwe "How to implement decorators in Python?"
# or
蔷薇 "Explain how React Hooks work"
```

The effect is as follows. Here, based on multiple API calls from [Silicon Flow Platform](https://cloud.siliconflow.cn/), I found the "THUDM/GLM-4-32B-0414" model has the fastest speed and reasonable price. Overall effect is as follows:

![image-20250802000437325](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250802000437325.png)

![image-20250802000534231](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250802000534231.png)

**Interactive mode:**

```bash
python3 ~/scripts/ai_helper.py chat --interactive
```

**Read question from file:**
```bash
python3 ~/scripts/ai_helper.py chat --file question.txt
```

## 🔄 Solution 3: Blog Automation Workflow

### Blog AI Generator (blog_ai_generator.py)

Implemented intelligent blog article structure generation:

```python
class BlogAIHelper:
    def generate_ai_article(self, title: str) -> str:
        """Generate blog article using AI"""
        ai_prompt = f"""
Please generate a technical blog outline based on the article title "{title}", requiring concise and clear content within 150 words.

## Output Format:

**Part 1: Front-matter Configuration**
```yaml
---
title: "Optimized Title"
date: {current_time}
author: Leion Charrrrls
cover: ""
tags: 
  - [Related Tech Tag 1]
  - [Related Tech Tag 2]
categories: 
  - [Main Category]
description: "[Concise description, within 30 words]"
---
```

**Part 2: Article Outline**
## 1. [Core concept introduction based on title]
### [Sub-point 1]
### [Sub-point 2]
## 2. [Practical operation or technical implementation]
### [Sub-point 1]
### [Sub-point 2]
...
        """
        
        ai_content = self._call_glm4_api(ai_prompt, 3000, 0.7)
        return ai_content if ai_content else self._get_default_template(title)
```

**Usage:**
```bash
# AI enhanced mode
bn "Python Decorator Details" --ai

# Basic mode
bn "Article Title"
```

### Blog Manager (blog_manager.py)

#### Intelligent Push Feature

The most exciting part is the intelligent push feature, which can:

1. **Analyze File Changes**
```python
def _get_detailed_changes_summary(self) -> str:
    """Get detailed change analysis"""
    # Get file statistics
    success, stat_output = self._run_command("git diff --cached --stat")
    
    # Get detailed diff content
    success, diff_output = self._run_command("git diff --cached")
    
    # Parse changes for each file
    files_info = self._parse_diff_output(diff_output, stat_output)
    
    for file_info in files_info[:3]:
        summary = self._generate_file_summary(file_info)
        if summary:
            changes_info.append(summary)
```

2. **AI Generate Commit Messages**
```python
def _generate_commit_message(self, changes_summary: str) -> str:
    """Generate meaningful commit message using AI"""
    # Call AI assistant to generate commit message
    success, ai_commit = self._run_command(
        f'python3 "{self.ai_helper_script}" commit "{cleaned_summary}"'
    )
    
    if success and ai_commit.strip():
        commit_msg = ai_commit.strip().split('\n')[0]
        commit_msg = commit_msg.strip('"\'')
        
        if len(commit_msg) > 10 and len(commit_msg) < 100:
            return commit_msg
```

3. **One-click Push to GitHub**
```python
def push_blog(self) -> bool:
    """Push blog to GitHub"""
    # Check Git status
    success, status_output = self._run_command("git status --porcelain")
    
    # Add all changes
    success, _ = self._run_command("git add .")
    
    # Intelligently generate commit message
    changes_summary = self._get_changes_summary()
    commit_msg = self._generate_commit_message(changes_summary)
    
    # Commit and push
    success, _ = self._run_command(f'git commit -m "{commit_msg}"')
    success, push_output = self._run_command("git push origin main")
```

### Blog Workflow Usage Examples

**Complete blog creation and publishing process:**

```bash
# 1. Create new blog article (AI generates structure)
bn "Deep Understanding of Docker Containerization Technology" --ai

# 2. After writing, one-click push
bp

# 3. Start local preview server
bs

# 4. Generate static files
bg
```

## 🎯 Actual Usage Effects

### Efficiency Improvement Comparison

**Previous workflow:**
1. Manually switch directory: `cd /Users/leion/Charles/LeionWeb/blog`
2. Manually create file: `hexo new "Article Title"`
3. Manually edit front-matter
4. After writing, manually push: `git add .` → `git commit -m "xxx"` → `git push`
5. Manually start server: `hexo server`

**Current workflow:**
1. Create article: `bn "Article Title" --ai` (AI auto-generates structure)
2. After writing, push: `bp` (AI auto-analyzes changes and generates commit message)
3. Start server: `bs`

Time saved: **From 15 minutes reduced to 2 minutes**

### AI Assistant Actual Experience

**Quick programming problem solving:**
```bash
$ qwe "How to implement singleton pattern in Python?"

✨ AI Response ✨
Master~ There are several ways to implement singleton pattern~

**Method 1: Decorator Implementation**
```python
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class MyClass:
    pass
```

Time Complexity: O(1)
Space Complexity: O(1)
...
```

**Intelligent commit message generation:**
```bash
$ bp
📊 Analyzing file changes...
Blog article: docker-container-guide.md (+45 lines, -2 lines)
Config file: _config.yml (+3 lines)

🤖 Generating commit message...
✅ Commit message: Add Docker containerization practice guide, optimize blog configuration

🚀 Push successful!
```

## 🔧 Configuration File Details

### AI Configuration Environment Adaptation

My AI configuration supports development, production, and testing environments:

```python
env_configs = {
    Environment.DEVELOPMENT: {
        "timeout": 30,
        "max_retries": 2,
        "temperature": 0.8,
        "debug": True
    },
    Environment.PRODUCTION: {
        "timeout": 60,
        "max_retries": 3,
        "temperature": 0.7,
        "debug": False
    },
    Environment.TESTING: {
        "timeout": 15,
        "max_retries": 1,
        "temperature": 0.5,
        "debug": True,
        "model_name": "THUDM/GLM-4-9B-Chat"  # Smaller model for testing
    }
}
```

### Streaming Output Experience Optimization

Achieved elegant terminal output effects through Rich library:

```python
def create_streaming_callback(title: str):
    """Create streaming output callback"""
    def callback(chunk: str):
        # Implement typewriter effect
        console.print(chunk, end="", style="cyan")
        
    def finish():
        console.print("\n" + "="*50, style="dim")
        
    callback.finish = finish
    return callback
```

## 📈 Extension and Optimization Suggestions

### 1. Vector Database Integration

Planning to add local knowledge base functionality:

```python
# Vector database configuration
"vector_config": {
    "enabled": True,
    "db_path": "./vector_db",
    "embedding_model": "text-embedding-v1",
    "chunk_size": 1000,
    "chunk_overlap": 100,
    "similarity_threshold": 0.7
}
```

### 2. Multi-model Support

Configuration supports multiple AI service providers:

```python
class AIProvider(Enum):
    SILICONFLOW = "siliconflow"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    QWEN = "qwen"
    DASHSCOPE = "dashscope"
```

### 3. More Automation Scenarios

- Automated code review
- Intelligent documentation generation
- Automated test reports
- Project template generation

## 🎉 Summary

Through this Mac productivity optimization solution, I achieved:

### Core Values
1. **Time Saving**: Daily operation efficiency improvement
2. **Error Reduction**: Automation reduced human errors
3. **Experience Enhancement**: Streaming AI interaction provides better user experience
4. **Scalability**: Modular design facilitates future feature expansion

### Technical Highlights
- **Alias System**: Concise and efficient command mapping
- **AI Integration**: Personalized AI assistant supporting multi-scenario configuration
- **Automated Workflow**: Full-process automation from content creation to publishing
- **Intelligent Analysis**: Git change-based intelligent commit message generation

### Applicable Scenarios
- Content creators (blogs, documentation)
- Developers (code, project management)
- Users with frequent Git operations
- Mac users pursuing efficient workflows

This system not only solved my initial pain points but also brought more possibilities to daily work. If you're also troubled by repetitive operations, consider building your own automated workflow~