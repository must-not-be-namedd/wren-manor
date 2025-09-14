# Wren Manor - Treasure Hunt Game

A competitive online treasure hunt game featuring 9 sequential puzzles with real-time leaderboard tracking.

## 🎮 Features

- **9 Sequential Puzzles**: Each puzzle must be completed in order
- **Real-time Leaderboard**: Shows top 3 teams with completion times
- **Python Debugging Challenge**: Puzzle 4 features a buggy Python script that reveals a 4-digit PIN
- **Phone Keypad Interface**: Enter the discovered PIN using a realistic keypad
- **Competitive Timing**: Teams are ranked by completion time
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🎯 Game Flow

1. **Puzzle 1**: Unscramble letters to find the murder weapon
2. **Puzzle 2**: Reconstruct the timeline of events
3. **Puzzle 3**: Verify suspect alibis
4. **Puzzle 4**: Debug Python code to find 4-digit PIN
5. **Puzzle 5-9**: Additional mystery-solving challenges

## 🏆 Leaderboard System

- Real-time updates every 5 seconds
- Shows top 3 teams with completion times
- Displays puzzle progress for each team
- Persistent across browser sessions

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI + Framer Motion
- **Routing**: React Router DOM
- **State Management**: Local Storage + Supabase
- **Deployment**: Vercel, Netlify, GitHub Pages ready

## 📦 Deployment

### GitHub Pages
```bash
npm run deploy
```

### Vercel
```bash
npx vercel
```

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```

## 🔧 Configuration

Update the `homepage` field in `package.json` with your GitHub username for GitHub Pages deployment.

## 🎨 Customization

- Modify puzzle content in `/src/pages/Puzzle*.tsx`
- Update leaderboard logic in `/src/components/LeaderboardWidget.tsx`
- Customize styling in `/src/index.css`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

1. **Build Errors**: Run `npm install --force`
2. **Routing Issues**: Ensure your hosting platform supports SPA routing
3. **Leaderboard Not Updating**: Check browser localStorage support

## 📄 License

MIT License - feel free to use for your own treasure hunts!

---

**Ready to solve the mystery?** Start your investigation at the Ashcroft Estate! 🕵️‍♀️