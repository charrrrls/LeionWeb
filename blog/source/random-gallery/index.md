---
title: 随机图片画廊
date: 2025-07-24
layout: page
---

<div id="random-gallery-container">
  <div class="gallery-header">
    <h2>✨ 随机图片画廊</h2>
    <p>享受美丽的随机图片，点击图片可复制真实地址～</p>
    <div class="header-controls">
      <button id="refresh-gallery" class="refresh-btn">🔄 刷新图片</button>
      <div class="loading-stats">
        <span id="loaded-count">已加载: 0</span> / 
        <span id="total-count">总计: 0</span>
      </div>
    </div>
  </div>
  
  <div id="loading" class="loading">
    <div class="loader"></div>
    <p>正在智能加载美图中...</p>
    <div class="loading-progress">
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill"></div>
      </div>
      <span id="progress-text">0%</span>
    </div>
  </div>
  
  <div id="gallery-grid" class="pinterest-grid">
    <!-- 图片将通过JS动态懒加载 -->
  </div>
  
  <div class="load-more-container">
    <button id="load-more" class="load-more-btn">加载更多</button>
    <div class="auto-load-trigger" id="auto-load-trigger"></div>
  </div>
</div>

<style>
/* 随机画廊样式 - 优化版 */
#random-gallery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.gallery-header {
  text-align: center;
  margin-bottom: 30px;
}

.gallery-header h2 {
  color: var(--text-color);
  margin-bottom: 10px;
}

.gallery-header p {
  color: var(--text-color-secondary);
  margin-bottom: 20px;
}

.header-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.loading-stats {
  color: var(--text-color-secondary);
  font-size: 14px;
  background: var(--card-bg);
  padding: 8px 15px;
  border-radius: 15px;
  border: 1px solid var(--border-color);
}

.refresh-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
  width: 300px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: 0%;
}

#progress-text {
  font-size: 14px;
  color: var(--text-color-secondary);
  min-width: 40px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pinterest-grid {
  column-count: 2;
  column-gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .pinterest-grid {
    column-count: 1;
  }
}

.gallery-item {
  display: inline-block;
  width: 100%;
  margin-bottom: 20px;
  break-inside: avoid;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  background: var(--card-bg);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* 模糊占位符 */
.gallery-item .image-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(45deg, 
    rgba(102, 126, 234, 0.1) 0%, 
    rgba(118, 75, 162, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.gallery-item .image-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.4), 
    transparent);
  animation: shimmer 2s infinite;
}

.gallery-item .placeholder-icon {
  font-size: 30px;
  color: rgba(102, 126, 234, 0.5);
  z-index: 1;
}

.gallery-item .api-source-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(102, 126, 234, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.gallery-item .api-source-tag.error {
  background: rgba(244, 67, 54, 0.8);
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.gallery-item img {
  width: 100%;
  height: auto;
  display: block;
  transition: all 0.3s ease;
  opacity: 0;
}

.gallery-item img.loaded {
  opacity: 1;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.copy-btn:hover {
  background: white;
  transform: scale(1.05);
}

.api-tag {
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.load-more-container {
  text-align: center;
  margin-top: 30px;
  position: relative;
}

.load-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auto-load-trigger {
  position: absolute;
  bottom: -200px;
  left: 50%;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

/* 骨架屏动画 */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gallery-item:nth-child(even) {
  animation-delay: 0.1s;
}

.gallery-item:nth-child(3n) {
  animation-delay: 0.2s;
}

/* 复制成功提示 */
.copy-success {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #4CAF50;
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  z-index: 9999;
  animation: copyFadeInOut 2s ease-in-out;
  backdrop-filter: blur(10px);
}

@keyframes copyFadeInOut {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

/* 暗色模式适配 */
[data-theme="dark"] .gallery-item {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .gallery-item:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .image-placeholder {
  background: linear-gradient(45deg, 
    rgba(102, 126, 234, 0.2) 0%, 
    rgba(118, 75, 162, 0.2) 100%);
}

/* 性能优化 */
.gallery-item {
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000px;
}

.gallery-item img {
  will-change: opacity, transform;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .header-controls {
    flex-direction: column;
    gap: 15px;
  }
  
  .loading-progress {
    width: 250px;
  }
}
</style>

<script>
class RandomGallery {
  constructor() {
    // 从smart-background.js获取的多个API配置
    this.apis = [
      { name: 't.mwm.moe', url: 'https://t.mwm.moe/pc', weight: 20, maxPerBatch: 2 },
      { name: 'seaya.link', url: 'https://api.seaya.link/web?type=file', weight: 25, maxPerBatch: 2 },
      { name: 't.alcy.cc', url: 'https://t.alcy.cc/fj', weight: 10, maxPerBatch: 2 },
      { name: 'loliapi.com', url: 'https://www.loliapi.com/acg/', weight: 20, maxPerBatch: 2 },
      { name: 'imgapi.xl0408', url: 'https://imgapi.xl0408.top/index.php', weight: 8, maxPerBatch: 2 },
      { name: 'dmoe.cc', url: 'https://www.dmoe.cc/random.php', weight: 5, maxPerBatch: 2 }
      // 移除http协议的API以确保安全性
    ];
    
    this.loadedImages = new Set();
    this.currentPage = 1;
    this.imagesPerLoad = 10; // 总共每页10张图片
    this.isLoading = false;
    this.loadedCount = 0;
    this.totalCount = 0;
    this.imageCache = new Map();
    this.intersectionObserver = null;
    this.autoLoadObserver = null;
    this.preloadQueue = [];
    this.maxConcurrentLoads = 3;
    this.currentLoads = 0;
    this.apiUsageCount = new Map(); // 记录每个API在当前批次的使用次数
    
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.setupAutoLoadObserver();
    this.bindEvents();
    this.loadImages();
  }
  
  setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.intersectionObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px'
    });
  }
  
  setupAutoLoadObserver() {
    this.autoLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoading) {
          this.loadMoreImages();
        }
      });
    }, {
      rootMargin: '200px'
    });
    
    const trigger = document.getElementById('auto-load-trigger');
    if (trigger) {
      this.autoLoadObserver.observe(trigger);
    }
  }
  
  bindEvents() {
    const refreshBtn = document.getElementById('refresh-gallery');
    const loadMoreBtn = document.getElementById('load-more');
    
    refreshBtn?.addEventListener('click', () => this.refreshGallery());
    loadMoreBtn?.addEventListener('click', () => this.loadMoreImages());
    
    window.addEventListener('scroll', this.throttle(() => {
      this.preloadNextBatch();
    }, 300));
  }
  
  // 智能API选择器 - 确保每个API每批次最多使用2次
  selectBalancedAPI() {
    // 过滤出还未达到使用上限的API
    const availableApis = this.apis.filter(api => {
      const usageCount = this.apiUsageCount.get(api.name) || 0;
      return usageCount < api.maxPerBatch;
    });
    
    if (availableApis.length === 0) {
      // 如果所有API都达到上限，重置计数器
      this.apiUsageCount.clear();
      return this.selectWeightedRandomAPI(this.apis);
    }
    
    return this.selectWeightedRandomAPI(availableApis);
  }
  
  // 权重随机选择API
  selectWeightedRandomAPI(apiList) {
    const totalWeight = apiList.reduce((sum, api) => sum + api.weight, 0);
    const random = Math.random() * totalWeight;
    
    let cumulativeWeight = 0;
    for (const api of apiList) {
      cumulativeWeight += api.weight;
      if (random <= cumulativeWeight) {
        return api;
      }
    }
    
    return apiList[0]; // 备用
  }
  
  async loadImages(isRefresh = false) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    const loading = document.getElementById('loading');
    const loadMoreBtn = document.getElementById('load-more');
    
    if (isRefresh) {
      loading.style.display = 'flex';
      this.loadedImages.clear();
      this.imageCache.clear();
      this.apiUsageCount.clear();
      document.getElementById('gallery-grid').innerHTML = '';
      this.currentPage = 1;
      this.loadedCount = 0;
      this.totalCount = 0;
      this.updateStats();
    }
    
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = '智能加载中...';
    
    try {
      // 重置当前批次的API使用计数
      if (!isRefresh) {
        this.apiUsageCount.clear();
      }
      
      const imageUrls = await this.fetchImageUrlsFromMultipleAPIs();
      this.totalCount += imageUrls.length;
      this.updateStats();
      await this.renderImagesWithLazyLoad(imageUrls);
    } catch (error) {
      console.error('加载图片失败:', error);
      this.showError('加载图片失败，请稍后重试');
    }
    
    loading.style.display = 'none';
    this.isLoading = false;
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = '加载更多';
  }
  
  async fetchImageUrlsFromMultipleAPIs() {
    const imageUrls = [];
    const promises = [];
    let completed = 0;
    
    console.log(`🎯 开始从${this.apis.length}个API获取图片...`);
    
    // 为了获取10张图片，我们需要调用5个API，每个API最多2张
    for (let i = 0; i < this.imagesPerLoad; i++) {
      const selectedAPI = this.selectBalancedAPI();
      
      // 更新使用计数
      const currentCount = this.apiUsageCount.get(selectedAPI.name) || 0;
      this.apiUsageCount.set(selectedAPI.name, currentCount + 1);
      
      const url = `${selectedAPI.url}?t=${Date.now()}&r=${Math.random()}&i=${i}&p=${this.currentPage}`;
      
      console.log(`📡 API ${i + 1}: ${selectedAPI.name} (使用次数: ${currentCount + 1}/${selectedAPI.maxPerBatch})`);
      
      promises.push(
        this.fetchSingleImageUrl(url, selectedAPI.name).then(result => {
          completed++;
          this.updateProgress(completed / this.imagesPerLoad * 100);
          return result;
        })
      );
    }
    
    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        imageUrls.push(result.value);
      }
    });
    
    // 显示本批次API使用统计
    this.logAPIUsageStats();
    
    return imageUrls;
  }
  
  async fetchSingleImageUrl(url, apiName) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const realUrl = img.src;
        
        if (this.loadedImages.has(realUrl)) {
          reject('重复图片');
          return;
        }
        
        this.loadedImages.add(realUrl);
        
        this.imageCache.set(realUrl, {
          width: img.naturalWidth,
          height: img.naturalHeight,
          loaded: true,
          apiSource: apiName // 记录图片来源API
        });
        
        resolve({
          url: realUrl,
          apiSource: apiName
        });
      };
      
      img.onerror = () => reject(`图片加载失败 - API: ${apiName}`);
      img.src = url;
    });
  }
  
  async renderImagesWithLazyLoad(imageUrls) {
    const grid = document.getElementById('gallery-grid');
    
    imageUrls.forEach((imageData, index) => {
      const item = this.createImageItem(imageData, index);
      grid.appendChild(item);
      
      // 直接开始加载图片，不等待懒加载
      const img = item.querySelector('img');
      if (img) {
        this.loadImageDirectly(img);
      }
    });
  }
  
  createImageItem(imageData, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = `${index * 0.1}s`;
    
    const cachedInfo = this.imageCache.get(imageData.url);
    const estimatedHeight = cachedInfo ? 
      Math.floor(300 * cachedInfo.height / cachedInfo.width) : 200;
    
    // 添加API来源标识
    const apiSource = imageData.apiSource || 'unknown';
    
    item.innerHTML = `
      <div class="image-placeholder" style="height: ${estimatedHeight}px;">
        <div class="placeholder-icon">🖼️</div>
        <div class="api-source-tag">${apiSource}</div>
      </div>
      <img 
        src="${imageData.url}" 
        alt="随机图片 - ${apiSource}" 
        style="display: none; opacity: 0;"
      >
      <div class="image-overlay">
        <button class="copy-btn" onclick="randomGallery.copyImageUrl('${imageData.url}')">
          📋 复制地址
        </button>
        <div class="api-tag">${apiSource}</div>
      </div>
    `;
    
    return item;
  }
  
  // 直接加载图片，不使用懒加载
  async loadImageDirectly(img) {
    if (this.currentLoads >= this.maxConcurrentLoads) {
      this.preloadQueue.push({img, direct: true});
      return;
    }
    
    this.currentLoads++;
    const container = img.parentElement;
    const placeholder = container.querySelector('.image-placeholder');
    
    img.onload = () => {
      // 图片加载完成，显示图片并隐藏占位符
      img.style.display = 'block';
      
      requestAnimationFrame(() => {
        img.style.opacity = '1';
        
        if (placeholder) {
          placeholder.style.opacity = '0';
          setTimeout(() => {
            if (placeholder && placeholder.parentNode) {
              placeholder.parentNode.removeChild(placeholder);
            }
          }, 300);
        }
      });
      
      this.loadedCount++;
      this.updateStats();
      this.processNextInQueue();
    };
    
    img.onerror = () => {
      // 加载失败时显示错误占位符
      if (placeholder) {
        placeholder.innerHTML = `
          <div class="placeholder-icon">❌</div>
          <div class="api-source-tag error">加载失败</div>
        `;
        placeholder.style.background = 'rgba(244, 67, 54, 0.1)';
      }
      this.processNextInQueue();
    };
    
    // 如果图片已经加载完成（缓存），立即触发onload
    if (img.complete && img.naturalHeight !== 0) {
      img.onload();
    }
  }
  
  async loadImage(img) {
    if (this.currentLoads >= this.maxConcurrentLoads) {
      this.preloadQueue.push({img, direct: false});
      return;
    }
    
    this.currentLoads++;
    const imageSrc = img.dataset.src;
    const container = img.parentElement;
    const placeholder = container.querySelector('.image-placeholder');
    
    try {
      const newImg = new Image();
      
      newImg.onload = () => {
        img.src = imageSrc;
        img.style.display = 'block';
        
        requestAnimationFrame(() => {
          img.classList.add('loaded');
          if (placeholder) {
            placeholder.style.opacity = '0';
            setTimeout(() => {
              if (placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
              }
            }, 300);
          }
        });
        
        this.loadedCount++;
        this.updateStats();
        this.processNextInQueue();
      };
      
      newImg.onerror = () => {
        if (placeholder) {
          placeholder.innerHTML = '<div class="placeholder-icon">❌</div>';
          placeholder.style.background = 'rgba(244, 67, 54, 0.1)';
        }
        this.processNextInQueue();
      };
      
      newImg.src = imageSrc;
      
    } catch (error) {
      console.error('图片加载错误:', error);
      this.processNextInQueue();
    }
  }
  
  processNextInQueue() {
    this.currentLoads--;
    
    if (this.preloadQueue.length > 0) {
      const next = this.preloadQueue.shift();
      if (typeof next === 'object' && next.img) {
        // 新格式：{img, direct}
        if (next.direct) {
          this.loadImageDirectly(next.img);
        } else {
          this.loadImage(next.img);
        }
      } else {
        // 旧格式：直接是img元素
        this.loadImage(next);
      }
    }
  }
  
  preloadNextBatch() {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    
    if (scrollPercent > 0.8 && !this.isLoading) {
      this.prefetchNextBatch();
    }
  }
  
  async prefetchNextBatch() {
    try {
      // 从不同API预取少量图片
      for (let i = 0; i < 3; i++) {
        const randomAPI = this.apis[Math.floor(Math.random() * this.apis.length)];
        const url = `${randomAPI.url}?t=${Date.now()}&r=${Math.random()}&prefetch=true`;
        const img = new Image();
        img.src = url;
      }
    } catch (error) {
      // 静默失败
    }
  }
  
  // 记录API使用统计
  logAPIUsageStats() {
    console.log('📊 本批次API使用统计:');
    this.apiUsageCount.forEach((count, apiName) => {
      console.log(`  ${apiName}: ${count}张图片`);
    });
  }
  
  updateProgress(percent) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill && progressText) {
      progressFill.style.width = `${percent}%`;
      progressText.textContent = `${Math.round(percent)}%`;
    }
  }
  
  updateStats() {
    const loadedCountEl = document.getElementById('loaded-count');
    const totalCountEl = document.getElementById('total-count');
    
    if (loadedCountEl && totalCountEl) {
      loadedCountEl.textContent = `已加载: ${this.loadedCount}`;
      totalCountEl.textContent = `总计: ${this.totalCount}`;
    }
  }
  
  async copyImageUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      this.showCopySuccess();
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showCopySuccess();
    }
  }
  
  showCopySuccess() {
    const successMsg = document.createElement('div');
    successMsg.className = 'copy-success';
    successMsg.textContent = '✅ 图片地址已复制到剪贴板！';
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
      if (document.body.contains(successMsg)) {
        document.body.removeChild(successMsg);
      }
    }, 2000);
  }
  
  showError(message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'copy-success';
    errorMsg.style.background = '#f44336';
    errorMsg.textContent = `❌ ${message}`;
    document.body.appendChild(errorMsg);
    
    setTimeout(() => {
      if (document.body.contains(errorMsg)) {
        document.body.removeChild(errorMsg);
      }
    }, 3000);
  }
  
  refreshGallery() {
    this.loadImages(true);
  }
  
  loadMoreImages() {
    this.currentPage++;
    this.loadImages(false);
  }
  
  throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.autoLoadObserver) {
      this.autoLoadObserver.disconnect();
    }
  }
}

window.addEventListener('beforeunload', () => {
  if (window.randomGallery) {
    window.randomGallery.destroy();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  window.randomGallery = new RandomGallery();
});
</script>