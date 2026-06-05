export function HeroPortrait({ imageUrl }: { imageUrl?: string; label?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[272px] animate-fade-up">
      <div aria-hidden className="absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[110%] w-[110%] rounded-[40%] border border-[#D4AF37]/30 animate-pulse" />
        <div className="absolute h-[90%] w-[90%] rounded-[40%] border border-[#D4AF37]/40" />
        <div className="absolute h-[70%] w-[70%] rounded-[40%] border border-[#D4AF37]/30" />
      </div>
      <FloatingDots />
      <div className="relative aspect-[3/4] overflow-hidden rounded-[42%/32%] border border-[#D4AF37]/50 bg-gradient-to-br from-[#FFF6F1] via-[#FADADD] to-[#FFF1F4] shadow-rose-glow">
        {imageUrl ? (
          <img src={imageUrl} alt="Maria Clara" className="h-full w-full object-cover animate-fade-in" />
        ) : null}
      </div>
    </div>
  );
}

export function FloatingDots() {
  const dots = [
    { top: "4%", left: "10%", size: 6, delay: "0s" },
    { top: "12%", left: "82%", size: 5, delay: ".6s" },
    { top: "30%", left: "-2%", size: 4, delay: "1.1s" },
    { top: "48%", left: "96%", size: 6, delay: ".3s" },
    { top: "70%", left: "4%", size: 5, delay: ".9s" },
    { top: "86%", left: "78%", size: 7, delay: "1.4s" },
    { top: "94%", left: "20%", size: 4, delay: ".5s" },
    { top: "22%", left: "50%", size: 3, delay: "1.7s" },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            background: "radial-gradient(circle, #F2DA8C 0%, #D4AF37 60%, transparent 75%)",
            boxShadow: "0 0 8px rgba(212,175,55,.55)",
            animation: `goldPulse 3.4s ease-in-out ${d.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
