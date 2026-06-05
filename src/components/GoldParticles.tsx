import { useEffect, useState } from "react";

type Particle = { size: number; left: number; delay: number; dur: number };

export function GoldParticles({ count = 18 }: { count?: number }) {
  const [items, setItems] = useState<Particle[]>([]);

  useEffect(() => {
    setItems(
      Array.from({ length: count }, () => ({
        size: 3 + Math.random() * 6,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        dur: 14 + Math.random() * 14,
      }))
    );
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: `-${p.size}px`,
            width: p.size,
            height: p.size,
            borderRadius: "999px",
            background: "radial-gradient(circle, #F2DA8C 0%, #D4AF37 60%, transparent 70%)",
            filter: "blur(0.5px)",
            opacity: 0.7,
            animation: `particleFloat ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
