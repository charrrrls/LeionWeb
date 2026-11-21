/**
 * LeionWeb 粒子背景初始化器
 * 轻量级粒子特效系统
 */

class ParticlesManager {
    constructor() {
        this.particlesContainer = null;
        this.isInitialized = false;
        
        console.log('🌟 LeionWeb 粒子系统启动中...');
        this.init();
    }
    
    /**
     * 初始化粒子系统
     */
    init() {
        // 检查是否在移动设备上，移动设备不启用粒子效果
        if (this.isMobile()) {
            console.log('📱 移动设备检测到，跳过粒子效果');
            return;
        }
        
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createParticlesContainer());
        } else {
            this.createParticlesContainer();
        }
    }
    
    /**
     * 创建粒子容器
     */
    createParticlesContainer() {
        if (document.querySelector('#body-wrap.type-gallery')) return;
        // 创建粒子容器元素
        this.particlesContainer = document.createElement('div');
        this.particlesContainer.id = 'particles-js';
        this.particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.6;
        `;
        
        // 插入到页面最底层
        document.body.insertBefore(this.particlesContainer, document.body.firstChild);
        
        // 延迟初始化，确保所有资源加载完成
        setTimeout(() => this.initializeParticles(), 1000);
    }
    
    /**
     * 初始化 particles.js
     */
    initializeParticles() {
        if (typeof particlesJS === 'undefined') {
            console.warn('⚠️ particles.js 库未加载，跳过粒子效果');
            return;
        }
        
        if (typeof window.particlesConfig === 'undefined') {
            console.warn('⚠️ 粒子配置未加载，跳过粒子效果');
            return;
        }
        
        try {
            particlesJS('particles-js', window.particlesConfig);
            this.isInitialized = true;
            console.log('✨ 粒子背景效果初始化成功！');
            
            // 添加页面可见性控制
            this.setupVisibilityControl();
        } catch (error) {
            console.error('❌ 粒子系统初始化失败:', error);
        }
    }
    
    /**
     * 设置页面可见性控制
     */
    setupVisibilityControl() {
        document.addEventListener('visibilitychange', () => {
            if (this.particlesContainer) {
                if (document.hidden) {
                    this.particlesContainer.style.display = 'none';
                } else {
                    this.particlesContainer.style.display = 'block';
                }
            }
        });
    }
    
    /**
     * 检查是否为移动设备
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    /**
     * 销毁粒子效果
     */
    destroy() {
        if (this.particlesContainer && this.particlesContainer.parentNode) {
            this.particlesContainer.parentNode.removeChild(this.particlesContainer);
            this.particlesContainer = null;
            this.isInitialized = false;
            console.log('🗑️ 粒子效果已销毁');
        }
    }
    
    /**
     * 获取粒子系统状态
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            containerExists: !!this.particlesContainer,
            isMobile: this.isMobile()
        };
    }
}

// 页面加载完成后初始化粒子系统
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM加载完成，准备初始化粒子系统');
    // 延迟初始化，确保其他脚本先加载
    setTimeout(() => {
        window.particlesManager = new ParticlesManager();
        
        // 暴露控制方法到全局
        window.destroyParticles = () => window.particlesManager.destroy();
        window.getParticlesStatus = () => window.particlesManager.getStatus();
        
        console.log('💡 提示: 在控制台输入 getParticlesStatus() 查看粒子系统状态');
        console.log('💡 提示: 在控制台输入 destroyParticles() 可销毁粒子效果');
    }, 500);
});

// 如果页面已经加载完成，立即初始化
if (document.readyState !== 'loading') {
    setTimeout(() => {
        window.particlesManager = new ParticlesManager();
        window.destroyParticles = () => window.particlesManager.destroy();
        window.getParticlesStatus = () => window.particlesManager.getStatus();
    }, 500);
}