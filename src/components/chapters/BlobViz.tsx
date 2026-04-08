"use client";

import { useEffect, useRef } from "react";

interface BlobConfig {
  count: number;
  hue: number;
  speed: number;
  blur: number;
  size: [number, number];
}

const presets: Record<string, BlobConfig> = {
  Chapter1: { count: 5, hue: 330, speed: 0.8, blur: 40, size: [80, 160] },
  Chapter2: { count: 4, hue: 20, speed: 0.5, blur: 50, size: [100, 200] },
  Chapter3: { count: 6, hue: 280, speed: 1.0, blur: 35, size: [60, 140] },
  Chapter4: { count: 3, hue: 190, speed: 0.6, blur: 60, size: [120, 220] },
  Chapter5: { count: 5, hue: 350, speed: 0.4, blur: 45, size: [90, 180] },
};

export default function BlobViz({ preset = "Chapter1" }: { preset?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = presets[preset] || presets.Chapter1;

    const dpr = window.devicePixelRatio || 1;
    let w: number, h: number;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();

    interface Blob {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      hueOffset: number;
      phase: number;
    }

    const blobs: Blob[] = Array.from({ length: config.count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      hueOffset: i * (40 / config.count),
      phase: Math.random() * Math.PI * 2,
    }));

    let frame: number;
    let t = 0;

    function draw() {
      t += 0.01;
      ctx!.clearRect(0, 0, w, h);
      ctx!.filter = `blur(${config.blur}px)`;

      for (const blob of blobs) {
        // Drift
        blob.x += blob.vx + Math.sin(t * 0.3 + blob.phase) * 0.3;
        blob.y += blob.vy + Math.cos(t * 0.25 + blob.phase) * 0.3;

        // Wrap around edges with padding
        const pad = blob.r + config.blur;
        if (blob.x < -pad) blob.x = w + pad;
        if (blob.x > w + pad) blob.x = -pad;
        if (blob.y < -pad) blob.y = h + pad;
        if (blob.y > h + pad) blob.y = -pad;

        // Breathing radius
        const breathe = blob.r + Math.sin(t * 0.8 + blob.phase) * blob.r * 0.15;

        // Color
        const hue = config.hue + blob.hueOffset + Math.sin(t * 0.5 + blob.phase) * 10;
        const alpha = 0.35 + Math.sin(t * 0.6 + blob.phase) * 0.1;

        const gradient = ctx!.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, breathe
        );
        gradient.addColorStop(0, `hsla(${hue}, 80%, 55%, ${alpha})`);
        gradient.addColorStop(0.5, `hsla(${hue}, 70%, 45%, ${alpha * 0.6})`);
        gradient.addColorStop(1, `hsla(${hue}, 60%, 35%, 0)`);

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(blob.x, blob.y, breathe, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.filter = "none";
      frame = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      ctx!.resetTransform();
      resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [preset]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[400px] lg:min-h-0"
      style={{ display: "block" }}
    />
  );
}
