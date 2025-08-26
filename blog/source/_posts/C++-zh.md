---
title: C++笔记
slug: C++ notebook
tags:
  - C++
categories:
  - 笔记
cover: 'https://tc.alcy.cc/i/2025/07/29/6887a9118d4d8.webp'
description: C++笔记
abbrlink: 
date: 2025-08-26 14:00:06
---

## 目录

- [环境设置](#环境设置)
  - [概念：环境初始化](#概念-环境初始化)
- [String 类](#string-类)
  - [函数：`substr`](#函数-substr)
  - [函数：`erase`](#函数-erase)
  - [函数：`reverse`](#函数-reverse)
- [Vector 类](#vector-类)
  - [概念：`vector` 长度](#概念-vector-长度)
  - [概念：`vector` 最大值](#概念-vector-最大值)
  - [概念：创建指定大小的 `vector<bool>`](#概念-创建指定大小的-vector-bool)
  - [概念：创建空的 `int` 向量并添加元素](#概念-创建空的-int-向量并添加元素)
  - [概念：创建包含无穷大值的 `int` 向量](#概念-创建包含无穷大值的-int-向量)
  - [概念：对 `vector` 进行排序](#概念-对-vector-进行排序)
  - [概念：删除 `vector` 中的重复元素](#概念-删除-vector-中的重复元素)
  - [函数：`reverse`](#函数-reverse)
  - [函数：`remove`](#函数-remove)
  - [函数：`fill`](#函数-fill)
- [算法](#算法)
  - [概念：动态规划求解 LIS](#概念-动态规划求解-lis)
  - [概念：二分查找优化 LIS](#概念-二分查找优化-lis)

## 环境设置

### 概念：环境初始化
- **用途**：初始化 C++ 编译环境。
- **核心用法**：`%%clangpp -std=c++17 -O2 -- 1 2 3`
- **说明**：
    - `%%clangpp`: Jupyter Notebook 中的魔法命令，用于编译和运行 C++ 代码。
    - `-std=c++17`: 指定 C++ 语言标准为 C++17。
    - `-O2`: 优化级别，O2 表示进行中等程度的优化。
    - `-- 1 2 3`: 传递给程序的命令行参数。

```cpp
#include <iostream>

int main(int argc, char* argv[]) {
    std::cout << "Hello, C++!" << std::endl;
    if (argc > 1) {
        std::cout << "Arguments: ";
        for (int i = 1; i < argc; ++i) {
            std::cout << argv[i] << " ";
        }
        std::cout << std::endl;
    }
    return 0;
}
```

## String 类

### 函数：`substr`
- **用途**：提取字符串的子字符串。
- **核心用法**：`substr(pos, len)` 和 `substr(pos)`
- **参数**：
    - `pos`: 起始下标
    - `len`: 提取长度（可省略，表示到末尾）
- **返回**：提取到的子串
- **说明**：`pos` 从 0 开始；若 `pos > size` 抛出 `out_of_range`

```cpp
string str = "Hello world";
string sub1 = str.substr(6, 5); // "world"
string sub2 = str.substr(6);   // "world"
```

### 函数：`erase`
- **用途**：删除字符串中的字符。
- **核心用法**：`erase(pos, len)`、`erase(pos)`、`erase(iterator)`、`erase(first, last)`
- **参数**：
    - `pos`: 删除起始位置
    - `len`: 删除长度
    - `it`: 指向要删除字符的迭代器
    - `first`, `last`: 删除范围的起始和结束迭代器（开区间）
- **返回**：经过删除操作后的字符串引用
- **说明**：使用迭代器删除时需注意迭代器失效问题

```cpp
string s = "Hello world";
s.erase(5, 6); // "Hello"

s = "Hello world";
s.erase(5);    // "Hello"

s = "Hello";
s.erase(s.begin() + 1); // "Hlo"

s = "Hello world";
s.erase(s.begin() + 5, s.begin() + 11); // "Hello"
```

### 函数：`reverse`
- **用途**：反转容器中元素的顺序。
- **核心用法**：`reverse(container.begin(), container.end())`

```cpp
#include <algorithm>
string s = "Hello";
reverse(s.begin(), s.end()); // "olleH"
```

## Vector 类

### 概念：`vector` 长度
- **用途**：获取 `vector` 中元素的个数。
- **核心用法**：`vec.size()`
- **返回**：元素个数 (`size_t`)
- **说明**：O(1)

```cpp
vector<int> vec = {1, 2, 3, 4, 5};
size_t n = vec.size(); // 5
```

### 概念：`vector` 最大值
- **用途**：查找 `vector` 中的最大值。
- **核心用法**：`*max_element(vec.begin(), vec.end())`
- **注意**：如果 `vector` 为空，行为未定义。

```cpp
vector<int> v = {1, 5, 2, 8, 3};
if (!v.empty()) {
    int max_val = *max_element(v.begin(), v.end()); // 8
}
```

### 概念：创建指定大小的 `vector<bool>`
- **用途**：创建一个指定大小的 `vector<bool>`。
- **核心用法**：`vector<bool> vec(n)` 和 `vector<bool> vec(n, value)`
- **说明**：`vector<bool>` 是一个空间优化的特化版本。

```cpp
vector<bool> v1(10);      // 10个false
vector<bool> v2(10, true); // 10个true
```

### 概念：创建空的 `int` 向量并添加元素
- **用途**：创建一个空的 `int` 类型的 `vector`，并向其中添加元素。
- **核心用法**：`vector<int> vec;` 和 `vec.push_back(element);`

```cpp
vector<int> vec;
vec.push_back(10);
vec.push_back(20);
vec.push_back(30);
// vec is now {10, 20, 30}
```

### 概念：创建包含无穷大值的 `int` 向量
- **用途**：创建一个 `int` 类型的 `vector`，并将元素设置为无穷大。
- **核心用法**：使用 `numeric_limits<int>::max()`。

```cpp
#include <limits>
vector<int> vec(1);
vec[0] = numeric_limits<int>::max();
```

### 概念：对 `vector` 进行排序
- **用途**：对 `vector` 中的元素进行从小到大排序。
- **核心用法**：`sort(vec.begin(), vec.end())`

```cpp
#include <algorithm>
vector<int> vec = {5, 2, 8, 1, 9, 4};
sort(vec.begin(), vec.end());
// vec is now {1, 2, 4, 5, 8, 9}
```

### 概念：删除 `vector` 中的重复元素
- **用途**：删除 `vector` 中的重复元素。
- **核心用法**：先排序，然后使用 `unique` 和 `erase`。

```cpp
#include <algorithm>
vector<int> vec = {5, 2, 2, 8, 1, 5, 9, 4, 4};
sort(vec.begin(), vec.end());
vec.erase(unique(vec.begin(), vec.end()), vec.end());
// vec is now {1, 2, 4, 5, 8, 9}
```

### 函数：`reverse`
- **用途**：反转容器中元素的顺序。
- **核心用法**：`reverse(container.begin(), container.end())`

```cpp
#include <algorithm>
vector<int> v = {1, 2, 3, 4, 5};
reverse(v.begin(), v.end()); // v is now {5, 4, 3, 2, 1}
```

### 函数：`remove`
- **用途**：移除容器中所有等于指定值的元素。
- **核心用法**：`remove(container.begin(), container.end(), value)`
- **说明**：不改变容器大小，需要配合 `erase` 使用。

```cpp
vector<int> v = {1, 2, 3, 2, 4, 2, 5};
auto new_end = remove(v.begin(), v.end(), 2);
v.erase(new_end, v.end());
// v is now {1, 3, 4, 5}
```

### 函数：`fill`
- **用途**：将指定范围内的所有元素设置为给定值。
- **核心用法**：`fill(first, last, value)`

```cpp
vector<int> nums = {1, 2, 3, 4, 5};
fill(nums.begin(), nums.end(), 0);
// nums is now {0, 0, 0, 0, 0}
```

## 算法

### 概念：动态规划求解 LIS
- **用途**：找到给定序列的最长递增子序列的长度。
- **核心思想**：`dp[i]` 表示以 `vec[i]` 结尾的最长递增子序列的长度。
- **时间复杂度**：O(n^2)

```cpp
vector<int> vec = {4, 5, 1, 2, 3};
int n = vec.size();
vector<int> dp(n, 1);
for (int i = 0; i < n; ++i) {
    for (int j = 0; j < i; ++j) {
        if (vec[i] > vec[j]) {
            dp[i] = max(dp[i], dp[j] + 1);
        }
    }
}
int max_length = *max_element(dp.begin(), dp.end()); // 3
```

### 概念：二分查找优化 LIS
- **用途**：使用二分查找优化 LIS 算法。
- **核心思想**：维护一个 `tails` 数组，`tails[i]` 表示长度为 `i+1` 的所有递增子序列中最小的尾部元素。
- **时间复杂度**：O(n log n)

```cpp
vector<int> vec = {10, 9, 2, 5, 3, 7, 101, 18};
vector<int> tails;
for (int num : vec) {
    auto it = lower_bound(tails.begin(), tails.end(), num);
    if (it == tails.end()) {
        tails.push_back(num);
    } else {
        *it = num;
    }
}
int max_length = tails.size(); // 4
```
