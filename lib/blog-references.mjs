/** @typedef {{title:string, url:string}} BlogReference */

/** Keep prose readable and collect evidence in one bibliography for every post. */
/** @param {string} content @param {readonly BlogReference[]} [sources] */
export function prepareBlogReferences(content, sources = []) {
  /** @type {BlogReference[]} */
  const references = [];
  const seen = new Map();
  /** @param {string} url @param {string} [title] */
  function addReference(url, title = "") {
    try {
      const value = (url || "").trim().replace(/^\/\//, "https://").replace(/&amp;/g, "&");
      if (!value) {
        const label = title.trim();
        const key = `text:${label}`;
        if (label && !seen.has(key)) {
          seen.set(key, {index:references.length, named:true});
          references.push({title:label, url:""});
        }
        return;
      }
      const parsed = new URL(value);
      if (!/^https?:$/.test(parsed.protocol)) return;
      parsed.hash = "";
      const key = parsed.href.replace(/\/$/, "");
      const existing = seen.get(key);
      if (existing) {
        if (!existing.named && title.trim()) {
          references[existing.index].title = title.trim();
          existing.named = true;
        }
        return;
      }
      seen.set(key, {index:references.length, named:Boolean(title.trim())});
      references.push({title: title.trim() || `${parsed.hostname}${parsed.pathname.replace(/\/$/, "")}`, url:value});
    } catch { /* Invalid destinations must never become reference links. */ }
  }
  for (const source of sources) addReference(source.url, source.title);

  const definitions = new Map();
  let body = content.replace(/^\s*\[([^\]\n]+)\]:\s*(https?:\/\/\S+)(?:\s+["']([^"'\n]+)["'])?\s*$/gm, (_, key, url, title) => {
    definitions.set(key.toLowerCase(), {url, title});
    addReference(url, title);
    return "";
  });
  body = body.replace(/(?<!!)\[([^\]\n]+)\]\(((?:https?:)?\/\/(?:[^\s()]|\([^()\s]*\))+)(?:\s+["'][^"'\n]*["'])?\)/gi, (_, title, url) => {
    addReference(url, title);
    return title;
  });
  body = body.replace(/\[([^\]\n]+)\]\[([^\]\n]*)\]/g, (match, title, key) => {
    const source = definitions.get((key || title).toLowerCase());
    if (!source) return match;
    addReference(source.url, source.title || title);
    return title;
  });
  body = body.replace(/<a\b[^>]*href\s*=\s*["']((?:https?:)?\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, url, label) => {
    const title = label.replace(/<[^>]*>/g, "");
    addReference(url, title);
    return title;
  });
  body = body.replace(/<((?:https?:)?\/\/[^<>\s]+)>/gi, (_, url) => {
    addReference(url);
    return "";
  });
  body = body.replace(/https?:\/\/(?:[^\s<>"\[\](){}]|\([^()\s]*\))+/gi, raw => {
    const url = raw.replace(/[.,;:!?،؛؟]+$/, "");
    addReference(url);
    return raw.slice(url.length);
  });
  body = body.replace(/\(\s*\)|\[\s*\]/g, "")
    .replace(/[\t ]+([،؛,.؟!?])/g, "$1")
    .split("\n").map(line => line.replace(/[\t ]{2,}/g, " ").trim()).join("\n")
    .replace(/\n{3,}/g, "\n\n").trim();
  return {content:body, sources:references};
}
