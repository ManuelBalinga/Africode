# Africode Studios

Marketing site for Africode Studios — websites, online stores and web apps for
businesses in Ghana, Cameroon and worldwide. Bilingual (EN/FR) with a light and
dark theme and a questionnaire that recommends a package and hands off to
WhatsApp.

Built with [Next.js](https://nextjs.org) (App Router) and React.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

## How it is laid out

```
src/app/         Routes. Each page.jsx is a server component that exports
                 metadata and renders its view.
src/views/       The page components themselves (client components).
src/components/  Header, Footer, and shared UI.
src/i18n/        Translations and the language provider.
src/theme/       Light/dark theme provider.
src/questionnaire/  Questions, scoring and submission for /start.
src/data/        Packages and portfolio projects.
src/config.js    Contact details, package prices, Google Form settings.
```

Routes: `/`, `/what-we-build`, `/pricing`, `/work`, `/about`, `/start`.

## Editing content

Most changes are content, not code:

- **Contact details, prices, lead form** — `src/config.js`
- **Wording, both languages** — `src/i18n/translations.js`
- **Portfolio entries** — `src/data/projects.js`
- **Package contents** — `src/data/packages.js`
- **Colours and fonts** — `src/app/globals.css`

## Deploying

The repository is linked to Vercel. Pushing to `main` deploys to production;
pushing any other branch creates a preview deployment. No configuration is
needed — Vercel detects Next.js at the repository root.

The site URL used for canonical tags and link-preview images is resolved from
the environment: `NEXT_PUBLIC_SITE_URL` if set, otherwise the Vercel-provided
production URL, otherwise the current deployment URL. So previews and canonicals
are correct even before a custom domain exists.

NOTE: `africodestudios.com` is not currently registered. Buy it (or whatever
domain you settle on), add it to the Vercel project, and only then set
`NEXT_PUBLIC_SITE_URL` to it.

Set `NEXT_PUBLIC_SITE_URL` to the live domain in the Vercel project's
environment variables so link previews and canonical URLs point at the real
site. It defaults to `https://africodestudios.com`.
