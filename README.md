# 🎮 Hacker Maze Escape

A cyberpunk-themed maze escape game built with Next.js, TypeScript, and Tailwind CSS. Navigate through digital labyrinths, solve puzzles, collect data chips, and escape before time runs out!

![Hacker Maze Escape](https://img.shields.io/badge/Game-Hacker%20Maze%20Escape-00ff00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMDBmZjAwIi8+Cjwvc3ZnPg==)

## 🚀 Features

### Core Gameplay
- **🎯 Maze Navigation**: Randomly generated 21x21 mazes with guaranteed solvable paths
- **⏰ Time Challenge**: 2-minute timer with dynamic pressure mechanics
- **🧩 Puzzle System**: Math, typing, binary, and hex conversion challenges
- **💎 Collectibles**: Data chips scattered throughout the maze for bonus points
- **🔥 Dynamic Obstacles**: Moving firewall entities that chase the player
- **🔒 Interactive Elements**: Locked doors that require puzzle-solving to open

### User Experience
- **🎨 Cyberpunk Aesthetic**: Full hacker theme with neon green Matrix-style visuals
- **🏆 Leaderboard System**: Top 5 scores saved locally with player statistics
- **⚙️ Settings Management**: Toggle sound effects and background music
- **📱 Responsive Design**: Optimized for both desktop and mobile devices
- **🎪 Animations**: Smooth Framer Motion animations throughout the interface

### Technical Features
- **⚡ Performance Optimized**: Efficient maze rendering with memoization
- **💾 Local Storage**: Persistent game data and settings
- **🎵 Audio Integration**: Sound effects for movement, puzzles, and interactions
- **🎮 Keyboard Controls**: WASD and arrow key support
- **🔄 State Management**: Complex game state with React hooks

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom hacker theme
- **Animations**: Framer Motion
- **Build Tool**: Next.js built-in bundler
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
hacker-maze-escape/
├── components/           # React components
│   ├── Maze.tsx         # Main game grid renderer
│   ├── Player.tsx       # Player character with movement
│   ├── PuzzleModal.tsx  # Puzzle challenge interface
│   ├── Timer.tsx        # Game countdown timer
│   ├── ScoreBoard.tsx   # Live score display
│   └── SettingsModal.tsx# Audio and game settings
├── lib/                 # Utility libraries
│   ├── mazeGenerator.ts # Maze creation algorithms
│   ├── puzzles.ts       # Puzzle generation logic
│   └── storage.ts       # LocalStorage helpers
├── pages/              # Next.js pages
│   ├── index.tsx       # Home page with leaderboard
│   ├── game.tsx        # Main gameplay page
│   ├── summary.tsx     # Post-game results
│   ├── _app.tsx        # Next.js app wrapper
│   └── _document.tsx   # HTML document structure
├── public/             # Static assets
│   ├── images/         # Game sprites and icons
│   ├── sounds/         # Audio files
│   └── hacker.ttf      # Custom hacker font
├── styles/             # CSS styles
│   └── globals.css     # Global styles with Tailwind
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
├── next.config.js      # Next.js configuration
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone or navigate to the repository**:
   ```bash
   cd hacker-maze-escape
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

The game will start immediately, and you can begin playing right away!

## 🎮 How to Play

### Game Objective
Navigate through the digital maze to reach the exit before the 2-minute timer expires while collecting data chips and solving security puzzles.

### Controls
- **Movement**: Use WASD keys or Arrow keys to move your character
- **Interaction**: Click on yellow lockers to trigger security puzzles
- **Pause**: Press ESC to pause the game or access settings
- **Menu Navigation**: Use mouse to interact with buttons and modals

### Game Elements

| Element | Description | Points |
|---------|-------------|--------|
| 🔵 Player | Your character (glowing green circle) | - |
| 💎 Data Chip | Blue collectible items | +100 points |
| 🔒 Locker | Yellow puzzle triggers | +200 points (when solved) |
| 🔥 Firewall | Red moving obstacles | -10 seconds & -50 points |
| 🏁 Exit | Green pulsing exit portal | +1000 points (completion) |

### Scoring System
- **Base Movement**: 10 points per move
- **Data Chips**: 100 points each
- **Puzzle Success**: 200 points
- **Time Bonus**: 10 points per second remaining
- **Speed Multiplier**: Up to 2x based on remaining time
- **Completion Bonus**: 1000 points for reaching the exit
- **Perfect Game**: +500 points for collecting all chips

### Puzzle Types
1. **Math Problems**: Basic arithmetic (+, -, ×)
2. **Typing Challenges**: Speed typing of hacker phrases
3. **Binary Conversion**: Convert decimal to binary or vice versa
4. **Hexadecimal**: Convert decimal numbers to hex format

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npx tsc --noEmit     # Check TypeScript types
```

### Environment Setup

1. **Development Environment**:
   - The app runs in development mode with hot reloading
   - TypeScript type checking in real-time
   - Tailwind CSS compilation with JIT mode

2. **Code Structure**:
   - Components are modular and reusable
   - Game logic is separated into utility functions
   - Type safety ensured throughout the codebase

3. **Customization**:
   - Modify `tailwind.config.js` for theme changes
   - Update `lib/mazeGenerator.ts` for different maze algorithms
   - Add new puzzle types in `lib/puzzles.ts`

### Adding New Features

1. **New Puzzle Types**:
   ```typescript
   // In lib/puzzles.ts
   const generateCustomPuzzle = (): Puzzle => {
     return {
       id: Date.now().toString(),
       type: 'custom',
       question: 'Your question here',
       answer: 'Expected answer',
       timeLimit: 30,
     };
   };
   ```

2. **Custom Game Elements**:
   ```typescript
   // In lib/mazeGenerator.ts
   export interface CustomElement {
     x: number;
     y: number;
     type: 'custom';
     // Add your properties
   }
   ```

## 🚀 Deployment to Vercel

### Automatic Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Deploy**:
   - Click "Deploy"
   - Your game will be live in ~2 minutes
   - Get a shareable URL instantly

### Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

3. **Follow CLI prompts**:
   - Set project name
   - Configure domain (optional)
   - Deploy!

### Environment Configuration

Create a `vercel.json` file (optional):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "pages/api/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### Post-Deployment

After deployment, your game will be available at:
- **Vercel Domain**: `your-project-name.vercel.app`
- **Custom Domain**: Configure in Vercel dashboard

## 🎨 Customization

### Theme Modification

Update colors in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'hacker-green': '#00ff00',    // Primary green
        'hacker-dark': '#0a0a0a',     // Background
        'hacker-matrix': '#00ff41',   // Accent green
        'hacker-red': '#ff0040',      // Danger red
        'hacker-blue': '#0040ff',     // Info blue
      }
    }
  }
}
```

### Game Balance

Modify game parameters in `pages/game.tsx`:

```typescript
const initialState: GameState = {
  // ... other properties
  timeLeft: 180, // 3 minutes instead of 2
  // Adjust scoring in handlePlayerMove function
};
```

### Maze Complexity

Change maze generation in `lib/mazeGenerator.ts`:

```typescript
export const generateMaze = (width: number = 31, height: number = 31) => {
  // Larger maze for increased difficulty
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **TypeScript Errors**:
   ```bash
   # Check for type issues
   npx tsc --noEmit
   ```

3. **Styling Issues**:
   ```bash
   # Rebuild Tailwind
   npm run dev
   # Check browser console for CSS errors
   ```

4. **Performance Issues**:
   - Reduce maze size in game settings
   - Disable animations in low-performance browsers
   - Check browser developer tools for memory usage

### Browser Compatibility

- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+
- **Minimum**: ES2020 support required
- **Mobile**: iOS 14+, Android 10+

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code formatting
- Add comments for complex game logic
- Test on multiple devices/browsers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] **Multiplayer Mode**: Real-time competitive maze solving
- [ ] **Level Editor**: Create and share custom mazes
- [ ] **Power-ups**: Temporary abilities and tools
- [ ] **Achievement System**: Unlock rewards and badges
- [ ] **Sound Effects**: Enhanced audio experience
- [ ] **Mobile App**: Native iOS/Android versions
- [ ] **Social Features**: Share scores and challenge friends

## 💡 Game Design Notes

### Maze Generation Algorithm
The game uses a recursive backtracking algorithm to generate mazes:
1. Start with a grid full of walls
2. Choose a random starting cell
3. Recursively visit unvisited neighbors
4. Remove walls between connected cells
5. Backtrack when no unvisited neighbors remain

### Scoring Balance
The scoring system encourages:
- **Speed**: Time-based multipliers reward quick completion
- **Exploration**: Data chip collection for bonus points
- **Skill**: Puzzle-solving demonstrates player ability
- **Risk/Reward**: Firewall avoidance vs. optimal pathing

### Difficulty Progression
- **Easy Start**: Simple math and typing puzzles
- **Medium Challenge**: Binary conversion puzzles
- **Hard Mode**: Complex hex and time pressure
- **Expert Level**: All elements combined with minimal time

---

## 🎮 Ready to Play?

Start your hacking mission now:

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) and begin your escape from the digital labyrinth!

**Good luck, hacker! The matrix awaits your infiltration... 🕶️**