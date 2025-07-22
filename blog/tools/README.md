# 🛠️ 博客工具集

这个目录包含了用于管理博客的各种工具脚本。

## 📁 文件说明

### `update-covers.js`
批量更新文章封面图片的Node.js脚本

**使用方法：**
```bash
cd blog
node tools/update-covers.js
```

**功能：**
- 为没有封面的文章自动添加随机封面
- 跳过已有封面的文章
- 支持自定义封面图片池

### `test-covers.sh`
测试博客封面图片显示效果的Shell脚本

**使用方法：**
```bash
cd blog
chmod +x tools/test-covers.sh
./tools/test-covers.sh
```

**功能：**
- 清理旧的生成文件
- 重新生成静态文件
- 启动本地服务器进行测试

## ⚠️ 注意事项

1. **不要把这些文件放在 `scripts/` 目录下**
   - Hexo会自动加载 `scripts/` 目录下的所有文件作为Hexo插件
   - 这些工具脚本不是Hexo插件格式，会导致加载错误

2. **运行权限**
   - Shell脚本需要执行权限：`chmod +x tools/test-covers.sh`
   - Node.js脚本可以直接运行：`node tools/update-covers.js`

3. **工作目录**
   - 所有脚本都需要在博客根目录（`blog/`）下运行
   - 脚本会自动检查当前目录是否正确

## 🔧 自定义配置

### 修改封面图片池
编辑 `update-covers.js` 中的 `COVER_IMAGES` 数组：

```javascript
const COVER_IMAGES = [
  '/img/covers/your-image-1.jpg',
  '/img/covers/your-image-2.jpg',
  // 添加更多图片...
];
```

### 修改测试端口
如果需要修改测试端口，编辑 `test-covers.sh` 中的hexo server命令：

```bash
npx hexo server -p 4001  # 使用4001端口
```
