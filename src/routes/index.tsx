import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { GoldParticles } from "@/components/GoldParticles";
import { INSTAGRAM_URL } from "@/components/Footer";
import { fetchContent, defaults } from "@/lib/content";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: content } = useQuery({ queryKey: ["content"], queryFn: fetchContent, initialData: defaults });
  const hero = content!.home_hero;

  return (
    <main className="relative min-h-screen overflow-hidden bg-rose-radial">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(circle, #FADADD 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl" style={{ background: "radial-gradient(circle, #F5E5C0 0%, transparent 70%)" }} />
      </div>
      <GoldParticles count={28} />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16 text-center">
        {/* Hero portrait */}
        <HeroPortrait imageUrl={hero.image_url} />

        {/* Name */}
        <div className="gold-divider mb-3 mt-8 animate-fade-up justify-center" style={{ animationDelay: ".15s" }}>
          <span className="gold-divider-line" />
          <span>premium</span>
          <span className="gold-divider-line" />
        </div>
        <h1 className="font-display text-4xl tracking-[0.2em] text-gold md:text-5xl animate-fade-up text-center" style={{ animationDelay: ".2s" }}>
          {hero.name}
        </h1>
        <p className="mt-3 text-xs tracking-[0.32em] uppercase text-[color:var(--muted-foreground)] animate-fade-up text-center" style={{ animationDelay: ".3s" }}>
          {hero.subtitle}
        </p>
        <p className="mt-5 max-w-xs text-sm leading-relaxed text-[color:var(--foreground)]/80 animate-fade-up text-center mx-auto" style={{ animationDelay: ".4s" }}>
          “{hero.tagline}”
        </p>

        {/* Buttons */}
        <div className="mt-9 flex w-full flex-col gap-3.5">
          <LinkBtn to="/catalogo" delay=".5s" primary>
            VER CATÁLOGO
          </LinkBtn>
          <AnchorBtn href={hero.whatsapp_url || "#"} delay=".6s" external icon={<MessageCircle className="h-4 w-4" />}>
            WHATSAPP
          </AnchorBtn>
          <AnchorBtn href={INSTAGRAM_URL} delay=".7s" external icon={<Instagram className="h-4 w-4" />}>
            INSTAGRAM
          </AnchorBtn>
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#B8902A] hover:text-[#D4AF37] transition animate-fade-up"
          style={{ animationDelay: ".9s" }}
        >
          <Instagram className="h-3.5 w-3.5" /> @mariaclara.sm__
        </a>
      </section>
    </main>
  );
}

function HeroPortrait({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[272px] animate-fade-up">
      {/* Concentric gold rings */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[110%] w-[110%] rounded-[40%] border border-[#D4AF37]/30" />
        <div className="absolute h-[90%] w-[90%] rounded-[40%] border border-[#D4AF37]/40" />
        <div className="absolute h-[70%] w-[70%] rounded-[40%] border border-[#D4AF37]/30" />
      </div>
      {/* Floating golden dots around */}
      <FloatingDots />

      <div className="relative aspect-[3/4] overflow-hidden rounded-[42%/32%] border border-[#D4AF37]/50 bg-gradient-to-br from-[#FFF6F1] via-[#FADADD] to-[#FFF1F4] shadow-rose-glow">
        {imageUrl ? (
          <img src={imageUrl} alt="Maria Clara" className="h-full w-full object-cover animate-fade-in" />
        ) : null}
      </div>
    </div>
  );
}


function FloatingDots() {
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


function LinkBtn({ to, children, delay, primary }: { to: string; children: React.ReactNode; delay?: string; primary?: boolean }) {
  return (
    <Link
      to={to}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full border px-6 py-4 text-xs font-medium tracking-[0.28em] uppercase transition-all hover-lift hover-lift-on animate-fade-up ${
        primary
          ? "border-transparent bg-gold-grad text-white shadow-soft-gold"
          : "border-gold bg-white/70 text-[color:var(--foreground)] glass"
      }`}
      style={{ animationDelay: delay }}
    >
      {children}
      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function AnchorBtn({ href, children, delay, external, icon }: { href: string; children: React.ReactNode; delay?: string; external?: boolean; icon?: React.ReactNode }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group relative inline-flex items-center justify-center gap-3 rounded-full border border-gold bg-white/70 px-6 py-4 text-xs font-medium tracking-[0.28em] uppercase text-[color:var(--foreground)] transition-all glass hover-lift hover-lift-on animate-fade-up"
      style={{ animationDelay: delay }}
    >
      {icon}
      {children}
    </a>
  );
}
