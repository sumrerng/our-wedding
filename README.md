# Chawanlak & Sumrerng Wedding Invitation

## GitHub Pages

This project is intended for the project site:
`https://sumrerng.github.io/our-wedding/`

The Vite base path is configured as `/our-wedding/`. Connect this folder to the existing repository before pushing:

```bash
git remote add origin https://github.com/sumrerng/our-wedding.git
git push -u origin main
```

Enable **Settings > Pages > GitHub Actions** in the repository. The workflow in `.github/workflows/deploy-pages.yml` will build and deploy the site after each push to `main`.

## Connect RSVP to Google Sheets

1. Create a Google Sheet and add a sheet tab named `RSVP`.
2. Open **Extensions > Apps Script**.
3. Copy the contents of `google-apps-script/Code.gs` into the Apps Script editor and save.
4. Choose **Deploy > New deployment**.
5. Select **Web app**, set **Execute as** to **Me**, and set **Who has access** to **Anyone**.
6. Deploy, authorize the script, and copy the Web app URL ending in `/exec`.
7. Create `.env.local` in the project root from `.env.example`:

```text
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

8. Restart the Vite server after changing `.env.local`.

The RSVP form sends `guestName`, `guests`, `contact`, `note`, and `submittedAt`. Each submission is appended to the `RSVP` tab.

Do not commit `.env.local`; it contains your deployment configuration.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
