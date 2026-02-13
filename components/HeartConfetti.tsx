import React, { useEffect, useRef } from 'react';

const HeartConfetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const particleCount = 150;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = canvas!.height + Math.random() * 200; // Start below screen
        this.size = Math.random() * 20 + 10;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * -5 - 3; // Move upwards
        this.color = '#DC143C'; // Crimson
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.05; // Gravity-ish but simpler for confetti explosion
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        
        // Draw Heart
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, this.size / 2, 0, this.size, 0, this.size);
        ctx.bezierCurveTo(0, this.size, this.size / 2, this.size / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      canvas.width = 1920;
      canvas.height = 1080;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.update();
        p.draw();
        // Reset or remove if out of bounds (optional, here we just let them fly up/fall)
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none z-50 w-full h-full"
    />
  );
};

export default HeartConfetti;
