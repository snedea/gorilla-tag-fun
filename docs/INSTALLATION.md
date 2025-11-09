# Installation Guide - Gorilla Tag Fun Math Game

Complete step-by-step guide for installing and running the Gorilla Tag Fun Math Game.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Installation Steps](#detailed-installation-steps)
4. [Running the Game](#running-the-game)
5. [Building for Production](#building-for-production)
6. [Troubleshooting](#troubleshooting)
7. [Browser Requirements](#browser-requirements)

---

## Prerequisites

Before installing the game, ensure you have the following installed on your system:

### Required Software

**Node.js (v18 or higher)**
- Download from: https://nodejs.org/
- Verify installation:
  ```bash
  node --version
  # Should output: v18.0.0 or higher
  ```

**npm (v9 or higher)**
- Comes bundled with Node.js
- Verify installation:
  ```bash
  npm --version
  # Should output: 9.0.0 or higher
  ```

**Git**
- Download from: https://git-scm.com/
- Verify installation:
  ```bash
  git --version
  # Should output: git version 2.x.x
  ```

### Recommended Software

- **VS Code**: Code editor with built-in terminal
- **Chrome/Firefox/Safari**: For testing the game
- **Git GUI Client** (optional): GitHub Desktop, GitKraken, etc.

---

## Quick Start

For experienced developers who want to get started immediately:

```bash
# Clone the repository
git clone https://github.com/yourusername/gorilla-tag-fun.git
cd gorilla-tag-fun

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

---

## Detailed Installation Steps

### Step 1: Clone the Repository

**Option A: Using Command Line**
```bash
# Navigate to your preferred directory
cd ~/projects

# Clone the repository
git clone https://github.com/yourusername/gorilla-tag-fun.git

# Navigate into project directory
cd gorilla-tag-fun
```

**Option B: Using GitHub Desktop**
1. Open GitHub Desktop
2. Click "File" → "Clone Repository"
3. Select the "URL" tab
4. Enter: `https://github.com/yourusername/gorilla-tag-fun.git`
5. Choose local path and click "Clone"

**Option C: Download ZIP**
1. Visit the GitHub repository
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your desired location
5. Open terminal/command prompt in the extracted folder

### Step 2: Verify Project Structure

After cloning, verify your project structure:

```bash
ls -la
```

You should see:
```
gorilla-tag-fun/
├── .context-foundry/
├── .git/
├── docs/
├── node_modules/     (after npm install)
├── src/
├── tests/
├── index.html
├── package.json
├── README.md
└── ...other files
```

### Step 3: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will:
- Download all dependencies listed in `package.json`
- Create `node_modules/` directory
- Generate `package-lock.json` (if not present)
- Take 1-3 minutes depending on internet speed

**Expected Output:**
```
added 150 packages in 45s
```

**Verify Installation:**
```bash
npm list --depth=0
```

You should see key packages:
- `phaser@3.70.0` - Game engine
- `vite@latest` - Build tool
- `jest@latest` - Unit testing
- `@playwright/test@latest` - E2E testing

### Step 4: Verify Installation

Check that everything is set up correctly:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check installed packages
npm list phaser
npm list vite
```

---

## Running the Game

### Development Mode

**Start the development server:**
```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Access the game:**
1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the game loading screen

**Development Features:**
- Hot Module Replacement (HMR) - Changes appear instantly
- Source maps for debugging
- Detailed error messages in console
- Fast refresh on file save

**Using the Dev Server:**
```bash
# Run on specific port
npm run dev -- --port 3000

# Expose to network (for testing on mobile devices)
npm run dev -- --host

# Open browser automatically
npm run dev -- --open
```

### Stop the Server

Press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac) in the terminal.

---

## Building for Production

### Create Production Build

Generate optimized files for deployment:

```bash
npm run build
```

**What happens:**
1. Vite compiles all source files
2. JavaScript is minified and optimized
3. Assets are optimized and hashed
4. Output is placed in `dist/` directory

**Expected Output:**
```
vite v5.x.x building for production...
✓ 45 modules transformed.
dist/index.html                  6.73 kB
dist/assets/index-abc123.js    250.45 kB │ gzip: 78.23 kB
✓ built in 3.45s
```

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

This serves the `dist/` folder at `http://localhost:4173`

### Build Output Structure

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [optimized images and fonts]
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: "npm: command not found"

**Problem:** Node.js/npm not installed or not in PATH

**Solution:**
1. Download and install Node.js from https://nodejs.org/
2. Restart your terminal
3. Verify with `node --version` and `npm --version`

**Windows users:** You may need to add Node.js to PATH manually:
- Control Panel → System → Advanced → Environment Variables
- Add Node.js installation directory to PATH

#### Issue 2: "Cannot find module 'phaser'"

**Problem:** Dependencies not installed

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### Issue 3: "Port 5173 is already in use"

**Problem:** Another process is using the default port

**Solution:**
```bash
# Option 1: Run on different port
npm run dev -- --port 3000

# Option 2: Kill process using port 5173
# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F
```

#### Issue 4: "Failed to load assets"

**Problem:** Asset paths are incorrect or files missing

**Solution:**
1. Check that `assets/` folder exists in project root
2. Verify asset paths in code use relative paths
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for specific file errors

#### Issue 5: "npm ERR! peer dependencies"

**Problem:** Dependency version conflicts

**Solution:**
```bash
# Install with legacy peer deps
npm install --legacy-peer-deps

# Or force install
npm install --force
```

#### Issue 6: Blank Screen / Game Won't Load

**Problem:** JavaScript errors preventing game from starting

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Common fixes:
   - Clear browser cache
   - Check for CORS errors (must run from server, not file://)
   - Verify all assets loaded (Network tab)
   - Check Phaser version compatibility

#### Issue 7: "EACCES: permission denied"

**Problem:** npm install fails due to permissions

**Solution:**
```bash
# Mac/Linux: Don't use sudo, fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile

# Then reinstall
npm install
```

#### Issue 8: Slow Installation

**Problem:** npm install is very slow

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Use faster registry (optional)
npm config set registry https://registry.npmjs.org/

# Try yarn instead (faster)
npm install -g yarn
yarn install
```

### Getting Help

If you encounter issues not listed here:

1. **Check Browser Console:**
   - Press F12
   - Look for red error messages
   - Copy error text for searching

2. **Search GitHub Issues:**
   - Visit repository Issues page
   - Search for your error message
   - Check both open and closed issues

3. **Create New Issue:**
   - Include your error message
   - Include your OS and versions:
     ```bash
     node --version
     npm --version
     # Your OS version
     ```
   - Include steps to reproduce

4. **Community Help:**
   - Stack Overflow: Tag with `phaser`, `javascript`, `vite`
   - Phaser Discord: https://phaser.io/community/discord

---

## Browser Requirements

### Supported Browsers

| Browser | Minimum Version | Desktop | Tablet | Recommended |
|---------|----------------|---------|--------|-------------|
| Chrome  | 120+           | ✓       | ✓      | Yes         |
| Safari  | 17+            | ✓       | ✓      | Yes         |
| Firefox | 120+           | ✓       | ✓      | Yes         |
| Edge    | 120+           | ✓       | -      | Yes         |

### Browser Feature Requirements

The game requires:
- **HTML5 Canvas** support
- **WebGL** (for rendering)
- **Web Audio API** (for sounds)
- **localStorage** (for saving progress)
- **ES6+ JavaScript** (arrow functions, classes, modules)

### Checking Browser Compatibility

**Test your browser:**
1. Visit: https://html5test.com/
2. Check for Canvas, WebGL, Audio API support
3. Score should be 450+

**Enable required features:**
- **Enable JavaScript:** Required for game to run
- **Enable localStorage:** For saving progress
- **Enable cookies:** Not required (we don't use them)
- **Allow audio autoplay:** For sound effects

### Browser-Specific Notes

**Chrome/Edge:**
- Best performance
- Full feature support
- Recommended for development

**Safari:**
- May require user interaction before playing audio
- Test on actual iPad for touch controls
- WebGL sometimes slower than Chrome

**Firefox:**
- Good compatibility
- May show security warnings for localhost
- Performance similar to Chrome

### Testing on Mobile Browsers

**iPad Safari:**
```bash
# Expose dev server to network
npm run dev -- --host

# Find your IP address
# Mac/Linux:
ifconfig | grep "inet "

# Windows:
ipconfig

# Access from iPad:
# http://YOUR_IP:5173
```

**Touch Controls:**
- Test all buttons with finger (not mouse)
- Verify 44x44px minimum touch targets
- Test landscape and portrait modes

---

## Next Steps

After successful installation:

1. **Explore the Code:**
   - Read `README.md` for overview
   - Check `src/` folder structure
   - Review `docs/ARCHITECTURE.md`

2. **Run Tests:**
   - See `docs/TESTING.md`
   - Run `npm test` for unit tests
   - Run `npm run test:e2e` for browser tests

3. **Start Developing:**
   - Make changes in `src/` files
   - See hot reload in browser
   - Check browser console for errors

4. **Read Documentation:**
   - `docs/USAGE.md` - How to play
   - `docs/ARCHITECTURE.md` - System design
   - `docs/TESTING.md` - Testing guide

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests
npm run test:unit        # Unit tests only
npm run test:e2e         # E2E browser tests
npm run test:coverage    # Coverage report

# Utilities
npm run lint             # Check code style
npm run format           # Format code
npm run clean            # Clean build files
```

---

**Installation complete! Start developing with `npm run dev`**
