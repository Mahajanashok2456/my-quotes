import React, { useRef, useEffect } from 'react';

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createStars(num, width, height) {
  return Array.from({ length: num }, () => ({
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    r: randomBetween(0.5, 1.8),
    dx: randomBetween(-0.05, 0.05),
    dy: randomBetween(-0.05, 0.05),
    shine: Math.random(),
  }));
}

export default function StarsBackground({ numStars = 120 }) {
  const canvasRef = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    let stars = createStars(numStars, width, height);

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let star of stars) {
        // Move
        star.x += star.dx;
        star.y += star.dy;
        if (star.x < 0 || star.x > width) star.dx *= -1;
        if (star.y < 0 || star.y > height) star.dy *= -1;
        // Shine
        star.shine += randomBetween(-0.02, 0.02);
        if (star.shine < 0.2) star.shine = 0.2;
        if (star.shine > 1) star.shine = 1;
        // Draw
        ctx.save();
        ctx.globalAlpha = star.shine;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars = createStars(numStars, width, height);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [numStars]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
} 