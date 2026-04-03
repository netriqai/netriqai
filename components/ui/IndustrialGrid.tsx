'use client';

import { useEffect, useRef } from 'react';

interface IndustrialGridProps {
  className?: string;
}

// Data Signal Particle
class SignalParticle {
  x: number;
  y: number;
  speed: number;
  life: number;
  maxLife: number;
  dir: 'h' | 'v';

  constructor(w: number, h: number, gridSize: number, dpr: number) {
    this.dir = Math.random() > 0.5 ? 'h' : 'v';
    // Lock start positions to the grid
    this.x = Math.floor(Math.random() * (w / (gridSize * dpr))) * gridSize * dpr;
    this.y = Math.floor(Math.random() * (h / (gridSize * dpr))) * gridSize * dpr;
    this.speed = (2 + Math.random() * 3) * dpr; // Faster, more noticeable
    if (Math.random() > 0.5) this.speed *= -1; // Move in both directions
    this.maxLife = 100 + Math.random() * 200;
    this.life = this.maxLife;
  }

  update() {
    if (this.dir === 'h') this.x += this.speed;
    else this.y += this.speed;
    this.life--;
  }
}

export default function IndustrialGrid({ className }: IndustrialGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 };
    let particles: SignalParticle[] = [];
    const gridSize = 100; // Slightly tighter grid for denser circuitry
    let colorRGB = '6, 148, 148';
    let dpr = 1;

    const updateThemeStyles = () => {
      const isDark = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark';
      
      const styles = getComputedStyle(document.documentElement);
      const primary = styles.getPropertyValue('--accent-blue').trim();
      if (primary) colorRGB = primary.split(' ').join(', ');
      else colorRGB = '6, 148, 148';
      renderGridBuffer();
    };

    // Pre-render the complex static circuit into a buffer
    const renderGridBuffer = () => {
      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement('canvas');
      }
      const buffer = offscreenCanvasRef.current;
      buffer.width = canvas.width;
      buffer.height = canvas.height;
      const bCtx = buffer.getContext('2d');
      if (!bCtx) return;

      // 1. Draw base faint utility grid
      bCtx.beginPath();
      bCtx.strokeStyle = `rgba(${colorRGB}, 0.03)`;
      bCtx.lineWidth = 1 * dpr;
      for (let x = 0; x <= canvas.width; x += gridSize * dpr) {
        bCtx.moveTo(x, 0); bCtx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += gridSize * dpr) {
        bCtx.moveTo(0, y); bCtx.lineTo(canvas.width, y);
      }
      bCtx.stroke();

      // 2. Procedural Circuit Traces
      const numTraces = Math.floor((canvas.width * canvas.height) / (gridSize * gridSize * 10 * dpr * dpr));
      
      bCtx.lineCap = 'round';
      bCtx.lineJoin = 'round';

      for (let i = 0; i < numTraces; i++) {
        let curX = Math.floor(Math.random() * (canvas.width / (gridSize * dpr))) * gridSize * dpr;
        let curY = Math.floor(Math.random() * (canvas.height / (gridSize * dpr))) * gridSize * dpr;
        
        bCtx.beginPath();
        bCtx.strokeStyle = `rgba(${colorRGB}, ${0.06 + Math.random() * 0.1})`;
        bCtx.fillStyle = bCtx.strokeStyle;
        bCtx.lineWidth = (Math.random() > 0.8 ? 1.5 : 1) * dpr;
        bCtx.moveTo(curX, curY);

        // Origin Node (Solder pad)
        bCtx.arc(curX, curY, 3 * dpr, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.moveTo(curX, curY);

        let segments = 2 + Math.floor(Math.random() * 5);
        for (let s = 0; s < segments; s++) {
          const length = (1 + Math.floor(Math.random() * 3)) * gridSize * dpr;
          const dir = Math.floor(Math.random() * 4); // 0=R, 1=D, 2=L, 3=U

          let nextX = curX;
          let nextY = curY;

          // Introduce occasional 45-degree angle elbows
          if (Math.random() > 0.7) {
            const diag = Math.random() > 0.5 ? length : -length;
            nextX += diag;
            nextY += diag;
          } else {
            if (dir === 0) nextX += length;
            else if (dir === 1) nextY += length;
            else if (dir === 2) nextX -= length;
            else if (dir === 3) nextY -= length;
          }

          bCtx.lineTo(nextX, nextY);
          curX = nextX;
          curY = nextY;
        }
        bCtx.stroke();

        // End Component (Capacitor/Resistor/Pad)
        bCtx.beginPath();
        const endType = Math.random();
        if (endType > 0.6) {
          // Double ring
          bCtx.arc(curX, curY, 5 * dpr, 0, Math.PI * 2);
          bCtx.stroke();
          bCtx.beginPath();
          bCtx.arc(curX, curY, 2 * dpr, 0, Math.PI * 2);
          bCtx.fill();
        } else if (endType > 0.3) {
          // Micro box
          bCtx.fillRect(curX - 4 * dpr, curY - 4 * dpr, 8 * dpr, 8 * dpr);
        } else {
          // Parallel termination lines
          const isHoriz = Math.random() > 0.5;
          if (isHoriz) {
            bCtx.moveTo(curX - 8 * dpr, curY); bCtx.lineTo(curX + 8 * dpr, curY);
            bCtx.moveTo(curX - 8 * dpr, curY + 4 * dpr); bCtx.lineTo(curX + 8 * dpr, curY + 4 * dpr);
          } else {
            bCtx.moveTo(curX, curY - 8 * dpr); bCtx.lineTo(curX, curY + 8 * dpr);
            bCtx.moveTo(curX + 4 * dpr, curY - 8 * dpr); bCtx.lineTo(curX + 4 * dpr, curY + 8 * dpr);
          }
          bCtx.stroke();
        }
      }

      // 3. Central Processors (Large Microchips) - Spatially distributed
      // We divide the screen into macro-cells to ensure chips never clump up
      const macroCellSize = 600 * dpr;
      const chipCols = Math.max(1, Math.floor(canvas.width / macroCellSize));
      const chipRows = Math.max(1, Math.floor(canvas.height / macroCellSize));
      
      for (let row = 0; row < chipRows; row++) {
        for (let col = 0; col < chipCols; col++) {
          
          const cellWidth = canvas.width / chipCols;
          const cellHeight = canvas.height / chipRows;
          
          // Random position inside its designated cell (leaving a 20% margin)
          let cx = col * cellWidth + cellWidth * 0.2 + Math.random() * (cellWidth * 0.6);
          let cy = row * cellHeight + cellHeight * 0.2 + Math.random() * (cellHeight * 0.6);
          
          // Snap back to the underlying 100px grid for perfect alignment
          cx = Math.floor(cx / (gridSize * dpr)) * gridSize * dpr;
          cy = Math.floor(cy / (gridSize * dpr)) * gridSize * dpr;
          
          const sizeMultX = 1 + Math.floor(Math.random() * 4); // Varying widths
          const sizeMultY = 1 + Math.floor(Math.random() * 4); // Varying heights
          const cw = sizeMultX * gridSize * 0.4 * dpr;
          const ch = sizeMultY * gridSize * 0.4 * dpr;

          // Chip body
          bCtx.fillStyle = `rgba(${colorRGB}, 0.02)`;
          bCtx.strokeStyle = `rgba(${colorRGB}, 0.15)`;
          bCtx.lineWidth = 1.5 * dpr;
          bCtx.fillRect(cx - cw/2, cy - ch/2, cw, ch);
          bCtx.strokeRect(cx - cw/2, cy - ch/2, cw, ch);

          // Chip pins
          bCtx.beginPath();
          bCtx.lineWidth = 1.5 * dpr;
          const pinSpacing = 10 * dpr;
          const numPins = Math.floor(cw / pinSpacing) - 1;
          
          // Top and bottom pins
          for(let p = 1; p <= numPins; p++) {
             const px = (cx - cw/2) + p * pinSpacing;
             bCtx.moveTo(px, cy - ch/2); bCtx.lineTo(px, cy - ch/2 - 6 * dpr);
             bCtx.moveTo(px, cy + ch/2); bCtx.lineTo(px, cy + ch/2 + 6 * dpr);
          }
          // Left and right pins
          for(let p = 1; p <= numPins; p++) {
             const py = (cy - ch/2) + p * pinSpacing;
             bCtx.moveTo(cx - cw/2, py); bCtx.lineTo(cx - cw/2 - 6 * dpr, py);
             bCtx.moveTo(cx + cw/2, py); bCtx.lineTo(cx + cw/2 + 6 * dpr, py);
          }
          bCtx.stroke();
        }
      }

      // 4. Abstract Graphics Card Architecture (Centerpiece Schematic)
      // Draws a massive, stylized mechanical blueprint of a GPU directly into the grid
      const gpuW = Math.min(canvas.width * 0.7, 1200 * dpr);
      const gpuH = gpuW * 0.45;
      const gpuX = canvas.width / 2;
      const gpuY = canvas.height / 2;

      bCtx.save();
      bCtx.translate(gpuX, gpuY);
      bCtx.strokeStyle = `rgba(${colorRGB}, 0.15)`; // Prominent blueprint ink
      bCtx.lineWidth = 1 * dpr;
      
      // Main GPU shroud outline (rounded rect)
      bCtx.beginPath();
      bCtx.roundRect(-gpuW/2, -gpuH/2, gpuW, gpuH, 20 * dpr);
      bCtx.stroke();
      
      // Inner recessed frame
      bCtx.beginPath();
      bCtx.roundRect(-gpuW/2 + 20*dpr, -gpuH/2 + 20*dpr, gpuW - 40*dpr, gpuH - 40*dpr, 10 * dpr);
      bCtx.stroke();

      // RTX Founders Edition styled 'X' cross-bracket
      bCtx.beginPath();
      bCtx.moveTo(0, -gpuH/2);
      bCtx.lineTo(-gpuW/6, 0);
      bCtx.lineTo(0, gpuH/2);
      bCtx.lineTo(gpuW/6, 0);
      bCtx.closePath();
      bCtx.stroke();

      // Cooling fins array (parallel heat dissipation fins on the left chamber)
      bCtx.beginPath();
      bCtx.strokeStyle = `rgba(${colorRGB}, 0.08)`; // Fainter but visible
      const finsMaxX = -gpuW/6 - 20*dpr;
      for (let fx = -gpuW/2 + 30*dpr; fx < finsMaxX; fx += 8*dpr) {
          bCtx.moveTo(fx, -gpuH/2 + 30*dpr);
          bCtx.lineTo(fx, gpuH/2 - 30*dpr);
      }
      bCtx.stroke();

      // Right chamber: Massive turbine cooling fan
      bCtx.beginPath();
      bCtx.strokeStyle = `rgba(${colorRGB}, 0.15)`;
      const fanCenter = gpuW/4;
      const fanRadius = gpuH * 0.38;
      
      // Outer fan ring
      bCtx.arc(fanCenter, 0, fanRadius, 0, Math.PI * 2);
      bCtx.stroke();
      
      // Inner motor hub
      bCtx.beginPath();
      bCtx.arc(fanCenter, 0, fanRadius * 0.25, 0, Math.PI * 2);
      bCtx.stroke();
      
      // Turbine blades
      bCtx.beginPath();
      bCtx.strokeStyle = `rgba(${colorRGB}, 0.1)`;
      const numBlades = 11;
      for (let b = 0; b < numBlades; b++) {
          const angle = (b * Math.PI * 2) / numBlades;
          const px1 = fanCenter + Math.cos(angle) * fanRadius * 0.25;
          const py1 = Math.sin(angle) * fanRadius * 0.25;
          const px2 = fanCenter + Math.cos(angle + 0.4) * fanRadius;
          const py2 = Math.sin(angle + 0.4) * fanRadius;
          
          bCtx.moveTo(px1, py1);
          // Gently curved blades
          bCtx.quadraticCurveTo(
              fanCenter + Math.cos(angle + 0.1) * fanRadius * 0.7, 
              Math.sin(angle + 0.1) * fanRadius * 0.7, 
              px2, 
              py2
          );
      }
      bCtx.stroke();

      // Left chamber: Neural processor die & VRAM modules
      bCtx.beginPath();
      bCtx.strokeStyle = `rgba(${colorRGB}, 0.2)`;
      bCtx.fillStyle = `rgba(${colorRGB}, 0.05)`;
      const coreSize = gpuH * 0.22;
      const dieOffset = -gpuW/3.2; // Move it to the left side
      // GPU Die
      bCtx.rect(dieOffset - coreSize/2, -coreSize/2, coreSize, coreSize);
      bCtx.fill();
      bCtx.stroke();
      
      // Surrounding VRAM Memory Banks
      bCtx.beginPath();
      const vSize = coreSize * 0.45;
      const vDist = coreSize * 0.75;
      // Top row
      bCtx.rect(dieOffset - vSize*1.2, -vDist, vSize, vSize);
      bCtx.rect(dieOffset, -vDist, vSize, vSize);
      bCtx.rect(dieOffset + vSize*1.2, -vDist, vSize, vSize);
      // Bottom row
      bCtx.rect(dieOffset - vSize*1.2, vDist - vSize, vSize, vSize);
      bCtx.rect(dieOffset, vDist - vSize, vSize, vSize);
      bCtx.rect(dieOffset + vSize*1.2, vDist - vSize, vSize, vSize);
      // Side columns
      bCtx.rect(dieOffset - vDist, -vSize/2, vSize, vSize);
      bCtx.rect(dieOffset + vDist - vSize, -vSize/2, vSize, vSize);
      bCtx.stroke();

      // PCIe Contact Bus (Bottom edge)
      bCtx.beginPath();
      bCtx.strokeStyle = `rgba(${colorRGB}, 0.15)`;
      bCtx.rect(-gpuW/2 + 50*dpr, gpuH/2, gpuW * 0.45, 12*dpr);
      bCtx.stroke();
      
      // PCIe golden fingers
      bCtx.beginPath();
      bCtx.strokeStyle = `rgba(${colorRGB}, 0.1)`;
      for (let pinX = -gpuW/2 + 55*dpr; pinX < -gpuW/2 + 50*dpr + gpuW * 0.45 - 5*dpr; pinX += 4*dpr) {
          bCtx.moveTo(pinX, gpuH/2);
          bCtx.lineTo(pinX, gpuH/2 + 12*dpr);
      }
      bCtx.stroke();

      bCtx.restore();
    };

    const resize = () => {
      // Cap DPR at 2.0 for performance on ultra-high DPI screens
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      updateThemeStyles();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX * dpr;
      mouse.y = e.clientY * dpr;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const themeObs = new MutationObserver(updateThemeStyles);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    
    resize();

    const draw = () => {
      // Determine if we need a redraw (if particles exist or mouse is in viewport)
      const isMouseInWindow = mouse.x >= 0 && mouse.x <= canvas.width && mouse.y >= 0 && mouse.y <= canvas.height;
      const shouldDraw = particles.length > 0 || isMouseInWindow;
      
      if (shouldDraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (offscreenCanvasRef.current) {
          ctx.drawImage(offscreenCanvasRef.current, 0, 0);
        }

        // Signal Emissions - Throttled for smoother background performance
        if (particles.length < 12 && Math.random() < 0.02) {
          particles.push(new SignalParticle(canvas.width, canvas.height, gridSize, dpr));
        }

        ctx.save();
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.update();
          
          const fade = Math.sin((p.life / p.maxLife) * Math.PI);
          const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 150 + p.life);
          const opacity = fade * 0.3 * pulse; 

          ctx.fillStyle = `rgba(${colorRGB}, ${opacity})`;
          ctx.shadowColor = `rgba(${colorRGB}, ${opacity * 1.2})`;
          ctx.shadowBlur = 4 * dpr; 
          
          ctx.beginPath();
          let pLength = (12 + Math.random() * 15) * dpr;
          
          if (p.dir === 'h') {
            const tailX = p.speed > 0 ? p.x - pLength : p.x + pLength;
            let startX = Math.min(p.x, tailX);
            ctx.roundRect(startX, p.y - 1 * dpr, pLength, 2 * dpr, 1.5 * dpr);
          } else {
            const tailY = p.speed > 0 ? p.y - pLength : p.y + pLength;
            let startY = Math.min(p.y, tailY);
            ctx.roundRect(p.x - 1 * dpr, startY, 2 * dpr, pLength, 1.5 * dpr);
          }
          ctx.fill();

          if (p.life <= 0 || p.x > canvas.width || p.x < 0 || p.y > canvas.height || p.y < 0) {
            particles.splice(i, 1);
          }
        }
        ctx.restore();

        // Mouse Hover Interference - Subtle radial reveal
        if (isMouseInWindow) {
          const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 350 * dpr);
          grad.addColorStop(0, `rgba(${colorRGB}, 0.05)`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else if (offscreenCanvasRef.current) {
        // Static frame drawing (one-time if no movement)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvasRef.current, 0, 0);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      themeObs.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Deep background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-blue),0.04)_0%,transparent_70%)] pointer-events-none" />
      <canvas 
        ref={canvasRef} 
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-25 dark:opacity-45 dark:mix-blend-screen will-change-transform ${className}`} 
        style={{ backfaceVisibility: 'hidden' }}
      />
    </>
  );
}
