import { useEffect, useState } from "react";

type Dot = {
  id: number;
  top: number;
  left: number;
  size: number;
  drift: number;
  rise: number;
  life: number;
  delay: number;
  opacity: number;
  cycle: number;
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function makeDot(id: number, withDelay = false): Dot {
  return {
    id,
    top: rand(0, 100),
    left: rand(0, 100),
    size: rand(3, 7),
    drift: rand(-25, 25),
    rise: rand(-35, -10),
    life: rand(6, 11),
    delay: withDelay ? rand(0, 6) : rand(0, 1.5),
    opacity: rand(0.05, 0.15),
    cycle: 0,
  };
}

export function PulseDots({ count = 16 }: { count?: number }) {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    setDots(Array.from({ length: count }, (_, i) => makeDot(i, true)));
  }, [count]);

  const respawn = (id: number) =>
    setDots((prev) =>
      prev.map((d) => (d.id === id ? { ...makeDot(id, false), cycle: d.cycle + 1 } : d))
    );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={`${d.id}-${d.cycle}`}
          onAnimationEnd={() => respawn(d.id)}
          className="absolute rounded-full"
          style={
            {
              top: `${d.top}%`,
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              background:
                "radial-gradient(circle, #F2DA8C 0%, #D4AF37 60%, transparent 75%)",
              boxShadow: "0 0 6px rgba(212,175,55,.35)",
              opacity: 0,
              willChange: "opacity, transform",
              animation: `dotLife ${d.life}s ease-in-out ${d.delay}s 1 forwards`,
              ["--dot-opacity" as any]: d.opacity,
              ["--dot-x" as any]: `${d.drift}px`,
              ["--dot-y" as any]: `${d.rise}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
