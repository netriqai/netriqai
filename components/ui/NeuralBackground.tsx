'use client';

import { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasSize();

    // Use fewer particles for better performance
    // Increase particles for a more active "alive" feel
    const numParticles = Math.min(Math.max(Math.floor(width / 40), 20), 50);
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    let mouse = { x: -2000, y: -2000 };
    
    // Throttle mouse movement for performance
    let lastMouseMove = 0;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseMove < 16) return;
      lastMouseMove = now;

      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);

    const handleResize = () => {
      setCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    // Stop animation when not in view
    const intersectionObserver = new IntersectionObserver((entries) => {
      isInView.current = entries[0].isIntersecting;
    });
    intersectionObserver.observe(canvas);

    const linkColorStr = '6, 148, 148'; // True Teal #069494
    let animationId: number;

    const animate = () => {
      if (isInView.current) {
        ctx.clearRect(0, 0, width, height);

        const connectionLimit = 200 * 200; // Increased radius for more active connections
        const mouseLimit = 250 * 250;
        
        // Use a time-based pulse to make it feel alive without mouse interaction
        const pulse = Math.sin(performance.now() / 1500) * 0.15 + 0.85;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${linkColorStr}, 0.95)`;
          ctx.fill();

          // Connect distance
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectionLimit) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              // Ensure a minimum base opacity (0.2) + distance-based fade
              const baseOpacity = 0.2 + (0.6 - dist / 200);
              ctx.strokeStyle = `rgba(${linkColorStr}, ${Math.max(0.1, baseOpacity * pulse)})`;
              ctx.lineWidth = 1.4;
              ctx.stroke();
            }
          }

          // Connect to mouse
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;

          if (mDistSq < mouseLimit) {
            const mDist = Math.sqrt(mDistSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${linkColorStr}, ${0.7 - mDist / 250})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('resize', handleResize);
      intersectionObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 1.0, filter: 'blur(0.5px)', willChange: 'transform' }}
    />
  );
}
