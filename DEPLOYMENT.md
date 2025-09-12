# Wren Manor - Deployment Guide

This treasure hunt game can be deployed to multiple platforms. Follow the instructions below for your preferred deployment method.

## Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

## Deployment Options

### 1. GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub username:
```json
"homepage": "https://yourusername.github.io/wren-manor"
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Deploy:
```bash
npm run deploy
```

4. Enable GitHub Pages in your repository settings (Settings > Pages > Source: gh-pages branch)

### 2. Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to configure your project

### 3. Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod --dir=dist
```

3. Or drag and drop the `dist` folder to netlify.com

## Environment Variables

For production deployment, you may need to set up environment variables for Supabase:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Features

- ✅ Real-time leaderboard showing top 3 teams
- ✅ Sequential puzzle progression
- ✅ Python debugging puzzle with keypad
- ✅ Responsive design
- ✅ Competitive timing system
- ✅ Local storage backup

## Troubleshooting

1. **Routing issues**: Ensure your hosting platform supports SPA routing (all platforms above do)
2. **Build errors**: Check that all dependencies are installed
3. **Leaderboard not updating**: Verify localStorage is working in your browser

## Development

```bash
npm run dev
```

The game will be available at `http://localhost:8080`
