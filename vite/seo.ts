import type { Plugin } from "vite";
import { GAMES, SITE, SITE_DESC, SITE_NAME } from "../src/games/meta";

/** Replace the `content` of a `<meta {attr}="{key}">` tag. */
function setMeta(html: string, attr: string, key: string, value: string) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  return html.replace(re, `$1${value.replace(/"/g, "&quot;")}$2`);
}

function pageFor(html: string, title: string, desc: string, path: string) {
  const url = `${SITE}${path}`;
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  out = setMeta(out, "name", "description", desc);
  out = setMeta(out, "property", "og:title", title);
  out = setMeta(out, "property", "og:description", desc);
  out = setMeta(out, "property", "og:url", url);
  out = setMeta(out, "name", "twitter:title", title);
  out = setMeta(out, "name", "twitter:description", desc);
  return out;
}

function sitemap() {
  const urls = ["/", ...GAMES.map((g) => `/${g.id}`)];
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n") +
    `\n</urlset>\n`
  );
}

/**
 * SEO build helpers: fills `%SITE%`/`%DESC%` in index.html, then emits a
 * pre-tagged `/<game>/index.html` per game (so link previews and crawlers get
 * per-game tags without SSR) plus `sitemap.xml`.
 */
export default function seo(): Plugin[] {
  return [
    {
      name: "seo:fill",
      transformIndexHtml: {
        order: "pre",
        handler: (html) => html.replaceAll("%SITE%", SITE).replaceAll("%DESC%", SITE_DESC),
      },
    },
    {
      name: "seo:pages",
      apply: "build",
      // Post-order: Vite's html plugin has already emitted index.html (with asset tags).
      generateBundle: {
        order: "post",
        handler(_, bundle) {
          const index = bundle["index.html"];
          if (index?.type !== "asset") return;
          const built = String(index.source);
          for (const g of GAMES) {
            this.emitFile({
              type: "asset",
              fileName: `${g.id}/index.html`,
              source: pageFor(built, `${g.title} · ${SITE_NAME}`, g.blurb, `/${g.id}`),
            });
          }
          this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap() });
        },
      },
    },
  ];
}
