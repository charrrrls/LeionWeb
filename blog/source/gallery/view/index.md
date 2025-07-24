---
title: 图库详情
date: 2025-07-22 14:00:00
type: "gallery-view"
---

<div class="gallery-detail-container">
  <!-- 加载提示 -->
  <div id="loading-indicator" class="loading-indicator">
    <div class="spinner"></div>
    <p>正在加载图片...</p>
  </div>

  <!-- 错误信息 -->
  <div id="error-container" class="error-container" style="display: none;">
    <div class="error-message">
      <h3>⚠️ 加载失败</h3>
      <p id="error-text"></p>
      <button class="retry-btn" onclick="loadGalleryImages()">重试</button>
      <a href="/gallery/" class="back-btn">← 返回图库</a>
    </div>
  </div>

  <!-- 图库头部 -->
  <div id="gallery-header" class="gallery-nav" style="display: none;">
    <a href="/gallery/" class="back-btn">← 返回图库</a>
    <div class="gallery-info">
      <h1 id="gallery-title" class="gallery-title"></h1>
      <p id="gallery-desc" class="gallery-desc"></p>
      <div class="gallery-meta">
        <span id="image-count-info"></span>
        <span class="meta-divider">•</span>
        <span>拍摄于2025年</span>
      </div>
    </div>
  </div>

  <!-- 图片网格 -->
  <div id="photo-grid" class="photo-grid" style="display: none;">
    <!-- 通过JavaScript动态生成 -->
  </div>

  <!-- 图片灯箱 -->
  <div id="lightbox" class="lightbox">
    <div class="lightbox-content">
      <span class="close-btn">&times;</span>
      <img id="lightbox-img" src="" alt="">
      <div class="lightbox-nav">
        <button id="prev-btn">‹</button>
        <button id="next-btn">›</button>
      </div>
      <div class="lightbox-info">
        <p id="image-title"></p>
        <span id="image-counter"></span>
      </div>
    </div>
  </div>
</div>

<style>
.gallery-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 60vh;
  position: relative;
}

/* 优化主要容器的毛玻璃效果 */
.content-inner {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

/* 为整个页面添加背景壁纸 */
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  background-attachment: fixed !important;
  min-height: 100vh !important;
}

/* 替代背景选项 - 柔和渐变 */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, 
    rgba(102, 126, 234, 0.1) 0%, 
    rgba(118, 75, 162, 0.1) 25%, 
    rgba(255, 154, 158, 0.1) 50%, 
    rgba(250, 208, 196, 0.1) 75%, 
    rgba(212, 252, 121, 0.1) 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  z-index: -2;
  pointer-events: none;
}

/* 添加细微的纹理背景 */
body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  background-size: 100% 100%, 80% 80%, 60% 60%;
  animation: float 20s ease-in-out infinite;
  z-index: -1;
  pointer-events: none;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
  33% { transform: translateY(-20px) rotate(5deg); opacity: 0.5; }
  66% { transform: translateY(10px) rotate(-3deg); opacity: 0.8; }
}

/* article-container 毛玻璃效果 */
.article-container {

  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08) !important;
  border-radius: 16px !important;
  padding: 30px !important;
  margin-bottom: 30px !important;
}

/* page 组件优化显示效果 */
.page {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
  border-radius: 24px !important;
  padding: 30px !important;
  transition: all 0.3s ease !important;
}

/* 暗色模式下的page组件 */
[data-theme='dark'] .page {
  background: rgba(18, 18, 18, 0.85) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3) !important;
}

/* photo-grid 容器毛玻璃背景 */
.gallery-detail-container .photo-grid {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
  border-radius: 20px !important;
  padding: 25px !important;
  margin-top: 30px !important;
}

/* 优化container样式 */
.container {
  background: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
}

.container img {
  margin-bottom: 0 !important;
  display: block;
  border-radius: 8px;
}

/* 加载动画 */
.loading-indicator {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #48b1f5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误信息 */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-message {
  text-align: center;
  padding: 50px 30px;
  color: #e74c3c;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(231, 76, 60, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.error-message h3 {
  margin: 0 0 15px 0;
  font-size: 1.8em;
}

.error-message p {
  margin: 0 0 25px 0;
  font-size: 1.1em;
  color: #666;
}

/* 图库头部 */
.gallery-nav {
  margin-bottom: 40px;
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.gallery-nav::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(72, 177, 245, 0.03) 0%, transparent 70%);
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

.back-btn {
  display: inline-block;
  margin-bottom: 20px;
  padding: 12px 25px;
  background: rgba(72, 177, 245, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #48b1f5;
  text-decoration: none;
  border-radius: 25px;
  border: 1px solid rgba(72, 177, 245, 0.3);
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1.1em;
  position: relative;
  z-index: 2;
}

.back-btn:hover {
  background: rgba(72, 177, 245, 0.9);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 177, 245, 0.3);
}

.retry-btn {
  display: inline-block;
  margin: 10px 15px;
  padding: 12px 25px;
  background: rgba(72, 177, 245, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  border: 1px solid rgba(72, 177, 245, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.retry-btn:hover {
  background: rgba(72, 177, 245, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 177, 245, 0.4);
}

.gallery-info {
  text-align: center;
  position: relative;
  z-index: 2;
}

.gallery-title {
  font-size: 3em;
  margin: 15px 0;
  background: linear-gradient(45deg, #48b1f5, #00c4b6, #ff69b4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.gallery-desc {
  font-size: 1.4em;
  color: #666;
  margin: 15px 0;
  line-height: 1.5;
}

.gallery-meta {
  font-size: 1.1em;
  color: #888;
  margin-top: 20px;
}

.meta-divider {
  margin: 0 15px;
  opacity: 0.6;
}

/* 图片网格 - Pinterest风格瀑布流 */
.photo-grid {
  column-count: 3;
  column-gap: 15px;
  margin-top: 30px;
}

.photo-item {
  break-inside: avoid;
  margin-bottom: 15px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.photo-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.photo-item img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
  margin: 0 !important;
  border: none;
  border-radius: 0;
}

.photo-item:hover img {
  transform: scale(1.02);
}

.photo-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  padding: 15px 12px 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.photo-item:hover .photo-info {
  opacity: 1;
}

.photo-info h3 {
  margin: 0 0 5px 0;
  font-size: 0.9em;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.photo-info p {
  margin: 0;
  font-size: 0.8em;
  opacity: 0.9;
}

/* 灯箱样式 */
.lightbox {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.lightbox img {
  max-width: 90%;
  max-height: 80%;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 30px;
  right: 40px;
  font-size: 40px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10001;
}

.close-btn:hover {
  color: #ff69b4;
  transform: scale(1.2);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  pointer-events: none;
  z-index: 10000;
}

.lightbox-nav button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 35px;
  padding: 15px 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: all;
  backdrop-filter: blur(10px);
  font-weight: bold;
}

.lightbox-nav button:hover {
  background: rgba(255, 105, 180, 0.8);
  transform: scale(1.1);
}

.lightbox-info {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px 40px;
  border-radius: 25px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lightbox-info p {
  margin: 0 0 8px 0;
  font-size: 1.2em;
  font-weight: 600;
}

.lightbox-info span {
  font-size: 1em;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .photo-grid {
    column-count: 2;
    column-gap: 12px;
  }
  
  .gallery-title {
    font-size: 2.2em;
  }
  
  .lightbox img {
    max-width: 95%;
    max-height: 70%;
  }
  
  .lightbox-nav {
    padding: 0 20px;
  }
  
  .lightbox-nav button {
    font-size: 28px;
    padding: 12px 16px;
  }
  
  .close-btn {
    top: 20px;
    right: 25px;
    font-size: 35px;
  }
  
  .gallery-nav {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .photo-grid {
    column-count: 1;
    column-gap: 0;
  }
  
  .lightbox-info {
    padding: 15px 25px;
    bottom: 20px;
  }
  
  .gallery-title {
    font-size: 1.8em;
  }
  
  .gallery-desc {
    font-size: 1.2em;
  }
}

/* 全局样式优化 - 防止主题样式干扰 */
body .gallery-detail-container img {
  margin: 0 !important;
  margin-bottom: 0 !important;
  border: none !important;
  box-shadow: none !important;
}

body .gallery-detail-container .photo-item img {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* 防止主题样式影响 */
.gallery-detail-container * {
  box-sizing: border-box;
}

.gallery-detail-container .photo-grid {
  margin: 0 !important;
  padding: 0 !important;
}

.gallery-detail-container .photo-grid .photo-item {
  margin-bottom: 15px !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
}

/* 懒加载图片样式 */
.lazy-load {
  opacity: 0.3;
  transition: opacity 0.5s ease;
  background: #f5f5f5;
}

.lazy-load.loaded {
  opacity: 1;
}

/* 图片加载动画 */
.photo-item {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<script>
// GitHub仓库配置
const GITHUB_CONFIG = {
  owner: 'charrrrls',
  repo: 'mypic',
  apiBase: 'https://api.github.com/repos',
  rawBase: 'https://raw.githubusercontent.com'
};

// 缩略图服务配置
const THUMBNAIL_CONFIG = {
  // 使用GitHub的图片代理服务生成缩略图
  baseUrl: 'https://images.weserv.nl/?url=',
  params: {
    width: 400,
    height: 600, // 增加高度适应瀑布流
    fit: 'inside', // 保持宽高比
    quality: 80
  }
};

// 生成缩略图 URL
function getThumbnailUrl(originalUrl) {
  const encodedUrl = encodeURIComponent(originalUrl);
  const params = `w=${THUMBNAIL_CONFIG.params.width}&h=${THUMBNAIL_CONFIG.params.height}&fit=${THUMBNAIL_CONFIG.params.fit}&q=${THUMBNAIL_CONFIG.params.quality}`;
  return `${THUMBNAIL_CONFIG.baseUrl}${encodedUrl}&${params}`;
}

// 当前图库数据
let currentGallery = {
  folderName: '',
  images: [],
  currentImageIndex: 0
};

// 获取URL参数
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// 获取GitHub仓库内容
async function fetchGitHubContents(path = '') {
  const url = `${GITHUB_CONFIG.apiBase}/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('GitHub API请求失败:', error);
    throw error;
  }
}

// 生成图片标题和描述
function generateImageInfo(filename, folderName, index) {
  const baseName = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
  
  // 根据文件名生成更有意义的标题
  if (baseName.startsWith('IMG_')) {
    const dateMatch = baseName.match(/IMG_(\d{8})_(\d{6})/);
    if (dateMatch) {
      const [, date, time] = dateMatch;
      const year = date.substring(0, 4);
      const month = date.substring(4, 6);
      const day = date.substring(6, 8);
      return {
        title: `${folderName} #${index + 1}`,
        desc: `${year}-${month}-${day}`
      };
    }
  }
  
  return {
    title: `${folderName} #${index + 1}`,
    desc: `${folderName}摄影作品`
  };
}

// 加载图库图片
async function loadGalleryImages() {
  const folderName = getUrlParameter('folder');
  
  if (!folderName) {
    showError('未指定图库文件夹');
    return;
  }
  
  const loadingIndicator = document.getElementById('loading-indicator');
  const errorContainer = document.getElementById('error-container');
  const galleryHeader = document.getElementById('gallery-header');
  const photoGrid = document.getElementById('photo-grid');
  
  try {
    loadingIndicator.style.display = 'block';
    errorContainer.style.display = 'none';
    galleryHeader.style.display = 'none';
    photoGrid.style.display = 'none';
    
    // 获取文件夹中的所有图片
    const contents = await fetchGitHubContents(encodeURIComponent(folderName));
    const imageFiles = contents.filter(item => 
      item.type === 'file' && 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)
    );
    
    if (imageFiles.length === 0) {
      throw new Error(`文件夹 "${folderName}" 中没有找到图片`);
    }
    
    // 生成图片数据
    currentGallery.folderName = folderName;
    currentGallery.images = imageFiles.map((file, index) => {
      const imageInfo = generateImageInfo(file.name, folderName, index);
      return {
        src: `${GITHUB_CONFIG.rawBase}/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/${encodeURIComponent(folderName)}/${encodeURIComponent(file.name)}`,
        title: imageInfo.title,
        desc: imageInfo.desc,
        filename: file.name
      };
    });
    
    // 渲染页面
    renderGalleryHeader(folderName, imageFiles.length);
    renderPhotoGrid(currentGallery.images);
    
    // 显示内容
    loadingIndicator.style.display = 'none';
    galleryHeader.style.display = 'block';
    photoGrid.style.display = 'block';
    
    // 更新页面标题
    document.title = `${folderName} - 摄影图集`;
    
  } catch (error) {
    console.error('加载图库失败:', error);
    showError(error.message);
    loadingIndicator.style.display = 'none';
  }
}

// 渲染图库头部
function renderGalleryHeader(folderName, imageCount) {
  const titleElement = document.getElementById('gallery-title');
  const descElement = document.getElementById('gallery-desc');
  const countElement = document.getElementById('image-count-info');
  
  titleElement.textContent = folderName;
  descElement.textContent = `${folderName}摄影作品集`;
  countElement.textContent = `${imageCount}张照片`;
}

// 渲染图片网格
function renderPhotoGrid(images) {
  const grid = document.getElementById('photo-grid');
  grid.innerHTML = '';
  
  images.forEach((image, index) => {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.style.animationDelay = `${index * 0.05}s`;
    photoItem.onclick = () => openLightbox(index);
    
    // 使用缩略图进行懒加载
    const thumbnailUrl = getThumbnailUrl(image.src);
    
    photoItem.innerHTML = `
      <img 
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0i+WKoOi9veS4rS4uLjwvdGV4dD48L3N2Zz4="
        data-src="${thumbnailUrl}"
        data-original="${image.src}"
        alt="${image.title}" 
        class="lazy-load"
        loading="lazy"
      >
      <div class="photo-info">
        <h3>${image.title}</h3>
        <p>${image.desc}</p>
      </div>
    `;
    
    grid.appendChild(photoItem);
  });
  
  // 初始化懒加载
  initLazyLoading();
}

// 显示错误信息
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  const errorText = document.getElementById('error-text');
  
  errorText.textContent = message;
  errorContainer.style.display = 'flex';
}

// 灯箱功能 - 显示原图
function openLightbox(index) {
  currentGallery.currentImageIndex = index;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('image-title');
  const counter = document.getElementById('image-counter');
  
  const currentImage = currentGallery.images[index];
  // 在灯箱中显示原图
  img.src = currentImage.src;
  title.textContent = currentImage.title;
  counter.textContent = `${index + 1} / ${currentGallery.images.length}`;
  
  lightbox.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function nextImage() {
  currentGallery.currentImageIndex = (currentGallery.currentImageIndex + 1) % currentGallery.images.length;
  openLightbox(currentGallery.currentImageIndex);
}

function prevImage() {
  currentGallery.currentImageIndex = (currentGallery.currentImageIndex - 1 + currentGallery.images.length) % currentGallery.images.length;
  openLightbox(currentGallery.currentImageIndex);
}

// 懒加载功能
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('.lazy-load');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy-load');
          img.classList.add('loaded');
          
          // 加载完成后的回调
          img.onload = function() {
            this.style.opacity = '1';
          };
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // 降级方案
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy-load');
      img.classList.add('loaded');
      img.style.opacity = '1';
    });
  }
}

// 事件监听器
document.addEventListener('DOMContentLoaded', function() {
  loadGalleryImages();
  
  // 灯箱事件
  document.querySelector('.close-btn').onclick = closeLightbox;
  document.getElementById('lightbox').onclick = function(e) {
    if (e.target === this) closeLightbox();
  };
  
  document.getElementById('next-btn').onclick = nextImage;
  document.getElementById('prev-btn').onclick = prevImage;
  
  // 键盘导航
  document.addEventListener('keydown', function(e) {
    if (document.getElementById('lightbox').style.display === 'block') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
  });
});
</script>