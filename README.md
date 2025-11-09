# 🦍 Gorilla Tag Fun - Math Game for 2nd Graders

A fun, web-based educational math game inspired by Gorilla Tag! Help a friendly gorilla swing through the jungle by solving math problems, collecting bananas, and mastering 2nd grade math skills.

## 🎮 Features

- **Educational & Fun**: Aligned with Common Core 2nd grade math standards
- **Three Difficulty Levels**:
  - Easy: Addition/subtraction (0-20)
  - Medium: Addition/subtraction (0-50)
  - Hard: Addition/subtraction (0-100)
- **Engaging Gameplay**:
  - Animated gorilla character with swinging mechanics
  - Collect bananas for bonus points
  - Earn stars based on accuracy
  - Encouraging feedback messages (no negative reinforcement)
- **Kid-Friendly Design**:
  - Large, colorful buttons (touch-friendly)
  - Clear, readable fonts
  - Bright jungle theme
  - Positive, encouraging language
- **Cross-Platform**: Works on desktop and tablets (Chrome, Safari, Firefox, Edge)
- **Privacy-Focused**: No data collection, COPPA compliant
- **Offline-Capable**: Play after initial load

## 🚀 Installation

### Play Online (Recommended)

Visit [GitHub Pages URL] (will be available after deployment)

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/snedea/gorilla-tag-fun.git
   cd gorilla-tag-fun
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Choose Your Difficulty**: Select Easy, Medium, or Hard from the main menu
2. **Solve Math Problems**: Answer 5 questions to complete a level
3. **Collect Bananas**: Correct answers let your gorilla swing forward and collect bananas
4. **Earn Stars**: Get 1-3 stars based on your accuracy:
   - 🌟 1 Star: 60%+ correct
   - 🌟🌟 2 Stars: 80%+ correct
   - 🌟🌟🌟 3 Stars: 95%+ correct
5. **Have Fun**: Enjoy encouraging feedback and jungle animations!

### Controls

- **Keyboard**: Type numbers (0-9), press Enter to submit, Backspace to delete
- **On-Screen Number Pad**: Click/tap buttons for touch devices
- **Pause**: Press ESC to pause the game

## 🏗️ Project Structure

```
gorilla-tag-fun/
├── index.html              # Entry point
├── src/
│   ├── main.js            # Phaser game initialization
│   ├── scenes/            # Game scenes
│   │   ├── BootScene.js   # Asset loading
│   │   ├── MenuScene.js   # Main menu
│   │   ├── GameScene.js   # Main gameplay
│   │   └── ResultsScene.js # Level results
│   ├── systems/           # Core game systems
│   │   ├── MathEngine.js
│   │   ├── ProgressManager.js
│   │   ├── InputManager.js
│   │   ├── AnimationController.js
│   │   ├── AudioManager.js
│   │   └── UIManager.js
│   ├── entities/          # Game characters
│   │   ├── Gorilla.js
│   │   ├── Banana.js
│   │   └── Vine.js
│   ├── ui/                # UI components
│   │   ├── NumberPad.js
│   │   ├── QuestionDisplay.js
│   │   ├── FeedbackPanel.js
│   │   └── ProgressBar.js
│   ├── utils/             # Utility functions
│   └── data/              # Game data (questions, feedback)
└── tests/                 # Test files
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Unit Tests (Jest)
```bash
npm run test:unit
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

### Coverage Report
```bash
npm run test:coverage
```

## 🎓 Educational Standards

This game aligns with Common Core State Standards for 2nd Grade Mathematics:

- **2.OA.A.1**: Use addition and subtraction within 100 to solve one- and two-step word problems
- **2.OA.B.2**: Fluently add and subtract within 20 using mental strategies
- **2.NBT.A.1**: Understand place value (ones, tens)
- **2.NBT.B.5**: Fluently add and subtract within 100

## 🛠️ Technologies Used

- **Game Engine**: Phaser 3.70+
- **Language**: JavaScript ES6+
- **Build Tool**: Vite
- **Testing**: Jest (unit), Playwright (E2E)
- **Deployment**: GitHub Pages

## 👨‍👩‍👧‍👦 For Parents & Teachers

This game is designed to:
- Reinforce math skills through play-based learning
- Build confidence with positive reinforcement
- Provide immediate feedback to support learning
- Allow independent practice without adult supervision
- Track progress within each session

**Privacy**: No personal information is collected. Progress is stored locally on the device only.

**Recommended Usage**: 10-15 minutes per session, 2-3 times per week

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🤖 Built with Context Foundry

This project was built autonomously using [Context Foundry](https://contextfoundry.dev) - an AI-powered software development system.

---

**Have fun learning math! 🦍🍌📚**
