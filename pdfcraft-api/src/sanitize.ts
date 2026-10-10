/**
 * Shared XSS defense for HTML templates.
 * Policy: no JavaScript / no active content allowed in template code.
 * Used to REJECT templates on save (400) and to sanitize defense-in-depth at render time.
 */

export interface SanitizeCheck {
  ok: boolean;
  reason?: string;
}

const FORBIDDEN_TAGS = [
  "script",
  "iframe",
  "frame",
  "frameset",
  "object",
  "embed",
  "applet",
  "base",
  "link",
  "meta",
  "form",
  "button",
  "input",
  "select",
  "textarea",
] as const;

/** Decode HTML entities (incl. numeric/hex) so `&#106;avascript:` can't bypass checks. */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);?/g, (_, h) => {
      try {
        return String.fromCharCode(parseInt(h, 16));
      } catch {
        return "";
      }
    })
    .replace(/&#([0-9]+);?/g, (_, d) => {
      try {
        return String.fromCharCode(parseInt(d, 10));
      } catch {
        return "";
      }
    })
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&amp;/gi, "&");
}

function normalized(html: string): string {
  // Decode entities (twice for double-encoding), strip NUL/control tricks, collapse whitespace in checks below.
  let s = decodeEntities(decodeEntities(html));
  // Remove null bytes and zero-width chars attackers use to split keywords
  // eslint-disable-next-line no-control-regex
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\uFEFF]/g, "");
  return s;
}

export function assertNoActiveContent(html: string): SanitizeCheck {
  const s = normalized(html);

  // 1. Forbidden tags (open, close, or self-closing, any casing/whitespace)
  for (const tag of FORBIDDEN_TAGS) {
    const re = new RegExp(`<\\s*/?\\s*${tag}[\\s>/]`, "i");
    if (re.test(s)) {
      return { ok: false, reason: `Forbidden <${tag}> tag is not allowed (no active content).` };
    }
  }

  // 2. Event handler attributes: onclick=, onerror=, onload=, etc. (incl. SVG)
  if (/<[^>]+\s+on\w+\s*=/i.test(s)) {
    return { ok: false, reason: "Event handler attributes (e.g. onclick, onerror, onload) are not allowed." };
  }

  // 3. Dangerous URL schemes in URL-bearing attributes
  // Matches href/src/xlink:href/action/formaction/cite/data/background/srcset/content
  const urlAttr = /(href|src|xlink:href|action|formaction|cite|data|background|poster|content)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let m: RegExpExecArray | null;
  while ((m = urlAttr.exec(s)) !== null) {
    const raw = (m[2] ?? m[3] ?? m[4] ?? "").trim().toLowerCase().replace(/[\s'"]+/g, "");
    const scheme = raw.split(":")[0];
    if (scheme === "javascript" || scheme === "vbscript" || scheme === "data") {
      // Allow data:image/* (inline images); block data:text/html and friends
      if (scheme === "data" && /^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,/i.test(raw)) continue;
      return { ok: false, reason: `Dangerous URL scheme "${scheme}:" is not allowed.` };
    }
  }
  // srcset can hold comma-separated URLs
  if (/\ssrcset\s*=/i.test(s) && /(javascript|vbscript|data:text\/html)/i.test(s)) {
    return { ok: false, reason: 'Dangerous URL in srcset is not allowed.' };
  }

  // 4. CSS-based script execution
  if (/expression\s*\(/i.test(s) || /behaviour\s*:/i.test(s) || /-moz-binding/i.test(s)) {
    return { ok: false, reason: "CSS expression()/behaviour/-moz-binding is not allowed." };
  }
  if (/<style[^>]*>[\s\S]*?(javascript:|expression\s*\()/i.test(s)) {
    return { ok: false, reason: "Script content inside <style> is not allowed." };
  }
  if (/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i.test(s)) {
    const styleVal = s.match(/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i)?.[1] ?? "";
    if (/javascript\s*:|expression\s*\(|behaviour\s*:|-moz-binding/i.test(styleVal)) {
      return { ok: false, reason: "Script content inside style attribute is not allowed." };
    }
  }

  // 5. Misc active-content vectors
  if (/<!\s*--[\s\S]*?-->/.test(s) && /<(script|iframe|object|embed)/i.test(decodeEntities(s))) {
    // comment-smuggled tags get caught by (1) anyway; keep as explicit signal
  }
  if (/<\s*(svg|math)[^>]*>[\s\S]*?<\s*animate/i.test(s) && /href\s*=\s*["']?\s*javascript:/i.test(s)) {
    return { ok: false, reason: "SVG animate with javascript: URL is not allowed." };
  }

  return { ok: true };
}

/**
 * Defense-in-depth sanitizer for PDF rendering of pre-existing templates.
 * Strips forbidden tags + event handlers + dangerous URLs rather than throwing.
 */
export function sanitizeForRender(html: string): string {
  let out = html;
  for (const tag of FORBIDDEN_TAGS) {
    out = out.replace(new RegExp(`<\\s*${tag}[^>]*>[\\s\\S]*?<\\s*/\\s*${tag}\\s*>`, "gi"), "");
    out = out.replace(new RegExp(`<\\s*/?\\s*${tag}[^>]*/?>`, "gi"), "");
  }
  // Strip event handlers
  out = out.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Neutralize dangerous schemes
  out = out.replace(
    /((?:href|src|xlink:href|action|formaction|cite|data|background|poster)\s*=\s*["']?)\s*(javascript|vbscript|data:text\/html)[^"'\s>]*/gi,
    "$1#blocked"
  );
  return out;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function applyVariables(html: string, data: Record<string, string>): string {
  let out = html;
  for (const [key, value] of Object.entries(data)) {
    const re = new RegExp(`{{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*}}`, "g");
    out = out.replace(re, escapeHtml(value ?? ""));
  }
  return out;
}
