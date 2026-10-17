# GPT — Mobile AI Companion

A mobile-first, installable AI companion interface designed for fast conversations, clear navigation, and a calm reading experience.

## Features

- Responsive mobile-first layout
- Chat composer with send states and conversation starters
- Local conversation history saved in the browser
- Light/dark appearance toggle
- Installable Progressive Web App (PWA) shell
- Keyboard-friendly controls and reduced-motion support
- No API key is embedded in the frontend; connect a trusted backend to enable live AI responses

## Run locally

This is a static application. Open `index.html` in a browser, or serve the repository with any static web server.

## Connect an AI provider

The UI currently uses a demo response so it works without a secret or server. For production, create a backend endpoint such as `/api/chat`, store provider credentials in server-side environment variables, and replace the demo handler in `app.js`. Never expose API keys in client-side code.

## Hourly maintenance

The GitHub Actions workflow in `.github/workflows/hourly-maintenance.yml` runs hourly and on manual dispatch. It checks for basic project integrity and reports the result in Actions. Scheduled checks do not automatically rewrite code or deploy without a reviewed, scoped change.
