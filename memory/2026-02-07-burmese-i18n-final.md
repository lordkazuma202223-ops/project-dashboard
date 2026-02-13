# Memory Log - 2026-02-07 - Burmese i18n Implementation - FINAL

## Summary
Added Burmese language support to mingalbar-sg website, fixed 404 issue on root path, and removed English language option.

## Actions Taken

### i18n Setup
- Installed `next-intl` package
- Created `src/i18n/request.ts` for i18n configuration
- Created `src/middleware.ts` (later renamed to `src/proxy.ts`, then moved to project root as `proxy.ts`)
- Updated `next.config.ts` to support next-intl

### Translation Files
- Created `src/messages/en.json` - English translations for all pages
- Created `src/messages/my.json` - Burmese translations for all pages (Burmese script)
- Used Padauk font (already configured) for Burmese text rendering

### Structure Changes
- Reorganized app structure to support locales:
  * Created `src/app/[locale]/` directory
  * Moved all pages under `[locale]` directory
  * Updated root layout (`src/app/layout.tsx`)
  * Created locale-specific layout (`src/app/[locale]/layout.tsx`)

### Components Updated
- Created `LanguageSwitcher.tsx` - Dropdown language switch in top-right corner
- Updated `Navbar.tsx` to include language switcher and use translations
- Updated all pages to use `useTranslations` hook:
  * `src/app/[locale]/page.tsx` - Home page
  * `src/app/[locale]/about/page.tsx` - About page
  * `src/app/[locale]/community/page.tsx` - Community page
  * `src/app/[locale]/tools/page.tsx` - Tools page
  * `src/app/[locale]/guides/page.tsx` - Guides page
  * `src/app/[locale]/guides/[id]/page.tsx` - Individual guide page

## Issues Fixed with Swarm Agents

### Initial Issues
1. **404 on root path** - `src/app/page.tsx` redirected to `/en` but middleware with `localePrefix: 'as-needed'` didn't support locale prefixes
2. **Middleware location** - `src/middleware.ts` was inside `src/` instead of project root
3. **Missing i18n config** - No `src/i18n/config.ts` file for locale configuration
4. **Proxy file name** - Non-standard naming (`proxy.ts` instead of `middleware.ts`)
5. **Misplaced globals.css** - `src/app/globals.css` should be `src/globals.css`
6. **Matcher pattern** - Too restrictive, didn't catch locale routes

### Fixes Applied
1. Created `src/i18n/config.ts` with proper locale configuration
2. Renamed `src/middleware.ts` to `src/proxy.ts`
3. Moved `src/proxy.ts` to project root as `proxy.ts` (Next.js 16 requirement)
4. Changed `localePrefix` to `'always'` in `src/i18n/config.ts`
5. Updated middleware matcher to `['/', '/((?!api|_next|_vercel|.*\\..*).*)']`
6. Updated `next.config.ts` to use `createNextIntlPlugin()` without explicit path
7. Removed root `src/app/page.tsx` redirect
8. Created `src/app/page.tsx` with redirect('/en') to handle root path
9. Added `['/', ...]` to matcher to explicitly catch root path
10. Fixed TypeScript issues with `satisfies` operator

### Deployment History
1. **Initial deployment** - Added i18n support with Burmese translations
2. **Second deployment** - Changed `localePrefix` to `'always'` to force locale prefixes
3. **Third deployment** - Moved `proxy.ts` from `src/` to project root
4. **Fourth deployment** - Removed root page redirect (didn't work with `localePrefix: 'always'`)
5. **Fifth deployment** - Fixed proxy matcher to include root path
6. **Sixth deployment** - Fixed build error (transient module issue)
7. **Seventh deployment** - Added root page redirect again

### Final Solution
- **Root cause:** With `localePrefix: 'always'`, Next.js doesn't auto-redirect `/` to default locale
- **Fix:** Created `src/app/page.tsx` with explicit `redirect('/my')` (Burmese as default)
- **Middleware config:** `locales = ['my', 'en']` with `defaultLocale = 'my'`
- **Root page behavior:** `/` redirects to `/my`, `/en` and `/my` are accessible
- **Language switcher:** Shows current locale + button to switch to Burmese (မြန်မာ)
- **English access:** Clicking "EN" on switcher redirects to `/en`

## Features
- Language switcher in navbar (top-right corner)
  * Shows current locale (မြန်မာ) in text
  * Single button to switch to Burmese (မြန်မာ)
  * Dropdown-style menu
- URL-based routing (e.g., /my/about, /en/about)
- Default locale: Burmese (my)
- Automatic font switching for Burmese text (Padauk font)

## Technical Notes
- Used `next-intl` for i18n management
- Locale prefix 'always' (always show locale prefix in URLs)
- All translations stored in JSON files
- Server-side rendering with `getMessages()`
- Client components use `useTranslations` hook
- Middleware at project root (`proxy.ts`) handles locale detection
- i18n config at `src/i18n/config.ts` defines locales and default
- Removed English as a language option from switcher

## Deployment Status
- **Build successful:** Yes, no errors
- **Routes:**
  * `/` - Static (redirects to `/my`)
  * `/my` - Dynamic (Burmese)
  * `/my/about`, `/my/community`, `/my/tools`, `/my/guides` - Dynamic
  * `/en` - Dynamic (English)
  * `/en/about`, `/en/community`, `/en/tools`, `/en/guides` - Dynamic
  * `/_not-found` - Static
  * `/favicon.ico` - Static

## Build Output
- Middleware detected: Yes
- Static pages: 3 (/, /_not-found, /favicon.ico)
- Dynamic routes: 8 (all locale routes)
- No TypeScript errors
- No transient module issues

## Production URL
- https://mingalbar-sg.vercel.app

## Next Steps
- Test language switching functionality in production
- Consider adding more detailed Burmese translations
- Add Burmese content for tools and guides

---
