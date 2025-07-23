/**
 * 鼠标特效控制器
 * 统一管理烟花和粒子跟随特效
 * Author: Leion
 */

class MouseEffectsController {
    constructor() {
        this.fireworksEffect = null;
        this.particleTracker = null;
        this.isEnabled = true;
        this.isMobile = this.detectMobile();
        
        // 默认配置
        this.config = {
            enableFireworks: true,
            enableParticleTracker: true,
            fireworksOptions: {
                particleCount: 25,
                gravity: 0.08,
                friction: 0.99,
                autoColor: true
            },
            particleTrackerOptions: {
                particleCount: 20, // 恢复到20个粒子
                orbitRadius: 35,   // 稍微减小轨道半径
                speed: 0.012,      // 轻微降低速度
                autoColor: true
            }
        };
        
        this.init();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    init() {
        // 移动设备跳过特效
        if (this.isMobile) {
            console.log('📱 移动设备检测到，已跳过鼠标特效');
            return;
        }
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initEffects();
            });
        } else {
            this.initEffects();
        }
    }
    
    initEffects() {
        try {
            // 初始化烟花特效
            if (this.config.enableFireworks && window.MouseFireworksEffect) {
                this.fireworksEffect = new MouseFireworksEffect(this.config.fireworksOptions);
                console.log('🎆 点击烟花特效已启用');
            }
            
            // 延迟初始化粒子跟随特效，避免冲突
            setTimeout(() => {
                if (this.config.enableParticleTracker && window.MouseParticleTracker) {
                    this.particleTracker = new MouseParticleTracker(this.config.particleTrackerOptions);
                    console.log('✨ 粒子跟随特效已启用');
                }
            }, 100);
            
            console.log('🎨 LeionWeb 鼠标特效系统已启动');
            
        } catch (error) {
            console.error('鼠标特效初始化失败:', error);
        }
    }
    
    // 切换烟花特效
    toggleFireworks() {
        if (this.isMobile) return;
        
        if (this.fireworksEffect) {
            this.fireworksEffect.destroy();
            this.fireworksEffect = null;
            console.log('🚫 烟花特效已关闭');
        } else if (window.MouseFireworksEffect) {
            this.fireworksEffect = new MouseFireworksEffect(this.config.fireworksOptions);
            console.log('🎆 烟花特效已开启');
        }
    }
    
    // 切换粒子跟随特效
    toggleParticleTracker() {
        if (this.isMobile) return;
        
        if (this.particleTracker) {
            this.particleTracker.destroy();
            this.particleTracker = null;
            console.log('🚫 粒子跟随特效已关闭');
        } else if (window.MouseParticleTracker) {
            this.particleTracker = new MouseParticleTracker(this.config.particleTrackerOptions);
            console.log('✨ 粒子跟随特效已开启');
        }
    }
    
    // 切换所有特效
    toggleAllEffects() {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
    }
    
    // 启用所有特效
    enable() {
        if (this.isMobile) return;
        
        this.isEnabled = true;
        if (!this.fireworksEffect && this.config.enableFireworks) {
            this.fireworksEffect = new MouseFireworksEffect(this.config.fireworksOptions);
        }
        if (!this.particleTracker && this.config.enableParticleTracker) {
            this.particleTracker = new MouseParticleTracker(this.config.particleTrackerOptions);
        }
        console.log('✅ 所有鼠标特效已启用');
    }
    
    // 禁用所有特效
    disable() {
        this.isEnabled = false;
        if (this.fireworksEffect) {
            this.fireworksEffect.destroy();
            this.fireworksEffect = null;
        }
        if (this.particleTracker) {
            this.particleTracker.destroy();
            this.particleTracker = null;
        }
        console.log('❌ 所有鼠标特效已禁用');
    }
    
    // 更新配置
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // 重新初始化特效
        if (this.isEnabled) {
            this.disable();
            setTimeout(() => {
                this.enable();
            }, 100);
        }
    }
    
    // 获取当前状态
    getStatus() {
        return {
            isEnabled: this.isEnabled,
            isMobile: this.isMobile,
            hasFireworks: !!this.fireworksEffect,
            hasParticleTracker: !!this.particleTracker,
            config: this.config
        };
    }
}

// 页面可见性API - 当页面隐藏时暂停特效
document.addEventListener('visibilitychange', () => {
    if (window.mouseEffectsController) {
        if (document.hidden) {
            window.mouseEffectsController.disable();
        } else {
            setTimeout(() => {
                window.mouseEffectsController.enable();
            }, 500);
        }
    }
});

// 全局初始化
window.MouseEffectsController = MouseEffectsController;

// 自动初始化控制器
if (!window.mouseEffectsController) {
    window.mouseEffectsController = new MouseEffectsController();
}

// 暴露控制方法到全局作用域
window.toggleMouseEffects = () => window.mouseEffectsController.toggleAllEffects();
window.toggleFireworks = () => window.mouseEffectsController.toggleFireworks();
window.toggleParticleTracker = () => window.mouseEffectsController.toggleParticleTracker();