# Reader Line — Agent Context

## Purpose
A local-only Chrome extension (Manifest V3) that overlays a movable horizontal reading guide on every web page. No external services, no analytics, no publishing pipeline.

## File Map

```
public/               ← the entire extension (load this folder as unpacked)
  manifest.json       ← MV3 config; permissions: storage, tabs, scripting
  index.html          ← popup HTML (full markup, no framework)
  popup.css           ← popup styles (no external libraries)
  popup.js            ← popup logic
  background.js       ← service worker (tab injection only)
  scripts/
    index.js          ← content script injected into every HTTP/S page
    index.css         ← content script styles
  icons/              ← 16/32/48/64/128.png
```

## Data Flow

```
[popup.js]  ──chrome.storage.local.set──▶  [chrome.storage.local]
                                                    │
                                     chrome.storage.onChanged
                                                    │
                                                    ▼
                                          [scripts/index.js]
                                       updates DOM element style
```

All four settings live in `chrome.storage.local` under these exact keys:

| Key | Type | Default | Meaning |
|---|---|---|---|
| `color` | `string` | `"rgba(0, 0, 0, 0.15)"` | Line color as an rgba string |
| `height` | `number` | `20` | Line height in px |
| `enabled` | `boolean` | `false` | Whether the line is visible |
| `mode` | `string` | `"line"` | `"line"` or `"focus"` |

The popup reads these on open, shows them in the UI, and writes them back on every input change. The content script reads them on load and on every `storage.onChanged` event — **there is no message passing between popup and content script**.

## Content Script (`scripts/index.js`)

- Appends one `<div class="cmVhZGVyLWxpbmU">` to `<body>` (class name is base64 for "reader-line", chosen to avoid collisions).
- Tracks `mousemove` to set `element.style.top = e.clientY - height/2`.
- `updateReaderLine(color, height, enabled, mode)` applies all four settings to the element.
- **line mode**: plain colored bar, no extra classes.
- **focus mode**: adds class `cmVhZGVyLWxpbmU--focus`. The bar itself becomes transparent; `::before` and `::after` pseudo-elements fill the viewport above and below with the color, creating a spotlight effect. Color for pseudo-elements is passed via CSS custom property `--pseudo-background`.

## Background Service Worker (`background.js`)

Single responsibility: ensure the content script is injected into already-open tabs when the extension loads. Uses `TabsController` to track which tabs have been injected (in-memory only, resets on service worker restart). Injects on `chrome.tabs.onActivated` for HTTP/S tabs, skipping the Chrome Web Store URL. No external network calls.

## Popup (`index.html` / `popup.js` / `popup.css`)

- 300 px wide fixed popup.
- **Toggle**: `<input type="checkbox" id="enabled">` styled as a CSS switch → saves `enabled`.
- **Color**: `<input type="color" id="color">` (hex) + `<input type="range" id="opacity">` (0–1 step 0.01) → combined into `rgba()` string → saves `color`.
- **Height**: `<input type="number" id="height">` → saves `height`.
- **Mode**: two `<input type="radio" name="mode">` buttons (values `"line"`, `"focus"`) → saves `mode`.
- `popup.js` helpers: `rgbaToInputs(rgba)` → `{hex, alpha}`; `inputsToRgba(hex, alpha)` → rgba string.
- Accent color throughout: `#1D8B70`.

## Constraints
- No build step. Edit files in `public/` directly; reload the unpacked extension to test.
- No external libraries anywhere — vanilla JS, plain CSS, native HTML inputs only.
- No i18n. All strings are hardcoded English.
- No rating, feedback, or store-related code.
