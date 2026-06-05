import { supabase } from "@/integrations/supabase/client";

export type ContentMap = Record<string, any>;

export const defaults: ContentMap = {
  home_hero: {
    image_url: "",
    name: "MARIA CLARA",
    subtitle: "Miss • Modelo • Influenciadora",
    tagline: "Elegância, autenticidade e conexão com marcas.",
    whatsapp_url: "",
  },
  catalogo_hero: {
    image_url: "",
    name: "MARIA CLARA",
    subtitle: "Miss • Modelo • Influenciadora",
    whatsapp_url: "",
  },
  catalogo_about: {
    title: "Sobre mim",
    body:
      "Sou Maria Clara — miss, modelo e influenciadora. Trabalho com marcas que valorizam autenticidade, sofisticação e conexão verdadeira com o público feminino. Cada projeto é cuidadosamente produzido para encantar.",
  },
  midiakit_hero: {
    image_url: "",
    name: "MARIA CLARA",
    subtitle: "Miss • Modelo • Influenciadora",
    tagline: "Conectando marcas, beleza e influência através de conteúdo autêntico.",
    whatsapp_url: "",
    email: "",
  },
  midiakit_about: {
    title: "Sobre",
    body:
      "Criadora de conteúdo premium em moda, lifestyle e beleza. Audiência fiel e engajada, posicionamento aspiracional e estética cuidada — perfeitos para marcas que buscam presença de luxo nas redes.",
  },
  midiakit_metrics: {
    followers: "120K",
    reach: "850K",
    impressions: "1.2M",
    engagement: "6.8%",
  },
};

export async function fetchContent(): Promise<ContentMap> {
  const { data } = await supabase.from("site_content").select("key,value");
  const map: ContentMap = { ...defaults };
  (data ?? []).forEach((r: any) => {
    map[r.key] = { ...(defaults[r.key] ?? {}), ...(r.value ?? {}) };
  });
  return map;
}
