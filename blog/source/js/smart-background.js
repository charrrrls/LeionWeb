/**
 * LeionWeb 智能随机背景系统
 * 主人专属的简单随机背景切换系统 ✨
 * 每次页面加载时随机选择一个API作为背景
 */

// 添加调试信息
console.log('📦 smart-background.js 脚本已加载');

class SmartBackground {
    constructor() {
        console.log('🚀 SmartBackground 构造函数开始执行');
        
        // 图片API配置 - 按权重从高到低排序
        this.apis = [
            { name: 't.mwm.moe', url: 'https://t.mwm.moe/pc', weight: 25 },
            { name: 'seaya.link', url: 'https://api.seaya.link/web?type=file', weight: 5 },
            { name: 't.alcy.cc', url: 'https://t.alcy.cc/fj', weight: 20 },
            { name: 'loliapi.com', url: 'https://www.loliapi.com/acg/', weight: 10 },
            { name: 'imgapi.xl0408', url: 'https://imgapi.xl0408.top/index.php', weight: 8 },
            { name: '98qy.com', url: 'http://www.98qy.com/sjbz/api.php', weight: 22 },
            { name: 'dmoe.cc', url: 'https://www.dmoe.cc/random.php', weight: 5 }
        ];
        
        // 计算权重累计数组
        this.cumulativeWeights = [];
        let sum = 0;
        for (const api of this.apis) {
            sum += api.weight;
            this.cumulativeWeights.push(sum);
        }
        this.totalWeight = sum;
        
        console.log('⚙️ API权重配置完成，总权重:', this.totalWeight);
        this.init();
    }
    
    /**
     * 初始化系统
     */
    init() {
        if (document.querySelector('#body-wrap.type-gallery')) return;
        console.log('🎨 LeionWeb 智能随机背景系统启动中...');
        this.setRandomBackground();
    }
    
    /**
     * 权重随机选择API
     */
    selectWeightedRandomAPI() {
        const random = Math.random() * this.totalWeight;
        
        for (let i = 0; i < this.cumulativeWeights.length; i++) {
            if (random <= this.cumulativeWeights[i]) {
                return this.apis[i];
            }
        }
        
        // 理论上不会到达这里，但作为备用
        return this.apis[0];
    }
    
    /**
     * 设置随机背景
     */
    setRandomBackground() {
        const selectedAPI = this.selectWeightedRandomAPI();
        
        console.log(`🎯 选中API: ${selectedAPI.name} (权重: ${selectedAPI.weight})`);
        console.log(`📸 图片API链接: ${selectedAPI.url}`);
        
        // 直接设置背景图片
        this.applyBackground(selectedAPI.url);
        
        console.log(`🎉 背景设置成功！使用API: ${selectedAPI.name}`);
    }
    
    /**
     * 应用背景到页面和横幅（仅更换图片链接，不修改样式）
     */
    applyBackground(imageUrl) {
        console.log('🖼️ 正在应用统一图片到页面背景和横幅...');
        
        // 仅更换body背景图片，保持原有样式
        document.body.style.backgroundImage = `url(${imageUrl})`;
        
        // 仅更换特定背景元素的图片（如果存在）
        const bgElement = document.querySelector('#web_bg, .bg, .background');
        if (bgElement) {
            bgElement.style.backgroundImage = `url(${imageUrl})`;
            console.log('✅ 背景元素图片已更换');
        }
        
        // 仅更换横幅图片，不修改其他样式
        const topImgElements = document.querySelectorAll('#page-header, .top-img, .page-header');
        topImgElements.forEach(element => {
            element.style.backgroundImage = `url(${imageUrl})`;
        });
        
        if (topImgElements.length > 0) {
            console.log(`✅ 已更换 ${topImgElements.length} 个横幅元素的图片`);
        }
        
        // 动态设置CSS变量（供主题使用）
        document.documentElement.style.setProperty('--unified-bg-image', `url(${imageUrl})`);
        
        console.log('✨ 统一背景和横幅图片更换完成！');
    }
    
    /**
     * 手动刷新背景
     */
    refreshBackground() {
        console.log('🔄 手动刷新背景...');
        this.setRandomBackground();
    }
    
    /**
     * 获取当前API统计信息
     */
    getStats() {
        return {
            totalAPIs: this.apis.length,
            totalWeight: this.totalWeight,
            apis: this.apis.map(api => ({
                name: api.name,
                weight: api.weight,
                percentage: ((api.weight / this.totalWeight) * 100).toFixed(1) + '%'
            }))
        };
    }
}

console.log('📋 准备初始化，当前文档状态:', document.readyState);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOMContentLoaded 事件触发');
    // 创建全局实例
    window.smartBackground = new SmartBackground();
    
    // 暴露一些实用方法到全局
    window.refreshBackground = () => window.smartBackground.refreshBackground();
    window.getBackgroundStats = () => window.smartBackground.getStats();
    
    console.log('💡 提示: 在控制台输入 refreshBackground() 可手动刷新背景');
    console.log('📊 输入 getBackgroundStats() 查看API权重统计');
});

// 如果页面已经加载完成，立即初始化
if (document.readyState === 'loading') {
    console.log('⏳ 页面还在加载中，等待DOMContentLoaded事件');
} else {
    console.log('⚡ 页面已加载完成，立即初始化');
    // 已经加载完成，立即执行
    window.smartBackground = new SmartBackground();
    window.refreshBackground = () => window.smartBackground.refreshBackground();
    window.getBackgroundStats = () => window.smartBackground.getStats();
}