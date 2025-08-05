---
title: 'Custom Natapp Automation Tool: Say Goodbye to Manual Configuration Hassles'
slug: natapp-automation-tool
author: Leion Charrrrls
lang: en
tags:
  - Python
  - Automation
  - Natapp
  - Development Tools
  - Rich
categories:
  - Tech Sharing
description: >-
  Every time I use Natapp, I have to manually log in, purchase tunnels, and
  configure the client - it's really too troublesome. So I spent a weekend
  writing an automation tool that handles all operations with one command and
  created a nice-looking terminal interface.
cover: 'https://tc.alcy.cc/i/2025/07/29/6887a9e79cd9e.webp'
abbrlink: 5e7e3e39
date: 2025-08-05 13:38:00
---

# Custom Natapp Automation Tool: Say Goodbye to Manual Configuration Hassles

Recently, my project required frequent use of intranet penetration, and every time I used Natapp, I had to repeat the same process: log in to account → purchase free tunnel → copy token → configure client → start service. It got really annoying after doing it many times, so I spent a weekend writing an automation script.

Now I only need one command to handle all operations, and I even created a nice-looking terminal interface for it. I'm sharing the implementation process - it might be helpful for friends with similar needs.

## Features

This tool mainly implements the following functions:

- **Auto Login** - No need to manually enter account and password every time
- **Auto Purchase Tunnel** - Automatically apply for free tunnels and get tokens
- **Smart Port Management** - Support command-line port specification, automatically modify existing tunnel configurations
- **Visual Interface** - Created a nice terminal interface using Rich library
- **Real-time Monitoring** - Display system status and tunnel information
- **One-click Startup** - Complete the entire process with one command

{% note info %}
**Usage Effect**
What originally took 3-5 minutes of manual operations is now completed automatically in 10 seconds. The interface also looks much more professional than the original black window.
{% endnote %}

## Effect Demo

![image-20250805133538346](https://cdn.jsdelivr.net/gh/charrrrls/mypic@main/uPic/image-20250805133538346.png)

Compared to the native command-line tool, this interface indeed looks more intuitive, clearly showing tunnel status, system information, etc.

## Implementation Approach

### Project Structure

```
nat_app/
├── auto_natapp.py          # Core automation logic (723 lines)
├── full_auto_natapp.py     # Main program + UI interface (517 lines)  
├── natapp                  # Official natapp client
├── config.ini             # Auto-generated configuration file
└── README.md              # Documentation
```

### Core Modules

- **auto_natapp.py** - Handles website automation operations including login, tunnel purchase, token extraction, etc.
- **full_auto_natapp.py** - Main program entry, handles UI display and user interaction
- **natapp client** - Official tunnel client program
- **config.ini** - Auto-generated natapp configuration file

## Technical Implementation

### Auto Login Module

I hit a small snag with login - natapp's form field uses `login` instead of the common `username`, which caused login failures initially:

```python
def login(self, username: str, password: str) -> bool:
    """Login to natapp account"""
    try:
        # Access login page to get CSRF token
        login_page_url = f"{self.base_url}/login"
        response = self.session.get(login_page_url)
        
        # Extract CSRF token
        import re
        csrf_token = None
        csrf_match = re.search(r'name=["\']_token["\'] value=["\']([^"\']+)["\']', response.text)
        if csrf_match:
            csrf_token = csrf_match.group(1)
            logger.info(f"🔑 Got CSRF token: {csrf_token[:20]}...")
        
        # Prepare login data - Key: use correct field name
        login_data = {
            'login': username,      # natapp uses login field, not username
            'password': password,
            'agree': '1',           # Agree to terms
        }
        
        # Add CSRF token
        if csrf_token:
            login_data['_token'] = csrf_token
        
        # Execute login request
        response = self.session.post(login_url, data=login_data, headers=headers, allow_redirects=True)
        
        # Multiple verification for successful login
        success_indicators = [
            'dashboard' in response.url.lower(),
            '用户中心' in response.text,
            'logout' in response.text.lower(),
        ]
        
        return any(success_indicators)
        
    except Exception as e:
        logger.error(f"Login process error: {e}")
        return False
```

{% note warning %}
**Key Tip**
Natapp's login form uses the `login` field instead of the common `username` field, which is why many automation scripts fail.
{% endnote %}

### Auto Purchase Tunnel

The tunnel purchase part is relatively complex, requiring form submission and CSRF validation. The core idea is to simulate browser operations:

```python
def buy_free_tunnel(self, local_port: int = DEFAULT_PORT, tunnel_name: str = DEFAULT_TUNNEL_NAME) -> Optional[str]:
    """Auto purchase free tunnel"""
    try:
        # Access free tunnel purchase page
        buy_url = f"{self.base_url}/tunnel/buy/free"
        response = self.session.get(buy_url)
        
        # Extract CSRF token
        csrf_token = None
        csrf_match = re.search(r'name=["\']_token["\'] value=["\']([^"\']+)["\']', response.text)
        if csrf_match:
            csrf_token = csrf_match.group(1)
        
        # Prepare purchase data
        buy_data = {
            'name': tunnel_name,                    # Tunnel name
            'local_port': str(local_port),          # Local port
            'protocol': 'http',                     # Protocol type
        }
        
        # Add CSRF token
        if csrf_token:
            buy_data['_token'] = csrf_token
        
        # Submit purchase form
        buy_response = self.session.post(buy_url, data=buy_data, headers=headers, allow_redirects=True)
        
        # Wait for system processing
        time.sleep(3)
        
        # Get tunnel information via API
        return self._get_tunnel_token_from_api()
        
    except Exception as e:
        logger.error(f"Failed to purchase free tunnel: {e}")
        return None
```

### Smart Port Management

Port management is one of the features I'm quite satisfied with - you can directly modify existing tunnel ports through command-line parameters:

```python
def edit_tunnel_port(self, tunnel_id: str, new_port: int) -> bool:
    """Modify tunnel's local port"""
    try:
        edit_url = f"{self.base_url}/tunnel/edit/{tunnel_id}"
        
        # Access edit page
        edit_response = self.session.get(edit_url)
        
        # Extract current configuration information
        current_data = {}
        
        # Extract tunnel name
        name_match = re.search(r'name=["\']name["\'] value=["\']([^"\']*)["\']', edit_response.text)
        if name_match:
            current_data['name'] = name_match.group(1)
        
        # Extract protocol type
        protocol_match = re.search(r'<option[^>]*selected[^>]*value=["\']([^"\']+)["\']', edit_response.text)
        if protocol_match:
            current_data['protocol'] = protocol_match.group(1)
        
        # Prepare update data
        update_data = {
            'name': current_data['name'],
            'local_port': str(new_port),
            'protocol': current_data['protocol'],
        }
        
        # Submit modification
        update_response = self.session.post(edit_url, data=update_data, headers=headers, allow_redirects=True)
        
        return update_response.status_code == 200
        
    except Exception as e:
        logger.error(f"Failed to modify tunnel port: {e}")
        return False
```

## Terminal Interface Optimization

Since I was already doing automation, the interface couldn't be too shabby. I used the Rich library to create a decent-looking terminal interface:

### Brand Title Design

```python
def main(port=None):
    console = Console()
    start_time = datetime.datetime.now()
    
    # Clear screen and display brand title
    console.clear()
    
    # Leion personal brand title design
    header_text = Text()
    header_text.append("🚀 ", style="bold red")
    header_text.append("LEION", style="bold white on blue")
    header_text.append(" ", style="")
    header_text.append("NATAPP", style="bold white on green")
    header_text.append(" ", style="")
    header_text.append("AUTOMATION", style="bold white on magenta")
    header_text.append(" ⚡", style="bold yellow")
    
    # Version and copyright information
    version_text = Text()
    version_text.append("v2.0.0", style="dim cyan")
    version_text.append(" • ", style="dim white")
    version_text.append(f"Started at {start_time.strftime('%H:%M:%S')}", style="dim cyan")
    
    # Copyright information
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

### System Information Display

```python
# Get system information
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

# Dual-column system information display
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

### Tunnel Status Panel

```python
# Advanced tunnel status dashboard
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

## Configuration System

To make it easy for others to use, I put all personal information that needs modification at the beginning of the file:

```python
# ==========================================
# Personalization Configuration Area - Please modify the following information as needed
# ==========================================

# natapp account information
NATAPP_USERNAME = "**********"
NATAPP_PASSWORD = "**********"

# File path configuration
NATAPP_CLIENT_PATH = "/Users/leion/Charles/nat_app/natapp"
CONFIG_FILE_PATH = "/Users/leion/Charles/nat_app/config.ini"

# Default configuration
DEFAULT_PORT = 3000
DEFAULT_TUNNEL_NAME = "My Free Tunnel"
```

### Configuration File Generation

```python
def update_config(self, authtoken: str, local_port: int = DEFAULT_PORT) -> bool:
    """Update configuration file"""
    try:
        config_content = f"""#Place this file in the same directory as natapp, the program will read the [default] section
#In command line parameter mode like natapp -authtoken=xxx, the same parameters will override this configuration
#Command line parameter -config= can specify any config.ini file
[default]
authtoken={authtoken}                      #authtoken corresponding to a tunnel
clienttoken=                    #clienttoken corresponding to client, will ignore authtoken if present, leave empty if none
log=stdout                        #log file, can specify local file, none=no recording, stdout=direct screen output, default is none
loglevel=INFO                  #log level DEBUG, INFO, WARNING, ERROR default is DEBUG
http_proxy=                     #proxy settings like http://10.123.10.10:3128 non-proxy users must leave empty
"""
        
        with open(self.config_path, 'w', encoding='utf-8') as f:
            f.write(config_content)
        
        return True
    except Exception as e:
        logger.error(f"Error updating configuration file: {e}")
        return False
```

## Usage Instructions

### Environment Setup

1. **Environment Preparation**
```bash
# Install dependencies
pip3 install rich psutil requests

# Download natapp client
# Visit https://natapp.cn/tunnel/lists to download the client for your platform
```

2. **Configure Personal Information**
```python
# Modify configuration at the beginning of auto_natapp.py and full_auto_natapp.py
NATAPP_USERNAME = "your_username"
NATAPP_PASSWORD = "your_password"
```

3. **Set Global Alias**
```bash
# Add to ~/.zshrc
alias natapp='python3 /path/to/your/full_auto_natapp.py'

# Reload configuration
source ~/.zshrc
```

### Specific Usage

```bash
# Basic usage (automatically determines whether to use existing tunnel or buy new one)
natapp

# Specify port (modify port if tunnel exists, buy new one if not)
natapp -p 8080
natapp -p 3000
natapp -p 9000

# Test mode (only run purchase process, don't start client)
natapp test
```

## Technical Details

### Main Technologies Used

- **Python 3.13+** - Language foundation
- **Rich library** - Terminal interface beautification, this library is really useful
- **Requests** - HTTP requests, essential for web scraping
- **Psutil** - System monitoring information acquisition
- **Regular Expressions** - Extract data from HTML
- **Subprocess** - Call natapp client

### Some Problems Solved

1. **CSRF Token Handling**
   - This took quite some time to debug, natapp's token extraction has several formats
   - Wrote multiple regular expressions to adapt to different pages
   - Added retry mechanism to prevent occasional failures

2. **Form Analysis**
   - Form field names vary across pages, need dynamic identification
   - Login page uses `login` field instead of `username`, this trapped me for a long time
   - Added various error detection and recovery logic

3. **Real-time Monitoring**
   - Use psutil to get system resource usage
   - Monitor tunnel connection status
   - Display various metrics in real-time on the interface

4. **Interface Design**
   - Rich library's layout system is quite powerful
   - Took a long time to match colors and styles until satisfied
   - Added dynamic progress bars and status indicators

### Error Handling

```python
# Multiple verification for successful login
success_indicators = [
    response.url != login_page_url and 'login' not in response.url.lower(),
    'dashboard' in response.url.lower(),
    '用户中心' in response.text,
    'logout' in response.text.lower(),
]

if any(success_indicators):
    logger.info("✅ Login successful")
    return True

# Check error information
error_indicators = [
    '用户名或密码错误' in response.text,
    '登录失败' in response.text,
    '验证码' in response.text,
]

if any(error_indicators):
    logger.error("❌ Login failed")
    return False
```

## Performance Optimization

### Startup Speed Optimization

- **Parallel Progress Bars** - Multiple tasks execute simultaneously
- **Smart Caching** - Reduce duplicate requests
- **Quick Response** - Optimize UI rendering

### Connection Stability

- **Session Reuse** - Maintain connection state
- **Auto Reconnection** - Network exception recovery
- **Timeout Control** - Avoid long waits

## Effect Comparison

### Feature Comparison

| Feature | Manual Operation | Automation Tool |
|---------|-----------------|-----------------|
| Account Login | Need to open browser and manually input | ✅ Fully automatic |
| Purchase Tunnel | Need to fill form and submit | ✅ Fully automatic |
| Configure Client | Need to copy token and manually configure | ✅ Fully automatic |
| Port Modification | Need to visit webpage and manually modify | ✅ One-click command line modification |
| Status Monitoring | Cannot view intuitively | ✅ Real-time dashboard |

### User Experience

*[Image Description: Please capture the complete usage process from startup to successful tunnel establishment]*

1. **Startup Interface** - Gorgeous brand title and system information
2. **Execution Process** - Clear progress indication and status feedback
3. **Success Interface** - Detailed tunnel information and monitoring data
4. **Control Panel** - Professional operation guidance and status display

## Future Plans

### Feature Extensions

- [ ] **Multi-account Management** - Support switching between different accounts
- [ ] **Tunnel Templates** - Preset common configurations
- [ ] **Batch Deployment** - Manage multiple tunnels simultaneously
- [ ] **Web Interface** - Provide web-based management panel
- [ ] **API Interface** - Support third-party integration

### Interface Improvements

- [ ] **Theme Switching** - Support multiple color themes
- [ ] **Animation Effects** - Add more visual animations
- [ ] **Custom Layout** - Users can adjust interface layout
- [ ] **Multi-language Support** - Internationalized interface

## Summary

I wrote this tool simply because I was lazy - repeating that same process every time I used Natapp was too annoying. Originally wanted to write a quick script to make do, but got more and more excited as I wrote, and ended up with this.

### Main Gains

1. **Automation** - Completely freed my hands, 10 seconds to complete what used to take 3-5 minutes
2. **Interface** - Rich library is indeed useful, the result is much better than expected
3. **Stability** - Considered all kinds of edge cases, basically won't fail
4. **Practicality** - Use it every day, indeed improved efficiency significantly

### Technical Insights

- Web automation is more complex than imagined, need to handle various tokens and form validations properly
- Terminal UI design is also an art, user experience is very important
- Error handling and edge case processing took up a large portion of the work
- Code organization and configuration management are crucial for later maintenance

Overall, although this small tool isn't functionally complex, it was made with care. If you also frequently use Natapp, might as well try this automation tool - it should save quite some time.

---

## Related Resources

The project code is all local, haven't uploaded to GitHub yet. Could consider open-sourcing it if needed.

{% note info %}
**Usage Suggestion**
This tool is mainly for improving development efficiency. If you also have similar repetitive operation needs, consider writing an automation script. The Python + Rich combination is indeed quite useful.
{% endnote %}

---

I wrote this article mainly to record the development process and share it with friends who might find it useful. The code isn't complex, but it indeed solves real problems, and that's enough.