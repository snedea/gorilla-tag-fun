# Usage Guide - Gorilla Tag Fun Math Game

Complete guide to playing and using the Gorilla Tag Fun Math Game.

## Table of Contents

1. [Getting Started](#getting-started)
2. [How to Play](#how-to-play)
3. [Game Controls](#game-controls)
4. [Difficulty Levels](#difficulty-levels)
5. [Scoring System](#scoring-system)
6. [Features and Mechanics](#features-and-mechanics)
7. [Tips for Players](#tips-for-players)
8. [For Parents and Teachers](#for-parents-and-teachers)

---

## Getting Started

### Accessing the Game

**Online (Recommended):**
- Visit the GitHub Pages URL (will be provided after deployment)
- No installation required
- Works immediately in your browser

**Offline/Local:**
- Follow the [Installation Guide](./INSTALLATION.md)
- Run `npm run dev`
- Open `http://localhost:5173`

### First Time Players

When you first open the game:

1. **Loading Screen:** Wait for assets to load (3-5 seconds)
2. **Main Menu:** You'll see the jungle-themed main menu
3. **Choose Difficulty:** Select Easy, Medium, or Hard
4. **Start Playing:** Jump right into your first math challenge!

**No Account Required:**
- No login or signup needed
- No personal information collected
- Progress saved locally on your device
- Privacy-friendly and COPPA compliant

---

## How to Play

### Game Flow

```
Main Menu → Select Difficulty → Answer 5 Questions → View Results → Replay or Return to Menu
```

### Step-by-Step Gameplay

#### 1. Main Menu
- **What you see:** Jungle background with friendly gorilla character
- **Options:**
  - "Easy" button - Addition/subtraction 0-20
  - "Medium" button - Addition/subtraction 0-50
  - "Hard" button - Addition/subtraction 0-100
  - Instructions button (?)
  - For Parents button (i)
  - Mute button (sound icon)

#### 2. Selecting Difficulty
- Click or tap your chosen difficulty level
- Game transitions to the jungle environment
- First question appears automatically

#### 3. Answering Questions

**Reading the Question:**
- Math problem appears at the top of screen
- May be an equation: "7 + 5 = ?"
- May be a word problem: "The gorilla found 3 bananas. Then found 4 more. How many total?"
- Visual hints (banana images) may appear for easier problems

**Entering Your Answer:**
- **On Computer:** Type numbers using keyboard (0-9)
- **On Tablet:** Tap the on-screen number pad
- **Backspace:** Use keyboard backspace or tap backspace button
- **Submit:** Press Enter key or tap "Submit" button

**Feedback:**
- **Correct Answer:**
  - Green checkmark appears
  - Encouraging message: "Great job!", "You're a math whiz!", etc.
  - Gorilla swings forward
  - Collect a banana
  - Points added to score

- **Incorrect Answer:**
  - Orange color, gentle feedback
  - Message: "Try again!", "Almost there!", "So close!"
  - Input clears, allowing you to retry
  - No penalties - keep trying until correct
  - After 2 attempts, visual hints may appear

#### 4. Level Progress
- Progress bar shows how many questions completed (e.g., "2/5")
- Banana counter shows total bananas collected
- Score counter shows current points
- Each correct answer moves you closer to completion

#### 5. Level Complete
- After answering all 5 questions correctly
- Celebration animation plays
- Results screen appears showing:
  - Final score
  - Accuracy percentage
  - Stars earned (1-3 stars)
  - Total bananas collected
  - Encouraging message

#### 6. Results Screen Options
- **Replay:** Play the same difficulty again
- **Menu:** Return to main menu to select different difficulty
- **Continue:** Try next difficulty level (if unlocked)

---

## Game Controls

### Keyboard Controls (Desktop)

| Key | Action |
|-----|--------|
| **0-9** | Enter number digits |
| **Enter** | Submit answer |
| **Backspace** | Delete last digit |
| **Escape** | Pause game / Return to menu |
| **Space** | Resume from pause (if paused) |

**Typing Example:**
```
Question: 7 + 5 = ?
Type: 1 → 2 → Enter
(Shows "12" then submits)
```

### Touch Controls (Tablet)

**Number Pad:**
- Tap numbers 0-9 to build your answer
- Tap backspace (←) to delete
- Tap Submit (✓) to check answer

**Buttons:**
- Large, colorful buttons (minimum 44x44 pixels)
- Visual feedback on tap
- Clear labels and icons

**Touch Gestures:**
- Single tap: Select/activate
- No swipe or multi-touch required
- Works in portrait or landscape mode

### Mouse Controls (Desktop)

- Click difficulty buttons to select
- Click number pad buttons to enter answer
- Click pause button in top-right corner
- Click mute button to toggle sound

### Accessibility Controls

**Keyboard Navigation:**
- Tab key to move between buttons
- Enter to activate selected button
- Arrows keys to navigate menus

**Screen Reader Support:**
- Buttons have descriptive labels
- Questions read aloud (if screen reader enabled)
- Feedback messages accessible

---

## Difficulty Levels

### Easy Mode (Ages 7-8)

**Number Range:** 0-20

**Question Types:**
- Simple addition: 3 + 4 = ?
- Simple subtraction: 8 - 3 = ?
- Word problems: "The gorilla has 5 bananas. She eats 2. How many left?"

**Features:**
- Visual hints available (banana counting images)
- Larger numbers with clear fonts
- 5 questions per level
- Encouraging messages after every answer

**Educational Goals:**
- Master addition/subtraction within 20
- Build mental math confidence
- Learn from visual representations
- Develop number sense

**Example Questions:**
```
1. 7 + 3 = ?          (Answer: 10)
2. 12 - 5 = ?         (Answer: 7)
3. 6 + 6 = ?          (Answer: 12)
4. 15 - 8 = ?         (Answer: 7)
5. 9 + 4 = ?          (Answer: 13)
```

### Medium Mode (Ages 8+)

**Number Range:** 0-50

**Question Types:**
- Two-digit addition: 23 + 15 = ?
- Two-digit subtraction: 45 - 12 = ?
- Mixed operations
- Some word problems

**Features:**
- Fewer visual hints
- Faster pace encouraged
- More variety in question formats
- Requires stronger number sense

**Educational Goals:**
- Fluent addition/subtraction within 50
- Two-digit mental math
- Place value understanding (tens and ones)
- Word problem comprehension

**Example Questions:**
```
1. 23 + 15 = ?        (Answer: 38)
2. 42 - 18 = ?        (Answer: 24)
3. 30 + 19 = ?        (Answer: 49)
4. ? + 12 = 35        (Answer: 23)
5. 48 - ? = 21        (Answer: 27)
```

### Hard Mode (Ages 8+)

**Number Range:** 0-100

**Question Types:**
- Large number addition: 67 + 28 = ?
- Large number subtraction: 83 - 45 = ?
- Missing number problems: ? + 35 = 72
- Complex word problems

**Features:**
- No visual hints
- Varied question formats
- Higher accuracy threshold for stars
- Challenge mode for advanced students

**Educational Goals:**
- Master addition/subtraction within 100
- Strong place value understanding
- Mental math strategies
- Problem-solving skills

**Example Questions:**
```
1. 67 + 28 = ?        (Answer: 95)
2. 83 - 45 = ?        (Answer: 38)
3. ? + 37 = 84        (Answer: 47)
4. 92 - 56 = ?        (Answer: 36)
5. 48 + ? = 100       (Answer: 52)
```

---

## Scoring System

### Points

**Correct Answer Points:**
- Easy: 100 points per correct answer
- Medium: 150 points per correct answer
- Hard: 200 points per correct answer

**Bonus Points:**
- Banana collected: +10 points each
- Speed bonus: Up to +50 points for quick answers
- First try correct: +25 bonus points

**Example Score Calculation (Easy Mode):**
```
5 questions × 100 points = 500 points
5 bananas × 10 points = 50 points
3 first-try bonuses × 25 = 75 points
Total: 625 points
```

### Stars

Stars are awarded based on accuracy:

**3 Stars (Excellent):**
- 95%+ accuracy (5/5 or 19/20 correct on first try)
- Message: "Perfect! You're a math star!"

**2 Stars (Great):**
- 80-94% accuracy (4/5 correct on first try)
- Message: "Great job! Keep it up!"

**1 Star (Good):**
- 60-79% accuracy (3/5 correct on first try)
- Message: "Good work! Practice makes perfect!"

**Note:** You must get at least 3 out of 5 questions correct to complete the level. Incorrect answers allow unlimited retries.

### Bananas

**Collection:**
- 1 banana collected per correct answer
- Displayed as banana count in HUD
- Cumulative across all gameplay sessions
- Saved to device (localStorage)

**Purpose:**
- Visual progress indicator
- Motivational reward
- Long-term achievement tracking

### Progress Tracking

**Saved Locally:**
- Current session score
- Total bananas collected (all-time)
- Highest score per difficulty
- Levels completed
- Last played date

**Privacy:**
- All data stored locally on your device
- Nothing sent to servers
- Can clear data in browser settings
- No accounts or logins required

---

## Features and Mechanics

### Visual Hints

**When Available:**
- Easy mode only
- After 2 incorrect attempts
- Shows countable objects (bananas, blocks)

**Example:**
- Question: "5 + 3 = ?"
- Hint shows: 🍌🍌🍌🍌🍌 + 🍌🍌🍌 = ?

### Animations

**Gorilla Character:**
- **Idle:** Gentle breathing, looking around
- **Thinking:** Scratching head when question appears
- **Swinging:** Dynamic vine swing on correct answer
- **Celebrating:** Happy dance, jumping for level complete

**Visual Feedback:**
- Particle effects on banana collection
- Confetti on level complete
- Smooth transitions between questions
- Progress bar filling animation

### Sound Effects

**Sounds Include:**
- Correct answer: Positive chime
- Wrong answer: Gentle "oops" (non-punishing)
- Banana collect: Coin-like pickup sound
- Swing: Whoosh sound effect
- Celebration: Victory fanfare
- Button click: UI feedback

**Mute Toggle:**
- Click speaker icon in top-right
- Mutes all sounds and music
- Setting persists across sessions
- Background music (if enabled) also mutes

### Pause Menu

**Accessing:**
- Press Escape key
- Click pause button (top-right)
- Time stops during pause

**Pause Menu Options:**
- Resume Game
- Restart Level
- Return to Main Menu
- View Instructions
- Adjust Settings (mute/unmute)

---

## Tips for Players

### Strategy Tips

**For Easy Mode:**
1. Take your time - there's no time limit
2. Use visual hints if you get stuck
3. Count on your fingers if needed
4. Try breaking numbers into smaller parts (7+5 = 7+3+2)

**For Medium Mode:**
1. Look for patterns (30+19 is close to 30+20)
2. Use mental math strategies (round and adjust)
3. Break two-digit numbers into tens and ones
4. Practice makes perfect - replay levels to improve

**For Hard Mode:**
1. Master place value (tens and ones)
2. Use mental math tricks (compensation, decomposition)
3. Check your answer before submitting
4. Learn from mistakes - notice patterns in errors

### Getting 3 Stars

**Requirements:**
- Get all 5 questions correct on first try
- OR at most 1 mistake

**Strategies:**
1. Read questions carefully
2. Double-check your answer before submitting
3. Use paper for hard problems (if needed)
4. Stay focused and avoid distractions
5. Practice mental math daily

### Improving Your Score

**High Score Tips:**
1. Answer quickly for speed bonuses
2. Get correct on first try for bonus points
3. Complete harder difficulties (more points per question)
4. Collect all bananas (10 points each)
5. Aim for 3-star accuracy

### Making Learning Fun

1. **Set Personal Goals:** "I'll get 3 stars today!"
2. **Compete with Friends:** Compare banana counts
3. **Daily Practice:** Play one level per day
4. **Mix Difficulties:** Warm up with Easy, challenge with Hard
5. **Celebrate Wins:** Be proud of your progress!

---

## For Parents and Teachers

### Educational Value

**Common Core Alignment:**

This game supports these 2nd grade standards:
- **2.OA.A.1:** Solve addition/subtraction word problems
- **2.OA.B.2:** Fluently add/subtract within 20
- **2.NBT.A.1:** Understand place value
- **2.NBT.B.5:** Fluently add/subtract within 100

**Skills Developed:**
- Mental math fluency
- Number sense and reasoning
- Problem-solving strategies
- Mathematical confidence
- Persistence and growth mindset

### Recommended Usage

**Frequency:**
- 10-15 minutes per session
- 2-3 times per week
- Best as supplement to classroom instruction

**When to Use:**
- Morning math warm-up
- Homework practice
- Free time activity
- Summer learning
- Test preparation review

**Monitoring Progress:**
- Check star ratings for accuracy
- Review banana count for consistency
- Observe which difficulty level child chooses
- Notice improvement over time

### Supporting Your Child

**Encouragement Tips:**
1. Praise effort, not just correct answers
2. Celebrate small wins (earning 1 star is great!)
3. Play together - do problems aloud
4. Ask "How did you figure that out?"
5. Don't pressure for perfection

**When to Help:**
- Child is frustrated after multiple attempts
- Same problem type keeps causing errors
- Child avoids playing altogether
- Difficulty level seems too hard/easy

**When NOT to Help:**
- Child is focused and trying
- Making normal mistakes and learning
- Using visual hints effectively
- Shows persistence

### Classroom Integration

**Ideas for Teachers:**

**Math Centers:**
- Rotation station with tablets
- Individual practice time
- Skill reinforcement

**Whole Class:**
- Projected on board for class discussion
- Student demonstrates problem-solving
- Competition days (highest score)

**Differentiation:**
- Easy mode for struggling students
- Hard mode for advanced learners
- Pair students for peer support

**Assessment:**
- Informal progress monitoring
- Pre/post-test skill measurement
- Observation of strategies used

**Home Connection:**
- Share game link with parents
- Weekly challenge competitions
- Family math night activity

### Privacy and Safety

**What Parents Should Know:**

**Data Collection:**
- NO personal information collected
- NO account creation required
- NO advertising or tracking
- COPPA compliant

**Data Storage:**
- Progress saved locally on device only
- Can be cleared by clearing browser data
- Never leaves the device
- No server communication

**Content:**
- Age-appropriate, educational content only
- Positive, encouraging language
- No external links (except documentation)
- No chat or social features

**Safety:**
- No online interactions
- No user-generated content
- No in-app purchases
- Completely free and open-source

### Technical Support for Parents

**Common Issues:**

**Game Won't Load:**
1. Check internet connection (first load only)
2. Try different browser (Chrome recommended)
3. Clear browser cache
4. Update browser to latest version

**Sound Not Working:**
1. Check device volume
2. Check if muted in game (speaker icon)
3. Check browser audio permissions
4. Try refreshing page

**Progress Not Saving:**
1. Enable browser localStorage
2. Don't use private/incognito mode
3. Check browser storage isn't full
4. Try different browser

**Need Help?**
- Check [INSTALLATION.md](./INSTALLATION.md) for detailed troubleshooting
- Visit GitHub repository Issues page
- Contact school tech support

---

## Quick Reference

### Difficulty Quick Guide
| Level | Range | Visual Hints | Questions | Best For |
|-------|-------|--------------|-----------|----------|
| Easy | 0-20 | Yes | 5 | Beginners, building confidence |
| Medium | 0-50 | Some | 5 | Practicing two-digit math |
| Hard | 0-100 | No | 5 | Advanced, mastery challenge |

### Scoring Quick Guide
| Achievement | Points | How to Earn |
|-------------|--------|-------------|
| Correct Answer | 100-200 | Answer correctly (varies by difficulty) |
| Banana | 10 | Automatic on correct answer |
| First Try | 25 | Correct on first attempt |
| Speed Bonus | 0-50 | Answer quickly |

### Stars Quick Guide
- 3 Stars = 95%+ accuracy (nearly perfect)
- 2 Stars = 80-94% accuracy (great job)
- 1 Star = 60-79% accuracy (good work)

---

**Have fun learning math! Practice makes perfect!**

For more information, see:
- [Installation Guide](./INSTALLATION.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Testing Guide](./TESTING.md)
