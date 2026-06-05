import { useEffect, useState } from "react";

const KEY = "mc_splash_shown";

export function Splash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;
    setShow(true);
    sessionStorage.setItem(KEY, "1");
    const t = setTimeout(() => setShow(false), 2100);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white animate-fade-in"
      style={{ animation: "fadeIn .3s ease-out both, fadeIn .4s ease-out 1.7s reverse both" }}
    >
      <div className="text-center">
        <div className="gold-divider mb-6 justify-center">
          <span className="gold-divider-line" />
          <span>maison</span>
          <span className="gold-divider-line" />
        </div>
        <h1
          className="font-display text-5xl md:text-7xl tracking-[0.18em] animate-name-reveal"
          style={{ background: "var(--gradient-gold-text)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
        >
          MARIA CLARA
        </h1>
        <div
          className="mx-auto mt-6 h-px w-40 bg-gold-grad animate-line-grow"
          style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
        />
      </div>
    </div>
  );
}
