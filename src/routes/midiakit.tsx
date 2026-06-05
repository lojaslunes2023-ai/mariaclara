import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Instagram, Mail, MessageCircle, Sparkles, Camera, Film, ShoppingBag, Image as ImageIcon, Heart, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchContent, defaults } from "@/lib/content";
import { Footer, INSTAGRAM_URL } from "@/components/Footer";
import { HeroPortrait } from "@/components/HeroPortrait";
import { useReveal } from "@/lib/use-reveal";

export const Route = createFileRoute("/midiakit")({
  component: MidiaKit,
});

async function fetchAll() {
  const [content, portfolio, brands, testimonials, audience, pkgs, combos] = await Promise.all([
    fetchContent(),
    supabase.from("gallery_items").select("*").eq("section", "midiakit_portfolio").order("sort_order"),
    supabase.from("brands").select("*").order("sort_order"),
    supabase.from("testimonials").select("*").order("sort_order"),
    supabase.from("audience_segments").select("*").order("sort_order"),
    supabase.from("packages").select("*").order("sort_order"),
    supabase.from("combos").select("*").order("sort_order"),
  ]);
  return {
    content,
    portfolio: portfolio.data ?? [],
    brands: brands.data ?? [],
    testimonials: testimonials.data ?? [],
    audience: audience.data ?? [],
    packages: pkgs.data ?? [],
    combos: combos.data ?? [],
  };
}


function MidiaKit() {
  useReveal();
  const { data } = useQuery({ queryKey: ["midiakit"], queryFn: fetchAll, initialData: { content: defaults, portfolio: [], brands: [], testimonials: [], audience: [], packages: [], combos: [] } as any });
  const c = data!.content;
  const hero = c.midiakit_hero;
  const about = c.midiakit_about;
  const m = c.midiakit_metrics;
  const wa = hero.whatsapp_url || "#";

  return (
    <main className="relative min-h-screen overflow-hidden bg-rose-grad">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center md:py-28">
          <HeroPortrait imageUrl={hero.image_url} />
          <div className="gold-divider mt-8 mb-3 justify-center animate-fade-up">
            <span className="gold-divider-line" /><span>media kit</span><span className="gold-divider-line" />
          </div>
          <h1 className="font-display text-4xl tracking-[0.06em] text-gold md:text-5xl animate-fade-up">{hero.name}</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.32em] text-[color:var(--muted-foreground)] animate-fade-up">{hero.subtitle}</p>
          <p className="mt-5 max-w-sm text-sm italic text-[color:var(--foreground)]/80 animate-fade-up">“{hero.tagline}”</p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-grad px-7 py-4 text-xs font-medium uppercase tracking-[0.28em] text-white shadow-soft-gold hover-lift hover-lift-on animate-fade-up">
            <MessageCircle className="h-4 w-4" /> Solicitar Parceria
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <Section title={about.title} eyebrow="apresentação">
        <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-[color:var(--foreground)]/80 reveal">{about.body}</p>
      </Section>


      {/* PACOTES */}
      <Section title="Pacotes Fotográficos" eyebrow="ensaios">
        <CardsGrid items={data!.packages} type="package" wa={wa} />
      </Section>

      {/* COMBOS */}
      <Section title="Combos Provador" eyebrow="premium">
        <CardsGrid items={data!.combos} type="combo" wa={wa} />
      </Section>



      {/* TESTIMONIALS */}
      <Section title="Depoimentos" eyebrow="confiança">
        <TestimonialsSlider items={data!.testimonials} />
      </Section>

      {/* CONTATO */}
      <Section title="Contato" eyebrow="vamos conversar">
        <div className="flex flex-wrap items-center justify-center gap-4 reveal">
          <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gold-grad px-7 py-4 text-xs uppercase tracking-[0.28em] text-white shadow-soft-gold hover-lift hover-lift-on">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gold bg-white/70 px-7 py-4 text-xs uppercase tracking-[0.28em] text-[color:var(--foreground)] glass hover-lift hover-lift-on">
            <Instagram className="h-4 w-4" /> Instagram
          </a>
          {hero.email && (
            <a href={`mailto:${hero.email}`} className="inline-flex items-center gap-2 rounded-full border border-gold bg-white/70 px-7 py-4 text-xs uppercase tracking-[0.28em] text-[color:var(--foreground)] glass hover-lift hover-lift-on">
              <Mail className="h-4 w-4" /> Email
            </a>
          )}
        </div>
      </Section>

      <Footer />
    </main>
  );
}

function Section({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12 text-center reveal">
        {eyebrow && (
          <div className="gold-divider justify-center">
            <span className="gold-divider-line" /><span>{eyebrow}</span><span className="gold-divider-line" />
          </div>
        )}
        <h2 className="font-display mt-4 text-4xl text-gold md:text-5xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CardsGrid({ items, type, wa }: { items: any[]; type: "package" | "combo"; wa: string }) {
  if (!items.length) {
    return <p className="text-center text-sm text-[color:var(--muted-foreground)]">Em breve novidades aqui.</p>;
  }
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <article key={it.id} className="group reveal overflow-hidden rounded-3xl border border-gold/30 bg-white/80 shadow-elegant hover-lift hover-lift-on glass">
          <div className="zoom-img relative aspect-[4/5] overflow-hidden bg-[#FADADD]/30">
            {it.image_url ? <img src={it.image_url} alt={it.title} className="zoom-img-inner h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[#D4AF37]/40"><Sparkles /></div>}
          </div>
          <div className="p-6">
            <h3 className="font-display text-2xl text-gold">{it.title}</h3>
            {it.description && <p className="mt-2 text-sm text-[color:var(--foreground)]/70">{it.description}</p>}
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-xl text-[#B8902A]">{it.price}</span>
              <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-gold-grad px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white shadow-soft-gold hover-lift hover-lift-on">
                {type === "combo" ? "Quero esse combo" : "Contratar"}
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}


function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const numMatch = value.match(/[\d.,]+/);
    if (!numMatch) { setDisplay(value); return; }
    const suffix = value.replace(numMatch[0], "");
    const target = parseFloat(numMatch[0].replace(",", "."));
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const cur = target * eased;
          const formatted = target >= 10 ? Math.round(cur).toString() : cur.toFixed(1);
          setDisplay(formatted + suffix);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="reveal rounded-3xl border border-gold/30 bg-white/80 p-6 text-center glass shadow-elegant hover-lift hover-lift-on">
      <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-grad text-white shadow-soft-gold">{icon}</div>
      <div className="font-display mt-4 text-4xl text-gold">{display}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">{label}</div>
    </div>
  );
}

function AudienceGrid({ items }: { items: any[] }) {
  const cats = ["age", "gender", "location"] as const;
  const titles: Record<string, string> = { age: "Faixa Etária", gender: "Gênero", location: "Localização" };
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cats.map((cat) => {
        const list = items.filter((i) => i.category === cat);
        return (
          <div key={cat} className="reveal rounded-3xl border border-gold/30 bg-white/80 p-6 glass shadow-elegant">
            <h3 className="font-display text-2xl text-gold">{titles[cat]}</h3>
            <ul className="mt-4 space-y-3">
              {list.length ? list.map((i) => (
                <li key={i.id} className="flex items-center justify-between border-b border-gold/15 pb-2 text-sm">
                  <span className="text-[color:var(--foreground)]/80">{i.label}</span>
                  <span className="font-display text-lg text-[#B8902A]">{i.value}</span>
                </li>
              )) : <li className="text-xs text-[color:var(--muted-foreground)]">Em breve.</li>}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function BrandsCarousel({ brands }: { brands: any[] }) {
  if (!brands.length) return <p className="text-center text-sm text-[color:var(--muted-foreground)]">Em breve.</p>;
  const items = [...brands, ...brands];
  return (
    <div className="reveal overflow-hidden">
      <div className="flex w-max items-center gap-12 animate-marquee">
        {items.map((b, i) => (
          <div key={i} className="flex h-20 w-32 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-white/80 p-3 glass shadow-elegant">
            <img src={b.logo_url} alt={b.name} className="max-h-full max-w-full object-contain opacity-80" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsSlider({ items }: { items: any[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);
  if (!items.length) return <p className="text-center text-sm text-[color:var(--muted-foreground)]">Em breve.</p>;
  const t = items[idx];
  return (
    <div className="reveal mx-auto max-w-2xl rounded-3xl border border-gold/30 bg-white/80 p-10 text-center glass shadow-elegant">
      <Sparkles className="mx-auto h-5 w-5 text-[#D4AF37]" />
      <p key={t.id} className="font-display mt-4 text-2xl italic text-[color:var(--foreground)] animate-fade-in">“{t.quote}”</p>
      <div className="mt-6 text-xs uppercase tracking-[0.28em] text-[#B8902A]">{t.author}</div>
      {t.role && <div className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">{t.role}</div>}
      <div className="mt-6 flex justify-center gap-1.5">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Depoimento ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-gold-grad" : "w-1.5 bg-[color:var(--border)]"}`} />
        ))}
      </div>
    </div>
  );
}
