#!/usr/bin/env node

/**
 * 批量更新博客文章封面图片脚本
 * 使用方法: node tools/update-covers.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const POSTS_DIR = path.join(__dirname, '../source/_posts');
const COVER_IMAGES = [
  '/img/covers/tech-1.jpg',
  '/img/covers/tech-2.jpg',
  '/img/covers/tech-3.jpg',
  '/img/covers/nature-1.jpg',
  '/img/covers/nature-2.jpg',
  '/img/covers/abstract-1.jpg'
];

// 获取随机封面图片
function getRandomCover() {
  return COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)];
}

// 更新单个文件的封面
function updatePostCover(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已有cover字段
    if (content.includes('cover:')) {
      console.log(`跳过 ${path.basename(filePath)} - 已有封面`);
      return;
    }
    
    // 在front-matter中添加cover字段
    const frontMatterEnd = content.indexOf('---', 3);
    if (frontMatterEnd === -1) {
      console.log(`跳过 ${path.basename(filePath)} - 无效的front-matter`);
      return;
    }
    
    const beforeFrontMatter = content.substring(0, frontMatterEnd);
    const afterFrontMatter = content.substring(frontMatterEnd);
    
    const coverLine = `cover: ${getRandomCover()}\n`;
    const newContent = beforeFrontMatter + coverLine + afterFrontMatter;
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ 更新 ${path.basename(filePath)} 封面: ${coverLine.trim()}`);
    
  } catch (error) {
    console.error(`❌ 更新 ${path.basename(filePath)} 失败:`, error.message);
  }
}

// 批量处理所有文章
function batchUpdateCovers() {
  try {
    const files = fs.readdirSync(POSTS_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`🚀 开始批量更新 ${mdFiles.length} 篇文章的封面...`);
    
    mdFiles.forEach(file => {
      const filePath = path.join(POSTS_DIR, file);
      updatePostCover(filePath);
    });
    
    console.log('🎉 批量更新完成！');
    
  } catch (error) {
    console.error('❌ 批量更新失败:', error.message);
  }
}

// 执行批量更新
if (require.main === module) {
  batchUpdateCovers();
}

module.exports = { batchUpdateCovers, updatePostCover };
