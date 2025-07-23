/**
 * 鼠标点击烟花爆炸特效
 * 基于博客园特效优化版本
 * Author: Leion
 */

class MouseFireworksEffect {
    constructor(options = {}) {
        this.options = {
            particleCount: options.particleCount || 30,
            colors: options.colors || ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'],
            gravity: options.gravity || 0.1,
            friction: options.friction || 0.98,
            autoColor: options.autoColor || true,
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.fireworks = [];
        this.animationId = null;
        this.colorHue = Math.random() * 360;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.bindEvents();
        this.startAnimation();
    }
    
    createCanvas() {
        // 创建第一个Canvas - 用于烟花特效
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            z-index: 99999;
            position: fixed;
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
    
    bindEvents() {
        // 点击事件 - 创建烟花
        document.addEventListener('click', (e) => {
            this.createFirework(e.clientX, e.clientY);
        });
        
        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    
    createFirework(x, y) {
        const firework = {
            x: x,
            y: y,
            particles: [],
            created: Date.now()
        };
        
        // 创建粒子 - 模拟type 4效果
        for (let i = 0; i < this.options.particleCount; i++) {
            // 随机起始位置
            let startX, startY;
            if (Math.random() <= 0.5) {
                startX = Math.random() <= 0.5 ? -10 : window.innerWidth + 10;
                startY = Math.random() * window.innerHeight;
            } else {
                startY = Math.random() <= 0.5 ? -10 : window.innerHeight + 10;
                startX = Math.random() * window.innerWidth;
            }
            
            const particle = {
                x: startX,
                y: startY,
                targetX: x,
                targetY: y,
                vx: (Math.random() - 0.5) * 16, // 初始随机速度
                vy: (Math.random() - 0.5) * 16,
                life: 1,
                decay: Math.random() * 0.01 + 0.005,
                size: Math.random() * 3 + 2,
                color: this.getParticleColor(),
                phase: 'flying' // flying -> exploding
            };
            
            firework.particles.push(particle);
        }
        
        this.fireworks.push(firework);
    }
    
    getParticleColor() {
        if (this.options.autoColor) {
            this.colorHue += 0.5;
            return `hsl(${this.colorHue % 360}, 100%, 70%)`;
        }
        return this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
    }
    
    updateFireworks() {
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const firework = this.fireworks[i];
            let hasAliveParticles = false;
            
            for (let j = firework.particles.length - 1; j >= 0; j--) {
                const particle = firework.particles[j];
                
                if (particle.phase === 'flying') {
                    // 飞向目标点的阶段
                    const dx = particle.targetX - particle.x;
                    const dy = particle.targetY - particle.y;
                    
                    // 添加向心力
                    particle.vx += dx * 0.001;
                    particle.vy += dy * 0.001;
                    
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // 检查是否到达目标附近
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 30) {
                        particle.phase = 'exploding';
                        // 爆炸时给予随机速度
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 8 + 4;
                        particle.vx = Math.cos(angle) * speed;
                        particle.vy = Math.sin(angle) * speed;
                    }
                } else {
                    // 爆炸扩散阶段
                    particle.vx *= this.options.friction;
                    particle.vy *= this.options.friction;
                    particle.vy += this.options.gravity;
                    
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                }
                
                // 更新生命值
                particle.life -= particle.decay;
                
                if (particle.life <= 0) {
                    firework.particles.splice(j, 1);
                } else {
                    hasAliveParticles = true;
                }
            }
            
            // 移除没有粒子的烟花
            if (!hasAliveParticles) {
                this.fireworks.splice(i, 1);
            }
        }
    }
    
    drawFireworks() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.fireworks.forEach(firework => {
            firework.particles.forEach(particle => {
                this.ctx.save();
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = particle.color;
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            });
        });
    }
    
    startAnimation() {
        const animate = () => {
            this.updateFireworks();
            this.drawFireworks();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// 导出类
window.MouseFireworksEffect = MouseFireworksEffect;