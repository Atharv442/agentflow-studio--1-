import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  layer: number; // 1 = foreground, 2 = background
  pulsePhase: number;
  color: string;
}

interface SignalPulse {
  fromIndex: number;
  toIndex: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
}

export const NeuralNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Color palette
    const colors = [
      'rgba(6, 182, 212, ',   // Cyan
      'rgba(139, 92, 246, ',  // Purple/Indigo
      'rgba(168, 85, 247, ',  // Violet
      'rgba(59, 130, 246, ',  // Blue
      'rgba(236, 72, 153, ',  // Pink accent
    ];

    // Node count based on screen area
    const particleCount = Math.min(110, Math.max(50, Math.floor((width * height) / 16000)));

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.5 + 2,
        layer: Math.random() > 0.3 ? 1 : 2,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colorBase,
      });
    }

    // Signal pulses traversing neurons
    const pulses: SignalPulse[] = [];
    const maxPulses = 20;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const maxConnectDistance = 175;

    // Spawn pulses periodically
    const spawnPulse = () => {
      if (pulses.length >= maxPulses || particles.length < 2) return;
      const fromIndex = Math.floor(Math.random() * particles.length);
      const p1 = particles[fromIndex];

      // Find valid close neighbor
      const neighbors: number[] = [];
      particles.forEach((p2, idx) => {
        if (idx === fromIndex) return;
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxConnectDistance) {
          neighbors.push(idx);
        }
      });

      if (neighbors.length > 0) {
        const toIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
        pulses.push({
          fromIndex,
          toIndex,
          progress: 0,
          speed: 0.012 + Math.random() * 0.025,
          color: p1.color,
        });
      }
    };

    let pulseTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark canvas base gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        100,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, 'rgba(10, 14, 26, 0.95)');
      bgGrad.addColorStop(1, 'rgba(5, 7, 12, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Synaptic Connections (Edges)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDistance) {
            const opacity = (1 - dist / maxConnectDistance) * 0.38;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Particles (Neuron Nodes)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce at boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        p.pulsePhase += 0.04;
        const glowRadius = p.radius + Math.sin(p.pulsePhase) * 1.2;

        // Draw node aura halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.15)';
        ctx.fill();

        // Draw core node
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, glowRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.95)';
        ctx.shadowBlur = 16;
        ctx.shadowColor = p.color + '1)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Mouse Connection Beams
      if (mouseRef.current.active) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        particles.forEach((p) => {
          const dist = Math.hypot(p.x - mx, p.y - my);
          if (dist < 220) {
            const opacity = (1 - dist / 220) * 0.65;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Gently attract particles towards cursor
            p.x += (mx - p.x) * 0.0015;
            p.y += (my - p.y) * 0.0015;
          }
        });
      }

      // Update & Draw Signal Pulses along Synapses
      pulseTimer++;
      if (pulseTimer % 10 === 0) {
        spawnPulse();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const p1 = particles[pulse.fromIndex];
        const p2 = particles[pulse.toIndex];

        if (!p1 || !p2) {
          pulses.splice(i, 1);
          continue;
        }

        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const currentX = p1.x + (p2.x - p1.x) * pulse.progress;
        const currentY = p1.y + (p2.y - p1.y) * pulse.progress;

        // Glowing pulse head
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 18;
        ctx.shadowColor = pulse.color + '1)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
    />
  );
};
