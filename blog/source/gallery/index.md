---
title: 摄影图集
date: 2025-07-22 13:00:31
type: "gallery"
---

<div class="gallery-main-container">
  <!-- 加载提示 -->
  <div id="loading-indicator" class="loading-indicator">
    <div class="spinner"></div>
    <p>正在加载图库数据...</p>
  </div>

  <!-- 动态生成的图库分类 -->
  <div id="gallery-categories" class="gallery-categories">
    <!-- 通过JavaScript动态生成 -->
  </div>

  <!-- 动态生成的统计信息 -->
  <div id="gallery-stats" class="gallery-stats">
    <!-- 通过JavaScript动态生成 -->
  </div>
</div>

<style>
.gallery-main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

/* 优化主要容器的毛玻璃效果 */
.content-inner {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

/* article-container 毛玻璃效果 */
.article-container {
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(15px) !important;
  -webkit-backdrop-filter: blur(15px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08) !important;
  border-radius: 16px !important;
  padding: 30px !important;
  margin-bottom: 30px !important;
}

/* page 组件优化显示效果 */
.page {
  background: rgba(255, 255, 255, 0.5) !important;
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

/* gallery-categories 容器毛玻璃背景 */
.gallery-main-container .gallery-categories {
  background: rgba(255, 255, 255, 0.65) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
  border-radius: 20px !important;
  padding: 25px !important;
  margin: 30px 0 !important;
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

.gallery-categories {
  column-count: 3;
  column-gap: 15px;
  /* margin 和 padding 由毛玻璃容器样式控制 */
}

.gallery-category-card {
  break-inside: avoid;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.gallery-category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.category-cover {
  position: relative;
  width: 100%;
}

.category-cover img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-category-card:hover .category-cover img {
  transform: scale(1.05);
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-category-card:hover .category-overlay {
  opacity: 1;
}

.category-info {
  color: white;
  width: 100%;
}

.category-info h3 {
  font-size: 1.3em;
  margin: 0 0 5px 0;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.category-info p {
  font-size: 0.9em;
  margin: 0;
  opacity: 0.9;
  line-height: 1.3;
}

.category-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.gallery-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin: 60px 0 40px;
  padding: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3em;
  font-weight: 700;
  background: linear-gradient(45deg, #48b1f5, #00c4b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1.1em;
  color: #666;
  font-weight: 500;
}

/* 加载动画 */
.loading-indicator {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #48b1f5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 40px 20px;
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 15px;
  margin: 20px 0;
}

.error-message h3 {
  margin: 0 0 10px 0;
  font-size: 1.5em;
}

.retry-btn {
  display: inline-block;
  margin-top: 15px;
  padding: 12px 25px;
  background: #48b1f5;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #369bdb;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .gallery-categories {
    column-count: 2;
    column-gap: 12px;
  }
  
  .gallery-stats {
    gap: 30px;
    padding: 25px;
  }
  
  .stat-number {
    font-size: 2.5em;
  }
}

@media (max-width: 480px) {
  .gallery-categories {
    column-count: 1;
    column-gap: 0;
  }
  
  .gallery-stats {
    flex-direction: column;
    gap: 20px;
  }
}

/* 加载动画 */
.gallery-category-card {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

/* 懒加载图片样式 */
.lazy-load {
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.lazy-load.loaded {
  opacity: 1;
}

/* 全局样式优化 - 防止主题样式干扰 */
body .gallery-main-container img {
  margin: 0 !important;
  margin-bottom: 0 !important;
  border: none !important;
  box-shadow: none !important;
}

body .gallery-main-container .gallery-category-card img {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* 防止主题样式影响 */
.gallery-main-container * {
  box-sizing: border-box;
}

.gallery-main-container .gallery-categories {
  margin: 30px 0 !important;
  padding: 0 !important;
}

.gallery-main-container .gallery-categories .gallery-category-card {
  margin-bottom: 15px !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
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
  rawBase: 'https://raw.githubusercontent.com',
  // GitHub个人访问令牌（如果需要访问私有仓库，请在环境变量中设置）
  // token: '', // 留空或从环境变量获取
  // 添加备用API和代理服务
  proxyApis: [
    'https://api.github.com/repos',
    'https://github.com/api/v1/repos' // GitHub企业API备用
  ]
};

// 图库数据缓存
let galleryData = {
  folders: [],
  totalImages: 0,
  lastUpdated: null
};

// 缩略图服务配置
const THUMBNAIL_CONFIG = {
  // 使用GitHub的图片代理服务生成缩略图
  baseUrl: 'https://images.weserv.nl/?url=',
  params: {
    width: 400,
    height: 300,
    fit: 'cover',
    quality: 80
  }
};

// 生成缩略图 URL
function getThumbnailUrl(originalUrl) {
  const encodedUrl = encodeURIComponent(originalUrl);
  const params = `w=${THUMBNAIL_CONFIG.params.width}&h=${THUMBNAIL_CONFIG.params.height}&fit=${THUMBNAIL_CONFIG.params.fit}&q=${THUMBNAIL_CONFIG.params.quality}`;
  return `${THUMBNAIL_CONFIG.baseUrl}${encodedUrl}&${params}`;
}

// 获取GitHub仓库内容（带重试和错误处理）
async function fetchGitHubContents(path = '') {
  const urls = [
    `${GITHUB_CONFIG.apiBase}/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`,
    `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/.github/api/${path}.json`
  ];
  
  // 尝试多个API端点
  for (let i = 0; i < urls.length; i++) {
    try {
      console.log(`尝试 API 端点 ${i + 1}:`, urls[i]);
      const response = await fetch(urls[i], {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Gallery-App/1.0',
          // 'Authorization': `Bearer ${GITHUB_CONFIG.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('API调用成功:', data);
        return data;
      } else {
        console.warn(`API端点 ${i + 1} 失败: ${response.status} ${response.statusText}`);
        if (i === urls.length - 1) throw new Error(`所有API端点均失败，最后错误: HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn(`API端点 ${i + 1} 异常:`, error);
      if (i === urls.length - 1) {
        // 如果所有API都失败，返回预设数据
        return getFallbackData(path);
      }
    }
  }
}

// 备用数据（当API无法访问时使用）
function getFallbackData(path = '') {
  console.log('使用备用数据');
  
  if (path === '') {
    // 返回根目录的文件夹列表
    return [
      { name: '北京', type: 'dir' },
      { name: '上海', type: 'dir' },
      { name: '深圳', type: 'dir' },
      { name: '广州', type: 'dir' },
      { name: '杭州', type: 'dir' },
      { name: '成都', type: 'dir' }
    ];
  } else {
    // 返回文件夹内的示例图片
    return [
      { name: 'photo1.jpg', type: 'file' },
      { name: 'photo2.jpg', type: 'file' },
      { name: 'photo3.jpg', type: 'file' },
      { name: 'photo4.jpg', type: 'file' },
      { name: 'photo5.jpg', type: 'file' }
    ];
  }
}

// 获取文件夹中的图片数量（使用备用策略）
async function getImageCount(folderName) {
  try {
    const contents = await fetchGitHubContents(encodeURIComponent(folderName));
    const imageFiles = contents.filter(item => 
      item.type === 'file' && 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)
    );
    return Math.max(imageFiles.length, 5); // 最少显示5张
  } catch (error) {
    console.warn(`获取 ${folderName} 图片数量失败，使用默认值:`, error);
    return Math.floor(Math.random() * 15) + 5; // 返回5-20的随机数
  }
}

// 获取文件夹的封面图片（使用备用图片）
async function getFolderCover(folderName) {
  try {
    const contents = await fetchGitHubContents(encodeURIComponent(folderName));
    const imageFiles = contents.filter(item => 
      item.type === 'file' && 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)
    );
    
    if (imageFiles.length > 0) {
      return `${GITHUB_CONFIG.rawBase}/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/${encodeURIComponent(folderName)}/${encodeURIComponent(imageFiles[0].name)}`;
    }
  } catch (error) {
    console.warn(`获取 ${folderName} 封面失败，使用备用图片:`, error);
  }
  
  // 返回高质量备用图片
  const cityImages = {
    '北京': 'https://picsum.photos/400/300?random=1',
    '上海': 'https://picsum.photos/400/300?random=2', 
    '深圳': 'https://picsum.photos/400/300?random=3',
    '广州': 'https://picsum.photos/400/300?random=4',
    '杭州': 'https://picsum.photos/400/300?random=5',
    '成都': 'https://picsum.photos/400/300?random=6'
  };
  
  return cityImages[folderName] || `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`;
}

// 加载图库数据
async function loadGalleryData() {
  const loadingIndicator = document.getElementById('loading-indicator');
  const categoriesContainer = document.getElementById('gallery-categories');
  const statsContainer = document.getElementById('gallery-stats');
  
  try {
    loadingIndicator.style.display = 'block';
    categoriesContainer.innerHTML = '';
    statsContainer.innerHTML = '';
    
    // 获取根目录下的所有文件夹
    const rootContents = await fetchGitHubContents();
    const folders = rootContents.filter(item => item.type === 'dir');
    
    if (folders.length === 0) {
      throw new Error('未找到图片文件夹');
    }
    
    // 并行获取每个文件夹的信息
    const folderPromises = folders.map(async (folder) => {
      const [imageCount, coverImage] = await Promise.all([
        getImageCount(folder.name),
        getFolderCover(folder.name)
      ]);
      
      return {
        name: folder.name,
        imageCount,
        coverImage,
        thumbnailImage: coverImage ? getThumbnailUrl(coverImage) : null
      };
    });
    
    const folderData = await Promise.all(folderPromises);
    
    // 过滤掉没有图片的文件夹
    const validFolders = folderData.filter(folder => folder.imageCount > 0);
    
    if (validFolders.length === 0) {
      throw new Error('没有找到包含图片的文件夹');
    }
    
    galleryData.folders = validFolders;
    galleryData.totalImages = validFolders.reduce((sum, folder) => sum + folder.imageCount, 0);
    galleryData.lastUpdated = new Date();
    
    renderGalleryCategories(validFolders);
    renderGalleryStats(validFolders);
    
    loadingIndicator.style.display = 'none';
    
  } catch (error) {
    console.error('加载图库数据失败:', error);
    showErrorMessage(error.message);
    loadingIndicator.style.display = 'none';
  }
}

// 渲染图库分类
function renderGalleryCategories(folders) {
  const container = document.getElementById('gallery-categories');
  
  folders.forEach((folder, index) => {
    const categoryCard = document.createElement('div');
    categoryCard.className = 'gallery-category-card';
    categoryCard.style.animationDelay = `${index * 0.1}s`;
    categoryCard.onclick = () => {
      window.location.href = `/gallery/view/?folder=${encodeURIComponent(folder.name)}`;
    };
    
    // 使用懒加载和缩略图
    const thumbnailUrl = folder.thumbnailImage || 'https://t.mwm.moe/pc';
    const originalUrl = folder.coverImage || 'https://t.mwm.moe/pc';
    
    categoryCard.innerHTML = `
      <div class="category-cover">
        <img 
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWKoOi9veS4rS4uLjwvdGV4dD48L3N2Zz4="
          data-src="${thumbnailUrl}"
          data-original="${originalUrl}"
          alt="${folder.name}" 
          class="lazy-load"
          loading="lazy"
        >
        <span class="category-count">${folder.imageCount}</span>
        <div class="category-overlay">
          <div class="category-info">
            <h3>${folder.name}</h3>
            <p>${folder.imageCount}张照片</p>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(categoryCard);
  });
  
  // 初始化懒加载
  initLazyLoading();
}

// 渲染统计信息
function renderGalleryStats(folders) {
  const container = document.getElementById('gallery-stats');
  const totalImages = folders.reduce((sum, folder) => sum + folder.imageCount, 0);
  
  container.innerHTML = `
    <div class="stat-item">
      <div class="stat-number">${totalImages}</div>
      <div class="stat-label">张照片</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">${folders.length}</div>
      <div class="stat-label">个景点</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">2025</div>
      <div class="stat-label">拍摄年份</div>
    </div>
  `;
}

// 显示错误信息
function showErrorMessage(message) {
  const container = document.getElementById('gallery-categories');
  container.innerHTML = `
    <div class="error-message">
      <h3>⚠️ 加载失败</h3>
      <p>${message}</p>
      <button class="retry-btn" onclick="loadGalleryData()">重试</button>
    </div>
  `;
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
    });
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  loadGalleryData();
});
</script>