# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What this is

Landing pages for **Miranet Hotels** — a Colombian hotel group. 7 hotels, two technical formats:

| Format | Hotels | Notes |
|--------|--------|-------|
| Pure HTML (single file) | `novus`, `oru-campestre`, `tierra-grata`, `santo-tomas` | Self-contained, deploy as static files. `novus` has a `vercel.json` rewrite. |
| Next.js TSX (drop-in) | `terrabella`, `suites-44`, `pomarosa` | `page.tsx` + `layout.tsx` only — no `package.json` here. These are copied into a Next.js host app (la-agencia-landings). Images served from `/hotels/<hotel>/` in the host. |

No build system lives in this directory. HTML files are ready to serve; TSX files need a Next.js host.

---

## Hotel inventory

| Hotel | File | WhatsApp | Booking engine | Pixel |
|-------|------|----------|----------------|-------|
| Novus Laureles | `novus/novus-laureles.html` | `573008943465` | hosroom `novus-laureles` (iframe) | ❌ pending |
| ORU Campestre | `oru-campestre/oru-campestre.html` | `573145374287` | WA only | ❌ pending |
| Tierra Grata | `tierra-grata/tierra-grata.html` | `573012230610` | WA only | ❌ pending |
| Santo Tomás | `santo-tomas/santo-tomas.html` | `573054677360` | WA only | ❌ pending |
| Terrabella | `terrabella/page.tsx` | `573016430309` | hosroom `72-terrabella` | ❌ pending |
| Suites 44 | `suites-44/page.tsx` | `573115781227` | hosroom `177-hotel-suites-44-laureles` | ❌ pending |
| Pomarosa | `pomarosa/page.tsx` | `573146544069` | hosroom `179-hotel-pomarosa` | ❌ pending |

---

## Adding a Meta Pixel

### HTML files — inject in `<head>` before closing `</head>`

```html
<!-- Meta Pixel — HOTEL_NAME -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID_HERE');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=PIXEL_ID_HERE&ev=PageView&noscript=1"/></noscript>
```

### TSX files — add `<Script>` inside `layout.tsx`

```tsx
import Script from "next/script";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="meta-pixel-HOTEL" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'PIXEL_ID_HERE');
        fbq('track', 'PageView');
      `}</Script>
      {children}
    </>
  );
}
```

---

## Key conversion events

Fire these on top of the base `PageView`:

| Event | When | `fbq` call |
|-------|------|-----------|
| `ViewContent` | Page load (all pages) | `fbq('track', 'ViewContent', { content_name: 'hotel-name' })` |
| `InitiateCheckout` | User clicks `#reservas` / `#motor-reservas` anchor | `fbq('track', 'InitiateCheckout')` |
| `Contact` | User clicks any `wa.me` link | `fbq('track', 'Contact')` |
| `Lead` | Booking engine iframe loads (hosroom) | `fbq('track', 'Lead')` |

### Attaching events to WA links (HTML)

```js
document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
  el.addEventListener('click', () => fbq('track', 'Contact'));
});
```

### Attaching events to WA links (TSX)

Add `onClick={() => { if (typeof fbq !== 'undefined') fbq('track', 'Contact'); }}` on the anchor, or declare `declare const fbq: Function` at top of file if TypeScript complains.

---

## Design system (shared across all hotels)

- **Fonts**: `Cormorant Garamond` (display/serif) + `DM Sans` (body/sans)
- **Dark luxury aesthetic**: near-black backgrounds, each hotel has its own accent color (gold for novus, teal for oru, green for tierra-grata, terra for santo-tomás, amber for terrabella/suites/pomarosa)
- CSS vars: `--bg`, `--surface`, `--surface-2`, `--gold`/`--teal`/`--terra` (accent), `--cream`, `--border`

---

## Cowork workflow

Pixel IDs are created by **Claude Desktop** (with Meta Ads MCP) per hotel. Once Desktop provides the pixel ID for a hotel, implement it here per the patterns above. Each hotel gets its own independent pixel dataset — do not share pixel IDs across hotels.
