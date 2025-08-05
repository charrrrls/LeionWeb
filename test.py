#!/usr/bin/env python3
"""
测试文件 - 用于演示bp命令的代码分析功能
"""

def hello_world():
    """输出Hello World"""
    print("Hello, World!")

def calculate_sum(a, b):
    """计算两个数的和"""
    return a + b

class TestClass:
    """测试类"""
    def __init__(self, name):
        self.name = name
    
    def greet(self):
        return f"Hello, {self.name}!"

if __name__ == "__main__":
    hello_world()
    result = calculate_sum(1, 2)
    print(f"1 + 2 = {result}")