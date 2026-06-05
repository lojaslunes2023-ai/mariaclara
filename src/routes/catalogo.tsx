import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Instagram, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchContent, defaults } from "@/lib/content";
import { Footer, INSTAGRAM_URL } from "@/components/Footer";
import { HeroPortrait } from "@/components/HeroPortrait";
import { useReveal } from "@/lib/use-reveal";

export const Route = createFileRoute("/catalogo")({
  component: Catalogo,
});

async function fetchAll() {
  const [content, lingerie, provador, portfolio] = await Promise.all([
    fetchContent(),
    supabase.from("gallery_items").select("*").eq("section", "lingerie").order("sort_order"),
    supabase.from("gallery_items").select("*").eq("section", "provador").order("sort_order"),
    supabase.from("gallery_items").select("*").eq("section", "portfolio").order("sort_order"),
  ]);
  return {
    content,
    lingerie: lingerie.data ?? [],
    provador: provador.data ?? [],
    portfolio: portfolio.data ?? [],
  };
}


function Catalogo() {
  useReveal();
  const { data } = useQuery({ queryKey: ["catalogo"], queryFn: fetchAll, initialData: { content: defaults, lingerie: [], provador: [], portfolio: [] } as any });
  const c = data!.content;
  const hero = c.catalogo_hero;
  const about = c.catalogo_about;
  const wa = hero.whatsapp_url || "#";

  return (
    <main className="relative bg-rose-grad min-h-screen overflow-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center md:py-24">
          <HeroPortrait imageUrl={hero.image_url} />
          <div className="gold-divider mt-8 mb-3 justify-center animate-fade-up">
            <span className="gold-divider-line" /><span>catálogo</span><span className="gold-divider-line" />
          </div>
          <h1 className="font-display text-4xl tracking-[0.08em] text-gold md:text-5xl animate-fade-up">{hero.name}</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.32em] text-[color:var(--muted-foreground)] animate-fade-up">{hero.subtitle}</p>
          <p className="mt-5 max-w-sm text-sm text-[color:var(--foreground)]/80 animate-fade-up">
            Pacotes fotográficos, modelagem e parcerias com marcas. Cada projeto é cuidadosamente produzido com sofisticação e elegância.
          </p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-grad px-6 py-3.5 text-xs font-medium uppercase tracking-[0.28em] text-white shadow-soft-gold hover-lift hover-lift-on animate-fade-up">
            <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <Section title={about.title} eyebrow="essência">
        <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-[color:var(--foreground)]/80 reveal">
          {about.body}
        </p>
      </Section>




      {/* LINGERIE */}
      <Section title="Modelagem Lingerie" eyebrow="galeria">
        <Gallery items={data!.lingerie} />
      </Section>

      {/* PROVADOR */}
      <Section title="Provador de Roupas" eyebrow="conteúdo">
        <Gallery items={data!.provador} />
      </Section>




      {/* PORTFOLIO */}
      <Section title="Portfólio" eyebrow="editorial">
        <Gallery items={data!.portfolio} editorial />
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
            <span className="gold-divider-line" />
            <span>{eyebrow}</span>
            <span className="gold-divider-line" />
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

function Gallery({ items, editorial }: { items: any[]; editorial?: boolean }) {
  if (!items.length) {
    return <p className="text-center text-sm text-[color:var(--muted-foreground)]">Em breve novas fotos.</p>;
  }
  return (
    <div className={`grid gap-4 ${editorial ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
      {items.map((it, i) => (
        <figure key={it.id} className={`reveal zoom-img relative overflow-hidden rounded-2xl border border-gold/30 shadow-elegant hover-lift hover-lift-on ${editorial && i % 5 === 0 ? "row-span-2 aspect-[3/5]" : "aspect-[3/4]"}`}>
          <img src={it.image_url} alt={it.caption ?? ""} className="zoom-img-inner h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </figure>
      ))}
    </div>
  );
}
