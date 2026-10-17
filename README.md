# NEXUS — Creative Universe

Nexus is a mobile-first, installable creative workspace for curious people. It helps turn small ideas into projects, discover playful experiments, and keep a personal collection of things worth exploring.

## Experience

- Original editorial visual design with botanical greens, soft paper surfaces, and custom CSS artwork
- Three ways to begin: build something, explore a question, or play with an experiment
- Create personal ideas and save interesting discoveries
- Search discovery cards and filter saved ideas or personal creations
- Responsive navigation for phones, tablets, and desktop
- Light and dark themes
- Local persistence for saved ideas and creations
- Installable Progressive Web App (PWA)
- No framework or package dependencies

## Run locally

Open `index.html` in a browser or serve this directory with any static web server.

## Data and limitations

Personal ideas and saved items are stored in the browser on the current device. This is a frontend-first creative workspace; it does not claim to provide a live AI backend or sync data between devices. If AI features are added later, use a secure server-side endpoint and never put provider API keys in client-side code.

## Hourly maintenance

The GitHub Actions workflow runs hourly and on manual dispatch. It validates the app shell, JavaScript syntax, and PWA manifest. Scheduled checks help catch regressions; they do not blindly rewrite the product or automatically deploy unreviewed changes.
