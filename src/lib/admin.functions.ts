import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ADMIN_PASSWORD = "mariaclara0742";

function check(password: string) {
  if ((password ?? "").trim().toLowerCase() !== ADMIN_PASSWORD) throw new Error("Senha incorreta");
}

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    check(data.password);
    return { ok: true };
  });

// ---------- site_content ----------
export const upsertContent = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; key: string; value: any }) => d)
  .handler(async ({ data }) => {
    check(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) throw error;
    return { ok: true };
  });

// ---------- generic CRUD ----------
const Tables = ["packages", "combos", "gallery_items", "testimonials", "brands", "audience_segments"] as const;
type TableName = typeof Tables[number];
const TableSchema = z.enum(Tables);

export const upsertRow = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; table: TableName; row: Record<string, any> }) => d)
  .handler(async ({ data }) => {
    check(data.password);
    TableSchema.parse(data.table);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin
      .from(data.table)
      .upsert(data.row)
      .select()
      .single();
    if (error) throw error;
    return result;
  });

export const deleteRow = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; table: TableName; id: string }) => d)
  .handler(async ({ data }) => {
    check(data.password);
    TableSchema.parse(data.table);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------- image upload (base64 -> storage) ----------
export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; filename: string; contentType: string; dataBase64: string }) => d)
  .handler(async ({ data }) => {
    check(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const bytes = Uint8Array.from(atob(data.dataBase64), (c) => c.charCodeAt(0));
    const { error } = await supabaseAdmin.storage
      .from("media")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw error;
    // Bucket is private — generate a long-lived signed URL (100 years).
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 100);
    if (signErr) throw signErr;
    return { url: signed.signedUrl, path };
  });
