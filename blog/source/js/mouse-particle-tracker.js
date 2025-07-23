/**
 * 太阳系轨道鼠标跟随特效
 * 基于博客园特效优化版本 - 纯轨道粒子系统，无连线
 * Author: Leion
 */

class MouseParticleTracker {
    constructor(options = {}) {
        this.options = {
            particleCount: options.particleCount || 20, // 恢复到20个粒子
            orbitRadius: options.orbitRadius || 50,
            speed: options.speed || 0.02,
            autoColor: options.autoColor || true,
            colors: options.colors || ['#2D8CF0', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.animationId = null;
        this.isMousePressed = false;
        this.radiusMultiplier = 1;
        this.targetRadius = 1;
        
        // 性能优化变量 - 移除帧节流以提升流畅度
        this.lastFrameTime = 0;
        this.offscreenCanvas = null;
        this.isLowPerformance = this.detectPerformance();
        
        // 动画缓动系统
        this.easing = {
            // 四次方缓出函数 - 更自然的减速效果
            easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
            // 三次方缓入缓出 - 平滑的加速减速
            easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            // 弹性缓出 - 自然的弹性效果
            easeOutElastic: (t) => {
                if (t === 0 || t === 1) return t;
                return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
            }
        };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.startAnimation();
    }
    
    createCanvas() {
        // 创建第二个Canvas - 用于粒子跟随特效
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'shuicheCanvas';
        this.canvas.style.cssText = `
            position: fixed;
            left: 0px;
            top: 0px;
            z-index: 2147483647;
            pointer-events: none;
            background: transparent;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        // 创建太阳系轨道粒子系统 - 恢复20个粒子，优化性能
        const adjustedCount = this.isLowPerformance ? 
            Math.min(this.options.particleCount, 12) : 
            this.options.particleCount;
            
        for (let i = 0; i < adjustedCount; i++) {
            const particle = {
                size: 1 + Math.random() * 1.5, // 更小的粒子
                position: { x: this.mouse.x, y: this.mouse.y, z: 0 }, // 添加Z轴
                shift: { x: this.mouse.x, y: this.mouse.y },
                // 缓动动画相关属性
                targetShift: { x: this.mouse.x, y: this.mouse.y },
                animationProgress: 1, // 动画进度 0-1
                isAnimating: false,
                animationStartTime: 0,
                animationDuration: 800, // 动画持续时间(ms)
                
                speed: 0.015 + Math.random() * 0.025,
                targetSize: 1 + Math.random() * 1.5, // 更小的目标大小
                fillColor: this.getFireworkColor(), // 使用烟花色彩
                // 不同轨道半径，形成太阳系效果，增加更大的分散性
                orbit: (this.options.orbitRadius * 0.5) + (this.options.orbitRadius * 1.8 * (i / adjustedCount)),
                // 优化的旋转角度计算
                angleX: (i / adjustedCount) * Math.PI * 2 + Math.random() * 0.8,
                angleY: this.isLowPerformance ? 0 : (i / adjustedCount) * Math.PI * 2 + Math.random() * 0.8,
                angleZ: this.isLowPerformance ? 0 : (i / adjustedCount) * Math.PI * 2 + Math.random() * 0.8,
                rotationSpeed: 0.008 + Math.random() * 0.015,
                // 优化的3D旋转速度
                rotationSpeedX: (Math.random() - 0.5) * 0.012, // 稍微降低旋转速度提升性能
                rotationSpeedY: this.isLowPerformance ? 0 : (Math.random() - 0.5) * 0.012,
                rotationSpeedZ: this.isLowPerformance ? 0 : (Math.random() - 0.5) * 0.012
            };
            
            this.particles.push(particle);
        }
    }
    
    getParticleColor() {
        if (this.options.autoColor) {
            const hue = (Date.now() * 0.01 + Math.random() * 60) % 360;
            return `hsl(${hue}, 80%, 65%)`;
        }
        return this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
    }
    
    // 烟花色彩系统 - 与烟花特效保持一致
    getFireworkColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9ff3', '#10ac84', '#ee5a24'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 性能检测
    detectPerformance() {
        const ua = navigator.userAgent.toLowerCase();
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
        const isOldBrowser = !window.requestAnimationFrame || !document.createElement('canvas').getContext;
        const lowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        return isMobile || isOldBrowser || lowConcurrency;
    }
    
    bindEvents() {
        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // 鼠标按下事件 - 增大轨道半径并分散
        document.addEventListener('mousedown', () => {
            this.isMousePressed = true;
            this.targetRadius = 2.5; // 增大分散倍数
        });
        
        // 鼠标释放事件 - 启动平滑回归动画
        document.addEventListener('mouseup', () => {
            this.isMousePressed = false;
            this.targetRadius = 1;
            
            // 为每个粒子启动回归动画
            this.startReturnAnimation();
        });
        
        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.resize();
        });
        
        // 触摸事件支持
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                this.mouse.x = e.touches[0].pageX;
                this.mouse.y = e.touches[0].pageY;
                this.isMousePressed = true;
                this.targetRadius = 2.5;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                this.mouse.x = e.touches[0].pageX;
                this.mouse.y = e.touches[0].pageY;
            }
        });
        
        document.addEventListener('touchend', () => {
            this.isMousePressed = false;
            this.targetRadius = 1;
            
            // 为每个粒子启动回归动画
            this.startReturnAnimation();
        });
    }
    
    // 启动粒子回归动画
    startReturnAnimation() {
        const currentTime = performance.now();
        
        this.particles.forEach(particle => {
            // 记录动画开始时的位置
            particle.animationStartShift = {
                x: particle.shift.x,
                y: particle.shift.y
            };
            
            // 设置目标位置为当前鼠标位置
            particle.targetShift = {
                x: this.mouse.x,
                y: this.mouse.y
            };
            
            // 启动动画
            particle.isAnimating = true;
            particle.animationProgress = 0;
            particle.animationStartTime = currentTime;
            // 随机化动画持续时间，产生更自然的效果
            particle.animationDuration = 600 + Math.random() * 400; // 600-1000ms
        });
    }
    
    updateParticles() {
        const currentTime = performance.now();
        
        // 移除帧率限制，让动画更流畅
        // 使用delta time进行平滑插值
        const deltaTime = Math.min(currentTime - this.lastFrameTime, 16.67); // 限制最大delta为一帧时间
        this.lastFrameTime = currentTime;
        
        // 优化半径倍数更新 - 使用更平滑的缓动
        const radiusEasing = this.easing.easeInOutCubic;
        if (this.isMousePressed) {
            const lerpSpeed = 0.08 * (deltaTime / 16.67); // 基于时间的插值
            this.radiusMultiplier += lerpSpeed * (this.targetRadius - this.radiusMultiplier);
        } else {
            const lerpSpeed = 0.06 * (deltaTime / 16.67); // 松开时稍慢的恢复速度
            this.radiusMultiplier += lerpSpeed * (1 - this.radiusMultiplier);
        }
        this.radiusMultiplier = Math.max(0.3, Math.min(this.radiusMultiplier, this.targetRadius));
        
        this.particles.forEach((particle, index) => {
            // 更新缓动动画
            if (particle.isAnimating) {
                const elapsed = currentTime - particle.animationStartTime;
                particle.animationProgress = Math.min(elapsed / particle.animationDuration, 1);
                
                if (particle.animationProgress >= 1) {
                    particle.isAnimating = false;
                    particle.shift.x = particle.targetShift.x;
                    particle.shift.y = particle.targetShift.y;
                } else {
                    // 使用弹性缓出函数实现自然的动画效果
                    const easeProgress = this.easing.easeOutElastic(particle.animationProgress);
                    const startShift = particle.animationStartShift;
                    
                    particle.shift.x = startShift.x + (particle.targetShift.x - startShift.x) * easeProgress;
                    particle.shift.y = startShift.y + (particle.targetShift.y - startShift.y) * easeProgress;
                }
            } else {
                // 正常的跟随模式 - 优化插值算法
                const followSpeed = particle.speed * 2.5 * (deltaTime / 16.67);
                const dx = this.mouse.x - particle.shift.x;
                const dy = this.mouse.y - particle.shift.y;
                
                // 使用指数衰减函数实现更自然的跟随
                particle.shift.x += dx * followSpeed;
                particle.shift.y += dy * followSpeed;
            }
            
            // 优化3D轨道角度更新 - 基于时间的稳定旋转
            const rotationFactor = (deltaTime / 16.67) * this.options.speed * 35;
            
            if (this.isLowPerformance) {
                // 低性能模式：简化为2D旋转
                particle.angleX += particle.rotationSpeedX * rotationFactor;
            } else {
                // 高性能模式：完整3D旋转
                particle.angleX += particle.rotationSpeedX * rotationFactor;
                particle.angleY += particle.rotationSpeedY * rotationFactor;
                particle.angleZ += particle.rotationSpeedZ * rotationFactor;
            }
            
            // 计算轨道位置
            const currentRadius = particle.orbit * this.radiusMultiplier;
            
            if (this.isLowPerformance) {
                // 低性能模式：简化为2D圆形轨道
                particle.position.x = particle.shift.x + currentRadius * Math.cos(particle.angleX);
                particle.position.y = particle.shift.y + currentRadius * Math.sin(particle.angleX);
                particle.position.z = 0;
            } else {
                // 高性能模式：完整3D空间计算
                const x3D = currentRadius * Math.cos(particle.angleX) * Math.cos(particle.angleY);
                const y3D = currentRadius * Math.sin(particle.angleX) * Math.cos(particle.angleZ);
                const z3D = currentRadius * Math.sin(particle.angleY) * Math.sin(particle.angleZ);
                
                // 投影到2D屏幕坐标，添加深度效果
                const perspective = 200;
                const scale = perspective / (perspective + z3D);
                
                particle.position.x = particle.shift.x + x3D * scale;
                particle.position.y = particle.shift.y + y3D * scale;
                particle.position.z = z3D;
            }
            
            // 边界检查 - 环绕效果
            const margin = 20;
            if (particle.position.x < -margin) particle.position.x = window.innerWidth + margin;
            if (particle.position.x > window.innerWidth + margin) particle.position.x = -margin;
            if (particle.position.y < -margin) particle.position.y = window.innerHeight + margin;
            if (particle.position.y > window.innerHeight + margin) particle.position.y = -margin;
            
            // 动态粒子大小变化 - 基于时间的平滑动画
            if (this.isLowPerformance) {
                particle.size = particle.targetSize;
            } else {
                const depthScale = particle.position.z ? Math.max(0.3, 200 / (200 + particle.position.z)) : 1;
                const targetSizeScaled = particle.targetSize * depthScale;
                const sizeSpeed = 0.05 * (deltaTime / 16.67);
                
                particle.size += sizeSpeed * (targetSizeScaled - particle.size);
                if (Math.abs(particle.size - targetSizeScaled) < 0.1) {
                    particle.targetSize = 0.8 + Math.random() * 1.2;
                }
            }
            
            // 定期更新颜色（降低频率以提升性能）
            if (this.options.autoColor && Math.random() < 0.0008) {
                particle.fillColor = this.getFireworkColor();
            }
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制太阳系轨道粒子（根据性能调整视觉效果）
        this.particles.forEach((particle, index) => {
            // 低性能模式减少save/restore调用
            if (!this.isLowPerformance) {
                this.ctx.save();
            }
            
            // 绘制轨道轨迹（仅高性能模式或用户按下鼠标时）
            if (this.isMousePressed && !this.isLowPerformance) {
                this.ctx.globalAlpha = 0.08;
                this.ctx.strokeStyle = particle.fillColor;
                this.ctx.lineWidth = 0.8;
                this.ctx.beginPath();
                // 绘制椭圆轨道，体现3D效果
                const orbitRadius = particle.orbit * this.radiusMultiplier;
                this.ctx.ellipse(
                    particle.shift.x, 
                    particle.shift.y, 
                    orbitRadius, 
                    orbitRadius * 0.6, // 椭圆效果
                    particle.angleZ * 0.5, // 旋转角度
                    0, 
                    Math.PI * 2
                );
                this.ctx.stroke();
            }
            
            // 绘制粒子本体 - 根据性能调整效果
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = particle.fillColor;
            
            if (this.isLowPerformance) {
                // 低性能模式：简单绘制，无阴影效果
                this.ctx.beginPath();
                this.ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 简单的内发光
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(particle.position.x, particle.position.y, particle.size * 0.4, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // 高性能模式：完整视觉效果
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = particle.fillColor;
                
                // 主粒子 - 更小的尺寸
                this.ctx.beginPath();
                this.ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 内发光效果
                this.ctx.globalAlpha = 0.7;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(particle.position.x, particle.position.y, particle.size * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 外光晕效果 - 适度的光晕
                this.ctx.globalAlpha = 0.3;
                this.ctx.fillStyle = particle.fillColor;
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = particle.fillColor;
                this.ctx.beginPath();
                this.ctx.arc(particle.position.x, particle.position.y, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 粒子尾迹效果（运动时）- 更小的尾迹，体现3D运动
                if (this.isMousePressed) {
                    this.ctx.globalAlpha = 0.15;
                    const tailDistance = 12;
                    const tailX = particle.position.x - Math.cos(particle.angleX) * tailDistance;
                    const tailY = particle.position.y - Math.sin(particle.angleY || particle.angleX) * tailDistance;
                    this.ctx.fillStyle = particle.fillColor;
                    this.ctx.beginPath();
                    this.ctx.arc(tailX, tailY, particle.size * 0.4, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // 添加更远的尾迹点
                    this.ctx.globalAlpha = 0.08;
                    const tail2X = particle.position.x - Math.cos(particle.angleX) * tailDistance * 1.8;
                    const tail2Y = particle.position.y - Math.sin(particle.angleY || particle.angleX) * tailDistance * 1.8;
                    this.ctx.beginPath();
                    this.ctx.arc(tail2X, tail2Y, particle.size * 0.2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
            
            if (!this.isLowPerformance) {
                this.ctx.restore();
            } else {
                // 重置状态
                this.ctx.globalAlpha = 1;
                this.ctx.shadowBlur = 0;
            }
        });
    }
    
    startAnimation() {
        const animate = (currentTime) => {
            // 移除性能节流，让动画保持60fps流畅度
            this.updateParticles();
            this.drawParticles();
            this.animationId = requestAnimationFrame(animate);
        };
        animate(performance.now());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
    
    // 动态调整粒子数量
    setParticleCount(count) {
        this.options.particleCount = count;
        this.createParticles();
    }
    
    // 动态调整轨道半径
    setOrbitRadius(radius) {
        this.options.orbitRadius = radius;
        this.particles.forEach((particle, index) => {
            particle.orbit = (radius * 0.5) + (radius * 1.8 * (index / this.options.particleCount));
        });
    }
}

// 导出类
window.MouseParticleTracker = MouseParticleTracker;