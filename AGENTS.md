# Reader Line — Agent Context

A local-only Chrome extension (Manifest V3) with a keyboard-adjustable horizontal reading guide. Storage-driven sync (popup ↔ content script), zero message passing.

## Architecture

**Shared layer** (`scripts/constants.js`, `scripts/storage.js`):
- `STORAGE_KEYS` & `DEFAULTS` — color, height, enabled, mode
- `StorageService` — `getAll()`, `set(data)`, `onChange(callback)`

**Content script** (`scripts/`):
- `ReaderLine` — manages DOM element, applies styles, tracks mouse
- `CommandRegistry` — maps keys to handlers; `[`/`]` adjust height ±2px (guarded: enabled + not-in-form)
- `index.js` — initializes services & registers commands

**Popup** (`public/`):
- `PopupController` — UI binding, settings persistence, color conversion
- `popup.js` — thin initializer (3 lines)

**Static** (`background.js`, `popup.css`, icons) — unchanged

## Storage Keys
| Key | Type | Default |
|---|---|---|
| `color` | string | `"rgba(0, 0, 0, 0.15)"` |
| `height` | number | `20` |
| `enabled` | boolean | `false` |
| `mode` | string | `"line"` / `"focus"` |

## Constraints
- No build, no external libs, no i18n, no analytics
- Vanilla JS, plain CSS, native DOM only
