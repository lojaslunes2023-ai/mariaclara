import { Instagram } from "lucide-react";

export const INSTAGRAM_URL = "https://www.instagram.com/mariaclara.sm__";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[color:var(--border)] bg-gradient-to-b from-white to-[#FFF5F6]">
      <div className="mx-auto max-w-6xl px-6 py-14 text-center">
        <div className="gold-divider justify-center">
          <span className="gold-divider-line" />
          <span>Maria Clara</span>
          <span className="gold-divider-line" />
        </div>
        <h3 className="font-display mt-4 text-2xl text-gold">Vamos criar algo lindo juntos</h3>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2.5 text-sm tracking-wide text-[color:var(--foreground)] transition hover:bg-gold-grad hover:text-white hover-lift hover-lift-on shadow-soft-gold"
        >
          <Instagram className="h-4 w-4" />
          @mariaclara.sm__
        </a>
        <p className="mt-8 text-xs tracking-[0.3em] uppercase text-[color:var(--muted-foreground)]">
          © {new Date().getFullYear()} Maria Clara · Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
