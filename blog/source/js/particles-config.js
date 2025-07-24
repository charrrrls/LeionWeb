/**
 * LeionWeb 粒子背景配置
 * 正常参数的粒子特效
 */

window.particlesConfig = {
  "particles": {
    "number": {
      "value": 80,        // 正常粒子数量
      "density": {
        "enable": true,
        "value_area": 800   // 正常密度
      }
    },
    "color": {
      "value": "#ffffff"   // 白色粒子
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    "opacity": {
      "value": 0.5,        // 正常透明度
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,          // 正常粒子尺寸
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,     // 正常连线距离
      "color": "#ffffff",
      "opacity": 0.4,      // 正常连线透明度
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,          // 正常移动速度
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,      // 启用鼠标悬停效果
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,      // 启用点击效果
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
};