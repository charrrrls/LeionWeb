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

.url-info {
  margin-top: 5px;
  opacity: 0.8;
}

.url-info small {
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
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
  padding: 20px 30px;
  border-radius: 25px;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  z-index: 9999;
  animation: copyFadeInOut 3s ease-in-out;
  backdrop-filter: blur(10px);
  text-align: center;
  max-width: 400px;
  word-break: break-all;
}

@keyframes copyFadeInOut {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  15%, 85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
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
    // 从smart-background.js获取的多个API配置 - 按可靠性排序
    this.apis = [
      { name: 'loliapi.com', url: 'https://www.loliapi.com/acg/', weight: 35, maxPerBatch: 4, reliability: 'high' },
      { name: 't.mwm.moe', url: 'https://t.mwm.moe/pc', weight: 20, maxPerBatch: 2, reliability: 'medium' },
      { name: 'seaya.link', url: 'https://api.seaya.link/web?type=file', weight: 20, maxPerBatch: 2, reliability: 'medium' },
      { name: 't.alcy.cc', url: 'https://t.alcy.cc/fj', weight: 10, maxPerBatch: 1, reliability: 'low' },
      { name: 'imgapi.xl0408', url: 'https://imgapi.xl0408.top/index.php', weight: 8, maxPerBatch: 1, reliability: 'low' },
      { name: 'dmoe.cc', url: 'https://www.dmoe.cc/random.php', weight: 7, maxPerBatch: 2, reliability: 'medium' }
    ];
    
    this.loadedImages = new Set();
    this.currentPage = 1;
    this.imagesPerLoad = 10;
    this.isLoading = false;
    this.loadedCount = 0;
    this.totalCount = 0;
    this.imageCache = new Map();
    this.intersectionObserver = null;
    this.autoLoadObserver = null;
    this.preloadQueue = [];
    this.maxConcurrentLoads = 3;
    this.currentLoads = 0;
    this.apiUsageCount = new Map();
    this.failedApis = new Set(); // 记录失败的API
    this.apiRetryCount = new Map(); // API重试计数
    
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
  
  // 智能API选择器 - 优先选择可靠的API，避免失败的API
  selectBalancedAPI() {
    // 过滤出可用的API（未失败且未达到使用上限）
    const availableApis = this.apis.filter(api => {
      const usageCount = this.apiUsageCount.get(api.name) || 0;
      const retryCount = this.apiRetryCount.get(api.name) || 0;
      
      return usageCount < api.maxPerBatch && 
             !this.failedApis.has(api.name) && 
             retryCount < 3; // 最多重试3次
    });
    
    if (availableApis.length === 0) {
      // 如果所有API都不可用，重置状态
      this.apiUsageCount.clear();
      this.failedApis.clear();
      this.apiRetryCount.clear();
      console.log('🔄 重置API状态，所有API重新可用');
      return this.selectWeightedRandomAPI(this.apis);
    }
    
    // 优先选择高可靠性的API
    const highReliabilityApis = availableApis.filter(api => api.reliability === 'high');
    if (highReliabilityApis.length > 0) {
      return this.selectWeightedRandomAPI(highReliabilityApis);
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
      this.failedApis.clear(); // 刷新时清除失败记录
      this.apiRetryCount.clear();
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
    
    // 重置API使用计数
    this.apiUsageCount.clear();
    
    // 为了获取10张图片，我们需要调用5个API，每个API最多2张
    for (let i = 0; i < this.imagesPerLoad; i++) {
      const selectedAPI = this.selectBalancedAPI();
      
      // 更新使用计数
      const currentCount = this.apiUsageCount.get(selectedAPI.name) || 0;
      this.apiUsageCount.set(selectedAPI.name, currentCount + 1);
      
      // 添加随机参数避免缓存，但保持URL简洁
      const randomParam = Math.random().toString(36).substring(7);
      const url = `${selectedAPI.url}?r=${randomParam}`;
      
      console.log(`📡 API ${i + 1}: ${selectedAPI.name} (使用次数: ${currentCount + 1}/${selectedAPI.maxPerBatch})`);
      console.log(`🔗 请求URL: ${url}`);
      
      promises.push(
        this.fetchSingleImageUrl(url, selectedAPI.name, i).then(result => {
          completed++;
          this.updateProgress(completed / this.imagesPerLoad * 100);
          console.log(`✅ 第${i + 1}张图片获取成功:`, result.apiSource);
          // 成功时清除失败记录
          this.failedApis.delete(selectedAPI.name);
          this.apiRetryCount.delete(selectedAPI.name);
          return result;
        }).catch(error => {
          completed++;
          this.updateProgress(completed / this.imagesPerLoad * 100);
          console.error(`❌ 第${i + 1}张图片获取失败:`, selectedAPI.name, error.message);
          
          // 记录失败的API
          const retryCount = this.apiRetryCount.get(selectedAPI.name) || 0;
          this.apiRetryCount.set(selectedAPI.name, retryCount + 1);
          
          if (retryCount >= 2) {
            this.failedApis.add(selectedAPI.name);
            console.warn(`⚠️ API ${selectedAPI.name} 被标记为失败，暂时跳过`);
          }
          
          return null; // 返回null而不是抛出错误
        })
      );
    }
    
    const results = await Promise.allSettled(promises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        imageUrls.push(result.value);
      } else {
        console.warn(`⚠️ 第${index + 1}个请求失败:`, result.reason || '未知错误');
      }
    });
    
    // 显示本批次API使用统计
    this.logAPIUsageStats();
    console.log(`📊 最终成功获取 ${imageUrls.length}/${this.imagesPerLoad} 张图片`);
    
    return imageUrls;
  }
  
  async fetchSingleImageUrl(url, apiName, index) {
    try {
      console.log(`🎯 [${index + 1}] ${apiName} 开始获取真实URL，API地址:`, url);
      
      // 🌟 混合方案：优先使用fetch追踪重定向，失败时回退到img加载
      let realImageUrl;
      let isRealImageFile = false;
      
      try {
        // 先尝试fetch方法获取真实URL，关键是要追踪重定向
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(url, {
          method: 'GET', // 改为GET以便追踪重定向
          headers: {
            'Accept': 'image/*',
            'User-Agent': 'Mozilla/5.0 (compatible; LeionWeb/1.0)',
          },
          signal: controller.signal,
          redirect: 'follow', // 明确允许跟随重定向
          cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          // response.url 就是最终重定向后的真实URL！
          realImageUrl = response.url;
          console.log(`✅ [${index + 1}] ${apiName} fetch成功获取真实URL:`, realImageUrl);
          
          // 验证Content-Type确保是图片
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) {
            console.log(`🎨 [${index + 1}] ${apiName} 确认为图片类型:`, contentType);
          }
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (fetchError) {
        console.log(`🔄 [${index + 1}] ${apiName} fetch失败，使用img追踪重定向:`, fetchError.message);
        
        // fetch失败时，使用更智能的img方法追踪重定向
        realImageUrl = await this.getImageRealUrlViaImg(url, apiName, index);
        
        console.log(`✅ [${index + 1}] ${apiName} img方法成功获取真实URL:`, realImageUrl);
      }
      
      // 验证是否为真实图片文件地址
      isRealImageFile = /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(realImageUrl);
      
      if (!isRealImageFile) {
        console.warn(`⚠️ [${index + 1}] ${apiName} 返回的URL不是直接图片文件:`, realImageUrl);
        // 但仍然可能是有效的图片URL，不要抛出错误
      }
      
      // 检查去重
      if (this.loadedImages.has(realImageUrl)) {
        throw new Error('重复图片');
      }
      
      this.loadedImages.add(realImageUrl);
      
      // 缓存图片信息
      this.imageCache.set(realImageUrl, {
        loaded: true,
        apiSource: apiName,
        originalApiUrl: url,
        isRealImageFile: isRealImageFile
      });
      
      return {
        url: realImageUrl,
        apiSource: apiName,
        originalApiUrl: url,
        isRealImageFile: isRealImageFile
      };
      
    } catch (error) {
      console.error(`❌ [${index + 1}] ${apiName} 完全失败:`, error.message);
      throw new Error(`图片获取失败 - ${apiName}: ${error.message}`);
    }
  }
  
  // 新增：通过img元素追踪重定向获取真实URL
  async getImageRealUrlViaImg(url, apiName, index) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.src = '';
        reject(new Error('图片加载超时'));
      }, 10000);
      
      // 创建一个临时的iframe来捕获网络请求
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeImg = iframeDoc.createElement('img');
      
      iframeImg.onload = () => {
        clearTimeout(timeout);
        // 从iframe中获取最终的src，这应该是重定向后的真实URL
        const realUrl = iframeImg.src;
        console.log(`🎯 [${index + 1}] ${apiName} iframe方法获取到真实URL:`, realUrl);
        
        document.body.removeChild(iframe);
        resolve(realUrl);
      };
      
      iframeImg.onerror = () => {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        
        // iframe方法失败，回退到普通img方法
        img.onload = () => {
          // 即使是普通方法，浏览器也会跟随重定向
          // img.src 可能包含最终URL信息
          resolve(img.currentSrc || img.src);
        };
        
        img.onerror = () => {
          img.src = '';
          reject(new Error('图片加载失败'));
        };
        
        img.src = url;
      };
      
      iframeImg.src = url;
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
    
    // 估算高度
    const estimatedHeight = 200;
    
    const apiSource = imageData.apiSource || 'unknown';
    const realImageUrl = imageData.url; // 这现在应该是真实的重定向后URL
    const isRealFile = imageData.isRealImageFile;
    
    // 检查是否成功获取到重定向后的真实地址
    const isApiUrl = realImageUrl.includes('t.alcy.cc') || 
                     realImageUrl.includes('t.mwm.moe') || 
                     realImageUrl.includes('imgapi.xl0408') || 
                     realImageUrl.includes('dmoe.cc') || 
                     realImageUrl.includes('seaya.link');
    
    let buttonText, infoText;
    
    if (isRealFile && !isApiUrl) {
      buttonText = '✅ 复制真实图片地址';
      infoText = '成功追踪到真实图片文件地址';
    } else if (!isApiUrl) {
      buttonText = '📋 复制重定向后地址';
      infoText = '已获取重定向后的真实链接';
    } else {
      buttonText = '⚠️ 复制API地址';
      infoText = '注意：这是原始API地址，可能不是直接图片文件';
    }
    
    item.innerHTML = `
      <div class="image-placeholder" style="height: ${estimatedHeight}px;">
        <div class="placeholder-icon">🖼️</div>
        <div class="api-source-tag">${apiSource}</div>
      </div>
      <img 
        src="${realImageUrl}" 
        alt="随机图片 - ${apiSource}" 
        style="display: none; opacity: 0;"
        data-real-url="${realImageUrl}"
      >
      <div class="image-overlay">
        <button class="copy-btn" onclick="randomGallery.copyImageUrl('${realImageUrl}')">
          ${buttonText}
        </button>
        <div class="api-tag">${apiSource}</div>
        <div class="url-info">
          <small>${infoText}</small>
        </div>
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
  
  async copyImageUrl(realUrl) {
    try {
      await navigator.clipboard.writeText(realUrl);
      this.showCopySuccess(realUrl);
    } catch (err) {
      // 备用复制方法
      const textArea = document.createElement('textarea');
      textArea.value = realUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showCopySuccess(realUrl);
    }
  }
  
  showCopySuccess(url) {
    const successMsg = document.createElement('div');
    successMsg.className = 'copy-success';
    
    // 检查是否为真实图片文件地址
    const isRealImageFile = /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(url);
    
    // 根据URL长度决定显示方式
    const displayUrl = url.length > 60 ? 
      url.substring(0, 60) + '...' : url;
    
    // 检查是否是原始API地址还是重定向后的真实地址
    const isApiUrl = url.includes('t.alcy.cc') || 
                     url.includes('t.mwm.moe') || 
                     url.includes('imgapi.xl0408') || 
                     url.includes('dmoe.cc') || 
                     url.includes('seaya.link');
    
    let title, description;
    
    if (isRealImageFile && !isApiUrl) {
      title = '✅ 真实图片文件地址已复制！';
      description = '🎯 通过重定向追踪获取的真实地址';
    } else if (!isApiUrl && url.includes('http')) {
      title = '✅ 重定向后的真实地址已复制！';
      description = '🔄 已追踪到最终图片链接';
    } else {
      title = '⚠️ API地址已复制';
      description = '❌ 未能获取到重定向后的真实地址';
    }
    
    successMsg.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">${title}</div>
      <div style="font-size: 11px; margin-bottom: 8px; opacity: 0.9; font-family: monospace; word-break: break-all;">
        ${displayUrl}
      </div>
      <div style="font-size: 10px; opacity: 0.7; color: #4CAF50;">
        ${description}
      </div>
      ${isRealImageFile && !isApiUrl ? 
        '<div style="font-size: 10px; margin-top: 5px; opacity: 0.7;">✨ 这就是真实的图片文件地址！</div>' :
        isApiUrl ? 
        '<div style="font-size: 10px; margin-top: 5px; opacity: 0.7; color: #ff9800;">🔧 建议刷新页面重新加载</div>' :
        '<div style="font-size: 10px; margin-top: 5px; opacity: 0.7;">📍 重定向追踪成功</div>'
      }
    `;
    
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
      if (document.body.contains(successMsg)) {
        document.body.removeChild(successMsg);
      }
    }, 5000);
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