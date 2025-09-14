# Firebase Setup for Wren Manor

## Migration from Supabase to Firebase

The leaderboard has been migrated from Supabase to Firebase Realtime Database for better real-time functionality.

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `wren-manor` (or your preferred name)
4. Enable Google Analytics if desired
5. Click "Create project"

### 2. Enable Realtime Database

1. In your Firebase project, go to "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose your location (closest to your users)
4. Start in **test mode** for now (we'll set up security rules later)
5. Click "Done"

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web app" icon `</>`
4. Register your app with name: `wren-manor-web`
5. Copy the config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEF1234",
};
```

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
```

### 5. Security Rules (Production)

For production, update your Realtime Database rules:

```json
{
  "rules": {
    "gameProgress": {
      "$userId": {
        ".read": true,
        ".write": true
      }
    },
    "leaderboard": {
      ".read": true,
      "$userId": {
        ".write": true
      }
    }
  }
}
```

## Database Structure

The Firebase database will have this structure:

```
wren-manor-db/
├── gameProgress/
│   └── {teamId}_{playerName}/
│       ├── playerName: "John Doe"
│       ├── teamId: "TEAM001"
│       ├── p1: true
│       ├── p2: false
│       ├── ...
│       ├── weapon: "candlestick"
│       ├── killer: "butler"
│       ├── startTime: 1640995200000
│       └── timestamp: 1640995200000
└── leaderboard/
    └── {teamId}_{playerName}/
        ├── id: "TEAM001_John Doe"
        ├── playerName: "John Doe"
        ├── teamId: "TEAM001"
        ├── completedPuzzles: 5
        ├── totalTime: 1800000
        ├── weapon: "candlestick"
        ├── killer: "butler"
        ├── timestamp: 1640995200000
        └── isComplete: false
```

## Real-time Features

✅ **Automatic leaderboard updates** - No manual refresh needed
✅ **Live notifications** - Toast messages for new players and progress
✅ **Connection status indicator** - Shows live/connecting status
✅ **Individual progress tracking** - Real-time updates for current player
✅ **Sorted leaderboard** - Automatically sorts by completion and time

## Benefits over Supabase

- **Simpler setup** - No SQL database needed
- **Better real-time** - Firebase's real-time database is built for live updates
- **Automatic scaling** - Handles concurrent users better
- **Lower latency** - Faster updates and notifications
- **No complex queries** - Simple key-value structure

## System Lock & Coordinator Access

The system includes an anti-cheat mechanism that locks the system after a game is completed. Coordinators can unlock it using a PIN:

### Default Coordinator PIN: `2024`

To change the coordinator PIN:

1. Open `src/pages/Home.tsx`
2. Find the `COORDINATOR_PIN` constant in the `SystemLockedScreen` component
3. Change `"2024"` to your desired PIN

### How to unlock:

1. When system is locked, click "Coordinator Access"
2. Enter the coordinator PIN
3. Click "Unlock System"
4. System will be unlocked and page will reload

### System Lock Behavior:

- ✅ Locks system after game completion
- ✅ Prevents multiple plays on same browser/device
- ✅ Maintains game integrity for events
- ✅ Coordinator override with PIN access
- ✅ Automatic page reload after unlock

## Testing

The app will work with demo/placeholder values if Firebase isn't configured yet, but real-time features won't work until proper Firebase setup is complete.
