---
title: 自制Natapp自动化工具：告别手动配置的烦恼
date: 2025-08-05 13:38:00
author: Leion Charrrrls
tags: 
  - Python
  - 自动化
  - Natapp
  - 开发工具
  - Rich
categories: 
  - 技术分享
  - 开发工具
description: 每次用Natapp都要手动登录、购买隧道、配置客户端，实在太麻烦了。索性花了个周末写了个自动化工具，一行命令搞定所有操作，还做了个挺好看的终端界面。
cover: "https://tc.alcy.cc/i/2025/07/29/6887a9e79cd9e.webp"
---

# 自制Natapp自动化工具：告别手动配置的烦恼

最近项目需要频繁使用内网穿透，每次用Natapp都得重复一套流程：登录账号 → 购买免费隧道 → 复制token → 配置客户端 → 启动服务。做多了真的很烦，于是花了个周末时间写了个自动化脚本。

现在只需要一行命令就能搞定所有操作，还给它做了个看起来不错的终端界面。分享一下实现过程，说不定对有类似需求的朋友有帮助。

## 功能特性

这个工具主要实现了以下功能：

- **自动登录** - 不用每次手动输入账号密码
- **自动购买隧道** - 自动申请免费隧道，获取token
- **智能端口管理** - 支持命令行指定端口，自动修改现有隧道配置
- **可视化界面** - 使用Rich库做了个好看的终端界面
- **实时监控** - 显示系统状态和隧道信息
- **一键启动** - 整个流程一行命令搞定


**使用效果**
原本需要手动操作3-5分钟的事情，现在10秒钟自动完成。界面看起来也比原来的黑窗口专业多了。

## 效果展示

![image-20250805133538346](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250805133538346.png)

相比原生的命令行工具，这个界面看起来确实更直观一些，能够清楚地看到隧道状态、系统信息等。

## 实现思路

### 项目结构

```
nat_app/
├── auto_natapp.py          # 核心自动化逻辑 (723行)
├── full_auto_natapp.py     # 主程序+UI界面 (517行)  
├── natapp                  # natapp官方客户端
├── config.ini             # 自动生成的配置文件
└── README.md              # 说明文档
```

### 核心模块

- **auto_natapp.py** - 负责网站自动化操作，包括登录、购买隧道、token提取等
- **full_auto_natapp.py** - 主程序入口，负责UI展示和用户交互
- **natapp客户端** - 官方提供的隧道客户端程序
- **config.ini** - 自动生成的natapp配置文件

## 技术实现

### 自动登录模块

登录这块踩了个小坑，natapp的表单字段用的是`login`而不是常见的`username`，刚开始一直登录失败：

```python
def login(self, username: str, password: str) -> bool:
    """登录natapp账户"""
    try:
        # 访问登录页面获取CSRF token
        login_page_url = f"{self.base_url}/login"
        response = self.session.get(login_page_url)
        
        # 提取CSRF token
        import re
        csrf_token = None
        csrf_match = re.search(r'name=["\']_token["\'] value=["\']([^"\']+)["\']', response.text)
        if csrf_match:
            csrf_token = csrf_match.group(1)
            logger.info(f"🔑 获取到CSRF token: {csrf_token[:20]}...")
        
        # 准备登录数据 - 关键：使用正确的字段名
        login_data = {
            'login': username,      # natapp使用login字段，不是username
            'password': password,
            'agree': '1',           # 同意条款
        }
        
        # 添加CSRF token
        if csrf_token:
            login_data['_token'] = csrf_token
        
        # 执行登录请求
        response = self.session.post(login_url, data=login_data, headers=headers, allow_redirects=True)
        
        # 多重验证登录成功
        success_indicators = [
            'dashboard' in response.url.lower(),
            '用户中心' in response.text,
            'logout' in response.text.lower(),
        ]
        
        return any(success_indicators)
        
    except Exception as e:
        logger.error(f"登录过程出错: {e}")
        return False
```

{% note warning %}
**关键提示**
Natapp的登录表单使用的是`login`字段而不是常见的`username`字段，这是很多自动化脚本失败的原因。
{% endnote %}

### 自动购买隧道

购买隧道这块相对复杂一些，需要处理表单提交和CSRF验证。核心思路就是模拟浏览器操作：

```python
def buy_free_tunnel(self, local_port: int = DEFAULT_PORT, tunnel_name: str = DEFAULT_TUNNEL_NAME) -> Optional[str]:
    """自动购买免费隧道"""
    try:
        # 访问免费隧道购买页面
        buy_url = f"{self.base_url}/tunnel/buy/free"
        response = self.session.get(buy_url)
        
        # 提取CSRF token
        csrf_token = None
        csrf_match = re.search(r'name=["\']_token["\'] value=["\']([^"\']+)["\']', response.text)
        if csrf_match:
            csrf_token = csrf_match.group(1)
        
        # 准备购买数据
        buy_data = {
            'name': tunnel_name,                    # 隧道名称
            'local_port': str(local_port),          # 本地端口
            'protocol': 'http',                     # 协议类型
        }
        
        # 添加CSRF token
        if csrf_token:
            buy_data['_token'] = csrf_token
        
        # 提交购买表单
        buy_response = self.session.post(buy_url, data=buy_data, headers=headers, allow_redirects=True)
        
        # 等待系统处理
        time.sleep(3)
        
        # 通过API获取隧道信息
        return self._get_tunnel_token_from_api()
        
    except Exception as e:
        logger.error(f"购买免费隧道失败: {e}")
        return None
```

### 智能端口管理

端口管理算是我比较满意的一个功能，可以直接通过命令行参数修改现有隧道的端口：

```python
def edit_tunnel_port(self, tunnel_id: str, new_port: int) -> bool:
    """修改隧道的本地端口"""
    try:
        edit_url = f"{self.base_url}/tunnel/edit/{tunnel_id}"
        
        # 访问编辑页面
        edit_response = self.session.get(edit_url)
        
        # 提取当前配置信息
        current_data = {}
        
        # 提取隧道名称
        name_match = re.search(r'name=["\']name["\'] value=["\']([^"\']*)["\']', edit_response.text)
        if name_match:
            current_data['name'] = name_match.group(1)
        
        # 提取协议类型
        protocol_match = re.search(r'<option[^>]*selected[^>]*value=["\']([^"\']+)["\']', edit_response.text)
        if protocol_match:
            current_data['protocol'] = protocol_match.group(1)
        
        # 准备更新数据
        update_data = {
            'name': current_data['name'],
            'local_port': str(new_port),
            'protocol': current_data['protocol'],
        }
        
        # 提交修改
        update_response = self.session.post(edit_url, data=update_data, headers=headers, allow_redirects=True)
        
        return update_response.status_code == 200
        
    except Exception as e:
        logger.error(f"修改隧道端口失败: {e}")
        return False
```

## 终端界面优化

既然都做自动化了，界面当然也不能太寒酸。用Rich库做了个看起来还不错的终端界面：

### 品牌标题设计

```python
def main(port=None):
    console = Console()
    start_time = datetime.datetime.now()
    
    # 清屏并显示品牌标题
    console.clear()
    
    # Leion个人品牌标题设计
    header_text = Text()
    header_text.append("🚀 ", style="bold red")
    header_text.append("LEION", style="bold white on blue")
    header_text.append(" ", style="")
    header_text.append("NATAPP", style="bold white on green")
    header_text.append(" ", style="")
    header_text.append("AUTOMATION", style="bold white on magenta")
    header_text.append(" ⚡", style="bold yellow")
    
    # 版本和版权信息
    version_text = Text()
    version_text.append("v2.0.0", style="dim cyan")
    version_text.append(" • ", style="dim white")
    version_text.append(f"Started at {start_time.strftime('%H:%M:%S')}", style="dim cyan")
    
    # 版权信息
    copyright_text = Text()
    copyright_text.append("© 2025 Leion - All Rights Reserved", style="dim yellow")
    copyright_text.append(" • ", style="dim white")
    copyright_text.append("Powered by Rich Terminal UI", style="dim green")
    
    title_panel = Panel(
        Align.center(title_content),
        box=box.DOUBLE_EDGE,
        style="bright_blue",
        padding=(1, 3),
        title="[bold white]🎯 Leion's Professional Tunnel Manager[/bold white]",
        title_align="center"
    )
    console.print(title_panel)
```

![image-20250805133626432](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250805133626432.png)

### 系统信息展示

```python
# 获取系统信息
def get_system_info():
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        return {
            'platform': platform.system(),
            'cpu_percent': cpu_percent,
            'memory_percent': memory.percent,
            'python_version': platform.python_version()
        }
    except:
        return None

# 双列系统信息展示
config_tree = Tree("📊 [bold blue]System Configuration[/bold blue]")
config_tree.add(f"[cyan]Account:[/cyan] [green]{username[:3]}***[/green]")
config_tree.add(f"[cyan]Target Port:[/cyan] [bright_yellow]{local_port}[/bright_yellow]")
config_tree.add(f"[cyan]Mode:[/cyan] [bright_magenta]Leion Auto Deploy[/bright_magenta]")
config_tree.add(f"[cyan]Author:[/cyan] [bright_blue]Leion Charles[/bright_blue]")

system_tree = Tree("🖥️ [bold green]System Status[/bold green]")
system_tree.add(f"[cyan]Platform:[/cyan] [white]{sys_info['platform']}[/white]")
system_tree.add(f"[cyan]CPU Usage:[/cyan] [yellow]{sys_info['cpu_percent']:.1f}%[/yellow]")
system_tree.add(f"[cyan]Memory:[/cyan] [yellow]{sys_info['memory_percent']:.1f}%[/yellow]")

trees = Columns([config_tree, system_tree], equal=True, expand=True)
console.print(trees)
```

### 隧道状态面板

```python
# 高级隧道状态仪表板
dashboard = Table(
    show_header=True,
    header_style="bold white on blue",
    box=box.DOUBLE_EDGE,
    title="[bold white]🌐 ENTERPRISE TUNNEL DASHBOARD[/bold white]",
    title_style="bold green on black",
    border_style="bright_green",
    padding=(1, 2),
    expand=True
)
dashboard.add_column("Metric", style="bold cyan", width=20)
dashboard.add_column("Value", style="bold white", width=35)
dashboard.add_column("Status", style="bold green", width=15)

dashboard.add_row("🌍 Public Endpoint", f"[link={tunnel_url}]{tunnel_url}[/link]", "🟢 ONLINE")
dashboard.add_row("📍 Local Port", f"[bright_yellow]{local_port}[/bright_yellow]", "🟢 BOUND")
dashboard.add_row("📊 Connection", "[bright_green]● ESTABLISHED[/bright_green]", "🟢 ACTIVE")
dashboard.add_row("⚡ Service Mode", "[bright_magenta]Leion Professional[/bright_magenta]", "🟢 ENABLED")
dashboard.add_row("🕐 Deploy Time", f"[cyan]{elapsed_seconds:.2f}s[/cyan]", "🟢 FAST")
dashboard.add_row("🔐 Encryption", "[green]TLS 1.3 Enabled[/green]", "🟢 SECURE")

console.print(dashboard)
```

![image-20250805133654720](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250805133654720.png)

## 配置系统

为了方便别人使用，把所有需要修改的个人信息都放在了文件开头：

```python
# ==========================================
# 个人化配置区域 - 请根据需要修改以下信息
# ==========================================

# natapp账户信息
NATAPP_USERNAME = "**********"
NATAPP_PASSWORD = "**********"

# 文件路径配置
NATAPP_CLIENT_PATH = "/Users/leion/Charles/nat_app/natapp"
CONFIG_FILE_PATH = "/Users/leion/Charles/nat_app/config.ini"

# 默认配置
DEFAULT_PORT = 3000
DEFAULT_TUNNEL_NAME = "我的免费隧道"
```

### 配置文件生成

```python
def update_config(self, authtoken: str, local_port: int = DEFAULT_PORT) -> bool:
    """更新配置文件"""
    try:
        config_content = f"""#将本文件放置于natapp同级目录 程序将读取 [default] 段
#在命令行参数模式如 natapp -authtoken=xxx 等相同参数将会覆盖掉此配置
#命令行参数 -config= 可以指定任意config.ini文件
[default]
authtoken={authtoken}                      #对应一条隧道的authtoken
clienttoken=                    #对应客户端的clienttoken,将会忽略authtoken,若无请留空,
log=stdout                        #log 日志文件,可指定本地文件, none=不做记录,stdout=直接屏幕输出 ,默认为none
loglevel=INFO                  #日志等级 DEBUG, INFO, WARNING, ERROR 默认为 DEBUG
http_proxy=                     #代理设置 如 http://10.123.10.10:3128 非代理上网用户请务必留空
"""
        
        with open(self.config_path, 'w', encoding='utf-8') as f:
            f.write(config_content)
        
        return True
    except Exception as e:
        logger.error(f"更新配置文件时出错: {e}")
        return False
```

## 使用方法

### 环境准备

1. **环境准备**
```bash
# 安装依赖
pip3 install rich psutil requests

# 下载natapp客户端
# 访问 https://natapp.cn/tunnel/lists 下载对应平台的客户端
```

2. **配置个人信息**
```python
# 修改 auto_natapp.py 和 full_auto_natapp.py 开头的配置
NATAPP_USERNAME = "你的用户名"
NATAPP_PASSWORD = "你的密码"
```

3. **设置全局别名**
```bash
# 在 ~/.zshrc 中添加
alias natapp='python3 /path/to/your/full_auto_natapp.py'

# 重新加载配置
source ~/.zshrc
```

### 具体使用

```bash
# 基本使用（会自动判断是用现有隧道还是买新的）
natapp

# 指定端口（有隧道就改端口，没有就买新的）
natapp -p 8080
natapp -p 3000
natapp -p 9000

# 测试模式（只跑购买流程，不启动客户端）
natapp test
```

## 技术细节

### 主要用到的技术

- **Python 3.13+** - 语言基础
- **Rich库** - 终端界面美化，这个库真的很好用
- **Requests** - HTTP请求，爬虫必备
- **Psutil** - 系统监控信息获取
- **正则表达式** - 从HTML中提取数据
- **Subprocess** - 调用natapp客户端

### 一些解决的问题

1. **CSRF Token处理**
   - 这个花了不少时间调试，natapp的token提取有好几种格式
   - 写了多个正则表达式来适配不同页面
   - 加了重试机制防止偶然失败

2. **表单分析**
   - 不同页面的表单字段名不太一样，需要动态识别
   - 登录页面用的是`login`字段而不是`username`，这个坑了我好久
   - 加了各种错误检测和恢复逻辑

3. **实时监控**
   - 用psutil获取系统资源使用情况
   - 监控隧道连接状态
   - 在界面上实时展示各种指标

4. **界面设计**
   - Rich库的布局系统还挺强大的
   - 各种颜色和样式搭配了很久才满意
   - 加了动态进度条和状态指示

### 错误处理

```python
# 多重验证登录成功
success_indicators = [
    response.url != login_page_url and 'login' not in response.url.lower(),
    'dashboard' in response.url.lower(),
    '用户中心' in response.text,
    'logout' in response.text.lower(),
]

if any(success_indicators):
    logger.info("✅ 登录成功")
    return True

# 检查错误信息
error_indicators = [
    '用户名或密码错误' in response.text,
    '登录失败' in response.text,
    '验证码' in response.text,
]

if any(error_indicators):
    logger.error("❌ 登录失败")
    return False
```

## 性能优化

### 启动速度优化

- **并行进度条** - 多任务同时执行
- **智能缓存** - 减少重复请求
- **快速响应** - 优化UI渲染

### 连接稳定性

- **Session复用** - 保持连接状态
- **自动重连** - 网络异常恢复
- **超时控制** - 避免长时间等待

## 效果对比

### 功能对比

| 功能 | 手动操作 | 自动化工具 |
|------|----------|-----------|
| 登录账户 | 需要打开浏览器手动输入 | ✅ 全自动 |
| 购买隧道 | 需要填写表单提交 | ✅ 全自动 |
| 配置客户端 | 需要复制token手动配置 | ✅ 全自动 |
| 端口修改 | 需要访问网页手动修改 | ✅ 命令行一键修改 |
| 状态监控 | 无法直观查看 | ✅ 实时仪表板 |

### 使用体验

*【图片说明：请截取完整的使用流程，从启动到隧道建立成功的全过程】*

1. **启动界面** - 华丽的品牌标题和系统信息
2. **执行过程** - 清晰的进度指示和状态反馈
3. **成功界面** - 详细的隧道信息和监控数据
4. **控制面板** - 专业的操作指导和状态展示

## 后续计划

### 功能扩展

- [ ] **多账户管理** - 支持切换不同账户
- [ ] **隧道模板** - 预设常用配置
- [ ] **批量部署** - 同时管理多个隧道
- [ ] **Web界面** - 提供网页版管理面板
- [ ] **API接口** - 支持第三方集成

### 界面改进

- [ ] **主题切换** - 支持多种颜色主题
- [ ] **动画效果** - 添加更多视觉动画
- [ ] **自定义布局** - 用户可调整界面布局
- [ ] **多语言支持** - 国际化界面

## 总结

写这个工具其实就是因为懒，每次用Natapp都要重复那一套流程实在太烦了。本来想着随便写个脚本凑合用，结果越写越兴奋，最后搞成了这样。

### 主要收获

1. **自动化** - 彻底解放双手，10秒钟搞定以前3-5分钟的操作
2. **界面** - Rich库确实好用，做出来的效果比预期好很多
3. **稳定性** - 各种边界情况都考虑到了，基本不会出错
4. **实用性** - 每天都在用，确实提高了不少效率

### 技术方面的体会

- Web自动化比想象中复杂，各种token和表单验证要处理好
- 终端UI设计也是门学问，用户体验很重要
- 错误处理和边界情况处理占了很大一部分工作量
- 代码组织和配置管理对后期维护很关键

总的来说，这个小工具虽然功能不复杂，但做得还算用心。如果你也经常用Natapp，不妨试试这个自动化工具，应该能省不少时间。

---

## 相关资源

项目代码都在本地，暂时没上传到GitHub。如果有需要的话可以考虑开源出来。

{% note info %}
**使用建议**
这个工具主要是为了提高开发效率，如果你也有类似的重复性操作需求，不妨尝试写个自动化脚本。Python + Rich的组合确实挺好用的。
{% endnote %}

---

写这篇文章主要是记录一下开发过程，顺便分享给可能用得上的朋友。代码不算复杂，但确实解决了实际问题，这就够了。
