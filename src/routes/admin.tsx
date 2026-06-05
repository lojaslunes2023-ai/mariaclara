import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, LogOut, Upload, Save, Trash2, Plus, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchContent, defaults } from "@/lib/content";
import { verifyAdminPassword, upsertContent, upsertRow, deleteRow, uploadImage } from "@/lib/admin.functions";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

const PW_KEY = "mc_admin_pw";

function Admin() {
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(PW_KEY);
    if (stored) setPassword(stored);
  }, []);

  if (!password) return <Login onOk={(p) => { sessionStorage.setItem(PW_KEY, p); setPassword(p); }} />;
  return <Dashboard password={password} onLogout={() => { sessionStorage.removeItem(PW_KEY); setPassword(null); }} />;
}

function Login({ onOk }: { onOk: (p: string) => void }) {
  const [val, setVal] = useState("");
  const [loading, setLoading] = useState(false);
  const verify = useServerFn(verifyAdminPassword);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await verify({ data: { password: val } });
      onOk(val);
    } catch {
      toast.error("Senha incorreta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-rose-radial px-6">
      <Toaster richColors position="top-center" />
      <Link to="/" className="absolute left-6 top-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] hover:text-[#B8902A]">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-gold/40 bg-white/80 p-8 glass shadow-rose-glow animate-fade-up">
        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-grad text-white shadow-soft-gold">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="font-display mt-4 text-3xl text-gold">Painel</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">acesso restrito</p>
        </div>
        <label className="mt-8 block text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">Senha</label>
        <input type="password" autoFocus value={val} onChange={(e) => setVal(e.target.value)} className="mt-2 w-full rounded-full border border-gold/40 bg-white px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]/40" />
        <button disabled={loading} className="mt-5 w-full rounded-full bg-gold-grad px-6 py-3.5 text-xs uppercase tracking-[0.28em] text-white shadow-soft-gold hover-lift hover-lift-on disabled:opacity-60">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

/* ----------- Dashboard ----------- */
const TABS = [
  { id: "home", label: "Home" },
  { id: "catalogo", label: "Catálogo" },
  { id: "midiakit", label: "Mídia Kit" },
  { id: "packages", label: "Pacotes" },
  { id: "combos", label: "Combos" },
  { id: "galleries", label: "Galerias" },
  { id: "testimonials", label: "Depoimentos" },
  { id: "brands", label: "Marcas" },
  { id: "audience", label: "Audiência" },
] as const;
type TabId = typeof TABS[number]["id"];

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>("home");
  const [content, setContent] = useState(defaults);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { fetchContent().then(setContent); }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <main className="min-h-screen bg-rose-grad">
      <Toaster richColors position="top-center" />
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted-foreground)] hover:text-[#B8902A] md:text-xs md:tracking-[0.28em]">
            <ArrowLeft className="h-4 w-4" /> Site
          </Link>
          <span className="font-display order-last w-full text-center text-base tracking-[0.24em] text-gold md:order-none md:w-auto md:text-lg md:tracking-[0.3em]">PAINEL · MARIA CLARA</span>
          <button onClick={onLogout} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted-foreground)] hover:text-[#B8902A] md:text-xs md:tracking-[0.28em]">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-4 pb-3 md:px-6">

          <div className="flex gap-2">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition ${tab === t.id ? "bg-gold-grad text-white shadow-soft-gold" : "border border-gold/30 bg-white/70 text-[color:var(--foreground)]"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
        {tab === "home" && <ContentEditor password={password} contentKey="home_hero" title="Home — Hero" content={content} onSaved={refresh} fields={[
          { key: "image_url", label: "Foto principal (URL ou upload)", type: "image" },
          { key: "name", label: "Nome" },
          { key: "subtitle", label: "Subtítulo" },
          { key: "tagline", label: "Frase de apresentação", type: "textarea" },
          { key: "whatsapp_url", label: "Link do WhatsApp" },
        ]} />}
        {tab === "catalogo" && (
          <>
            <ContentEditor password={password} contentKey="catalogo_hero" title="Catálogo — Hero" content={content} onSaved={refresh} fields={[
              { key: "image_url", label: "Foto principal", type: "image" },
              { key: "name", label: "Nome" },
              { key: "subtitle", label: "Subtítulo" },
              { key: "whatsapp_url", label: "Link do WhatsApp" },
            ]} />
            <ContentEditor password={password} contentKey="catalogo_about" title="Catálogo — Sobre mim" content={content} onSaved={refresh} fields={[
              { key: "title", label: "Título" },
              { key: "body", label: "Texto", type: "textarea" },
            ]} />
          </>
        )}
        {tab === "midiakit" && (
          <>
            <ContentEditor password={password} contentKey="midiakit_hero" title="Mídia Kit — Hero" content={content} onSaved={refresh} fields={[
              { key: "image_url", label: "Foto principal", type: "image" },
              { key: "name", label: "Nome" },
              { key: "subtitle", label: "Subtítulo" },
              { key: "tagline", label: "Texto de apresentação", type: "textarea" },
              { key: "whatsapp_url", label: "WhatsApp" },
              { key: "email", label: "E-mail" },
            ]} />
            <ContentEditor password={password} contentKey="midiakit_about" title="Mídia Kit — Sobre" content={content} onSaved={refresh} fields={[
              { key: "title", label: "Título" },
              { key: "body", label: "Texto", type: "textarea" },
            ]} />
          </>
        )}
        {tab === "packages" && <CrudList password={password} table="packages" title="Pacotes Fotográficos" fields={[
          { key: "title", label: "Nome", required: true },
          { key: "description", label: "Descrição", type: "textarea" },
          { key: "price", label: "Valor" },
          { key: "image_url", label: "Foto", type: "image" },
          { key: "sort_order", label: "Ordem", type: "number" },
        ]} />}
        {tab === "combos" && <CrudList password={password} table="combos" title="Combos Provador" fields={[
          { key: "title", label: "Nome", required: true },
          { key: "description", label: "Descrição", type: "textarea" },
          { key: "price", label: "Valor" },
          { key: "image_url", label: "Foto", type: "image" },
          { key: "sort_order", label: "Ordem", type: "number" },
        ]} />}
        {tab === "galleries" && (
          <>
            <GallerySection password={password} section="lingerie" title="Galeria — Modelagem Lingerie" />
            <GallerySection password={password} section="provador" title="Galeria — Provador de Roupas" />
            <GallerySection password={password} section="portfolio" title="Galeria — Portfólio (Catálogo)" />
            <GallerySection password={password} section="midiakit_portfolio" title="Galeria — Portfólio (Mídia Kit)" />
          </>
        )}
        {tab === "testimonials" && <CrudList password={password} table="testimonials" title="Depoimentos" fields={[
          { key: "author", label: "Autor", required: true },
          { key: "role", label: "Cargo / Marca" },
          { key: "quote", label: "Depoimento", type: "textarea", required: true },
          { key: "sort_order", label: "Ordem", type: "number" },
        ]} />}
        {tab === "brands" && <CrudList password={password} table="brands" title="Marcas Parceiras" fields={[
          { key: "name", label: "Nome", required: true },
          { key: "logo_url", label: "Logo", type: "image", required: true },
          { key: "sort_order", label: "Ordem", type: "number" },
        ]} />}
        {tab === "audience" && <CrudList password={password} table="audience_segments" title="Audiência" fields={[
          { key: "category", label: "Categoria (age | gender | location)", required: true },
          { key: "label", label: "Rótulo", required: true },
          { key: "value", label: "Valor (ex: 45%)", required: true },
          { key: "sort_order", label: "Ordem", type: "number" },
        ]} />}
      </div>
    </main>
  );
}

/* ----------- Content editor ----------- */
type FieldDef = { key: string; label: string; type?: "text" | "textarea" | "image" | "number"; required?: boolean };

function ContentEditor({ password, contentKey, title, content, fields, onSaved }: { password: string; contentKey: string; title: string; content: any; fields: FieldDef[]; onSaved: () => void }) {
  const [val, setVal] = useState<any>(content[contentKey] ?? {});
  useEffect(() => setVal(content[contentKey] ?? {}), [content, contentKey]);
  const saveFn = useServerFn(upsertContent);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await saveFn({ data: { password, key: contentKey, value: val } });
      toast.success("Salvo!");
      onSaved();
    } catch (e: any) { toast.error(e.message || "Erro ao salvar"); }
    finally { setSaving(false); }
  }

  return (
    <Card title={title}>
      <div className="space-y-4">
        {fields.map((f) => (
          <FieldInput key={f.key} field={f} value={val[f.key] ?? ""} onChange={(v) => setVal({ ...val, [f.key]: v })} password={password} />
        ))}
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gold-grad px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-white shadow-soft-gold disabled:opacity-60">
          <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </Card>
  );
}

/* ----------- Generic table CRUD ----------- */
function CrudList({ password, table, title, fields, defaultsRow, filter }: { password: string; table: any; title: string; fields: FieldDef[]; defaultsRow?: Record<string, any>; filter?: { column: string; value: any } }) {
  const [rows, setRows] = useState<any[]>([]);
  const upsertFn = useServerFn(upsertRow);
  const deleteFn = useServerFn(deleteRow);

  async function load() {
    let q = supabase.from(table).select("*").order("sort_order");
    if (filter) q = q.eq(filter.column, filter.value) as any;
    const { data } = await q;
    setRows(data ?? []);
  }
  useEffect(() => { load(); }, [table, filter?.value]);

  async function save(row: any) {
    try {
      const merged = { ...(defaultsRow ?? {}), ...row };
      await upsertFn({ data: { password, table, row: merged } });
      toast.success("Salvo!");
      load();
    } catch (e: any) { toast.error(e.message); }
  }
  async function remove(id: string) {
    if (!confirm("Excluir este item?")) return;
    try { await deleteFn({ data: { password, table, id } }); load(); }
    catch (e: any) { toast.error(e.message); }
  }

  return (
    <Card title={title}>
      <div className="space-y-6">
        {rows.map((r) => (
          <RowEditor key={r.id} row={r} fields={fields} onSave={save} onDelete={() => remove(r.id)} password={password} />
        ))}
        <div className="rounded-2xl border border-dashed border-gold/40 bg-white/50 p-5">
          <h4 className="mb-3 text-xs uppercase tracking-[0.28em] text-[#B8902A]">Adicionar novo</h4>
          <RowEditor row={defaultsRow ?? {}} fields={fields} onSave={save} password={password} isNew />
        </div>
      </div>
    </Card>
  );
}

function RowEditor({ row, fields, onSave, onDelete, isNew, password }: { row: any; fields: FieldDef[]; onSave: (r: any) => void; onDelete?: () => void; isNew?: boolean; password: string }) {
  const [val, setVal] = useState<any>(row);
  useEffect(() => setVal(row), [row]);
  return (
    <div className="space-y-3 rounded-2xl border border-gold/20 bg-white/70 p-4">
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={val[f.key] ?? ""} onChange={(v) => setVal({ ...val, [f.key]: v })} password={password} />
      ))}
      <div className="flex items-center gap-3">
        <button onClick={() => onSave(val)} className="inline-flex items-center gap-2 rounded-full bg-gold-grad px-5 py-2.5 text-[10px] uppercase tracking-[0.28em] text-white shadow-soft-gold">
          {isNew ? <><Plus className="h-3.5 w-3.5" /> Adicionar</> : <><Save className="h-3.5 w-3.5" /> Salvar</>}
        </button>
        {onDelete && (
          <button onClick={onDelete} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.28em] text-red-500">
            <Trash2 className="h-3.5 w-3.5" /> Excluir
          </button>
        )}
      </div>
    </div>
  );
}

function GallerySection({ password, section, title }: { password: string; section: string; title: string }) {
  return (
    <CrudList
      password={password}
      table={"gallery_items" as any}
      title={title}
      filter={{ column: "section", value: section }}
      defaultsRow={{ section }}
      fields={[
        { key: "image_url", label: "Foto", type: "image", required: true },
        { key: "caption", label: "Legenda" },
        { key: "sort_order", label: "Ordem", type: "number" },
      ]}
    />
  );
}

/* (Override gallery section to prefill `section` for new rows) */

function FieldInput({ field, value, onChange, password }: { field: FieldDef; value: any; onChange: (v: any) => void; password: string }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">{field.label}</label>
      {field.type === "textarea" ? (
        <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-gold/30 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]/40" />
      ) : field.type === "image" ? (
        <ImageField value={value} onChange={onChange} password={password} />
      ) : field.type === "number" ? (
        <input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full rounded-full border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]/40" />
      ) : (
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-full border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]/40" />
      )}
    </div>
  );
}

function ImageField({ value, onChange, password }: { value: string; onChange: (v: string) => void; password: string }) {
  const uploadFn = useServerFn(uploadImage);
  const [busy, setBusy] = useState(false);

  async function handle(file: File) {
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      let bin = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
      const dataBase64 = btoa(bin);
      const res = await uploadFn({ data: { password, filename: file.name, contentType: file.type || "image/jpeg", dataBase64 } });
      onChange(res.url);
      toast.success("Imagem enviada!");
    } catch (e: any) { toast.error(e.message || "Erro no upload"); }
    finally { setBusy(false); }
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="URL da imagem" className="w-full flex-1 rounded-full border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]/40" />
        <div className="flex gap-2">
          <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-gold bg-white px-4 py-2.5 text-[10px] uppercase tracking-[0.28em] text-[#B8902A] hover:bg-gold-grad hover:text-white sm:flex-none">
            <Upload className="h-3.5 w-3.5" /> {busy ? "Enviando..." : "Upload"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])} />
          </label>
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-red-300 bg-white px-4 py-2.5 text-[10px] uppercase tracking-[0.28em] text-red-500 hover:bg-red-50 sm:flex-none">
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </button>
          )}
        </div>
      </div>
      {value && <img src={value} alt="" className="h-28 w-28 rounded-2xl border border-gold/30 object-cover shadow-elegant" />}
    </div>
  );
}


function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-3xl border border-gold/30 bg-white/80 p-4 glass shadow-elegant md:mb-8 md:p-8">
      <h2 className="font-display mb-6 text-2xl text-gold">{title}</h2>
      {children}
    </section>
  );
}
