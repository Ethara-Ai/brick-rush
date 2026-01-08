# Brick Rush - Architecture Documentation

This document provides a comprehensive overview of the Brick Rush React application architecture, including component hierarchy, data flow, and design patterns.

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Component Hierarchy](#component-hierarchy)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Game Loop Architecture](#game-loop-architecture)
- [Module Responsibilities](#module-responsibilities)
- [Design Patterns](#design-patterns)
- [Communication Patterns](#communication-patterns)

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React Application                   │  │
│  │                                                        │  │
│  │  ┌──────────────┐    ┌──────────────┐               │  │
│  │  │   App.jsx    │───▶│  Components  │               │  │
│  │  │  (Root)      │    │   (UI/Menus) │               │  │
│  │  └──────────────┘    └──────────────┘               │  │
│  │         │                    │                        │  │
│  │         ▼                    ▼                        │  │
│  │  ┌──────────────┐    ┌──────────────┐               │  │
│  │  │  useGame()   │───▶│ GameCanvas   │               │  │
│  │  │   (Hook)     │    │  (Renderer)  │               │  │
│  │  └──────────────┘    └──────────────┘               │  │
│  │         │                    │                        │  │
│  │         ▼                    ▼                        │  │
│  │  ┌──────────────┐    ┌──────────────┐               │  │
│  │  │   Utils      │    │ HTML5 Canvas │               │  │
│  │  │ (Helpers)    │    │     API      │               │  │
│  │  └──────────────┘    └──────────────┘               │  │
│  │         │                                             │  │
│  │         ▼                                             │  │
│  │  ┌──────────────┐                                    │  │
│  │  │ LocalStorage │                                    │  │
│  │  │  (Persist)   │                                    │  │
│  │  └──────────────┘                                    │  │
│  └────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx (Root Component)
│
├── LoadingScreen
│   └── (Initial loading state)
│
├── TopBar
│   ├── Score Display
│   ├── Lives Display
│   └── Level Display
│
├── GameCanvas
│   ├── Canvas Element
│   ├── Paddle Renderer
│   ├── Ball Renderer
│   ├── Brick Renderer
│   └── PowerUp Renderer
│
└── MenuOverlay (Conditional)
    │
    ├── StartMenu
    │   ├── Game Title
    │   ├── Game Description
    │   ├── Controls Info
    │   └── Start Button
    │
    ├── PauseMenu
    │   ├── Pause Headline
    │   ├── Resume Button
    │   ├── Restart Button
    │   └── Main Menu Button
    │
    ├── GameOverMenu
    │   ├── Game Over Headline
    │   ├── Score Display
    │   ├── High Score Display
    │   ├── Restart Button
    │   └── Main Menu Button
    │
    └── LevelCompleteMenu
        ├── Success Headline
        ├── Score Display
        ├── Next Level Button
        └── Main Menu Button
```

## Data Flow

### Unidirectional Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Interaction                      │
│         (Keyboard, Mouse, Touch, Click)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Event Handlers                         │
│  handleKeyDown, handleMouseMove, handleCanvasClick, etc.│
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   useGame Hook                           │
│         (State Updates, Game Logic)                     │
│  • updatePaddlePosition()                               │
│  • launchBall()                                         │
│  • pauseGame()                                          │
│  • startNextLevel()                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  React State Update                      │
│         (Triggers Re-render)                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Component Re-render                       │
│         (UI Updates)                                    │
│  • GameCanvas draws new frame                           │
│  • TopBar displays updated score/lives                  │
│  • Menus show/hide based on state                       │
└─────────────────────────────────────────────────────────┘
```

### Game Loop Data Flow

```
┌──────────────────┐
│  Game State:     │
│  PLAYING         │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│         requestAnimationFrame Loop                │
│                 (60 FPS)                         │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│              Game Loop Execution                  │
│                                                  │
│  1. Update Paddle Position                       │
│     ├─ Keyboard input                            │
│     └─ Mouse/Touch position                      │
│                                                  │
│  2. Update Ball Positions                        │
│     ├─ Apply velocity (dx, dy)                   │
│     ├─ Check wall collisions                     │
│     └─ Check paddle collision                    │
│                                                  │
│  3. Check Brick Collisions                       │
│     ├─ Detect ball-brick overlap                 │
│     ├─ Update brick status                       │
│     ├─ Spawn power-ups                           │
│     └─ Update score                              │
│                                                  │
│  4. Update Power-Ups                             │
│     ├─ Move power-ups down                       │
│     ├─ Check paddle collision                    │
│     └─ Activate collected power-ups              │
│                                                  │
│  5. Check Game Conditions                        │
│     ├─ All bricks cleared? → Level Complete      │
│     ├─ No balls left? → Lose life                │
│     └─ No lives left? → Game Over                │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│           Update React State                      │
│     (setBalls, setBricks, setScore, etc.)        │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│         Component Re-render                       │
│     (Canvas redraws all elements)                │
└──────────────────────────────────────────────────┘
```

## State Management

### Game State Structure

```javascript
// Game State (useState in useGame hook)
{
  gameState: 'startMenu' | 'playing' | 'paused' | 'gameOver' | 'levelComplete',
  score: number,
  lives: number,
  currentLevel: number,
  highScore: number,
  isLoading: boolean,
  
  // Paddle State
  paddle: {
    x: number,
    y: number,
    width: number,
    height: number,
    dx: number
  },
  
  // Balls State
  balls: [{
    x: number,
    y: number,
    radius: number,
    speed: number,
    dx: number,
    dy: number,
    color: string
  }],
  
  // Bricks State
  bricks: [{
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    status: 0 | 1,  // 0 = destroyed, 1 = active
    powerUp: string | null,
    isSteel: boolean
  }],
  
  // Power-Ups State
  activePowerUps: [{
    x: number,
    y: number,
    size: number,
    type: 'multiball' | 'stretchPaddle',
    color: string,
    dy: number
  }],
  
  // Animation State
  ballLaunched: boolean,
  brickDropProgress: number,
  levelTransitioning: boolean
}
```

### State Update Patterns

```
┌─────────────────────────────────────────────────┐
│         Direct State Updates                     │
│  (Immediate, user-triggered)                    │
│                                                 │
│  • setGameState()      - Menu transitions       │
│  • setScore()          - Score changes          │
│  • setLives()          - Life loss              │
│  • setCurrentLevel()   - Level progression      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       Computed State Updates                     │
│  (Game loop, frame-by-frame)                    │
│                                                 │
│  • setPaddle()         - Position updates       │
│  • setBalls()          - Ball movements         │
│  • setBricks()         - Collision results      │
│  • setActivePowerUps() - Power-up movements     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       Animated State Updates                     │
│  (requestAnimationFrame-based)                  │
│                                                 │
│  • setBrickDropProgress() - Drop animation      │
│  • Paddle stretch animation                     │
│  • Menu fade transitions                        │
└─────────────────────────────────────────────────┘
```

## Game Loop Architecture

### Loop Lifecycle

```
┌──────────────────────────────────────────────────────┐
│              Component Mount (useEffect)              │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│         Check: gameState === 'playing' &&             │
│              !levelTransitioning                     │
└────────────────────┬─────────────────────────────────┘
                     │ YES
                     ▼
┌──────────────────────────────────────────────────────┐
│           Start Animation Loop                        │
│     animationFrameRef = requestAnimationFrame(loop)  │
└────────────────────┬─────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   gameLoop()    │    │  Canvas draw()  │
│  (State logic)  │    │  (Rendering)    │
└────────┬────────┘    └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│       Request Next Frame (60 FPS target)              │
│     requestAnimationFrame(loop)                      │
└────────────────────┬─────────────────────────────────┘
                     │
                     │ (Loop continues until state changes)
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│        Component Unmount or State Change              │
│     cancelAnimationFrame(animationFrameRef)          │
└──────────────────────────────────────────────────────┘
```

### Separation of Concerns

```
┌─────────────────────────────────────────────────────┐
│              useGame.js (Game Logic)                 │
│  • State management                                 │
│  • Game rules and physics                           │
│  • Collision detection                              │
│  • Score calculation                                │
│  • Power-up activation                              │
│  • NO rendering logic                               │
└─────────────────────────────────────────────────────┘
                        │
                        │ Props
                        ▼
┌─────────────────────────────────────────────────────┐
│          GameCanvas.jsx (Rendering)                  │
│  • Canvas drawing operations                        │
│  • Visual representation                            │
│  • Animation rendering                              │
│  • NO game logic                                    │
└─────────────────────────────────────────────────────┘
```

## Module Responsibilities

### src/hooks/useGame.js

**Responsibility:** Core game logic and state management

```
┌──────────────────────────────────────────────┐
│             useGame Hook                      │
│                                              │
│  State Management:                           │
│  • Game state (menu, playing, paused, etc.) │
│  • Score and lives tracking                  │
│  • Paddle, balls, bricks state              │
│  • Power-ups management                      │
│                                              │
│  Game Logic:                                 │
│  • Collision detection algorithms           │
│  • Physics calculations                      │
│  • Power-up activation logic                │
│  • Level progression                         │
│                                              │
│  Event Handling:                             │
│  • Keyboard input processing                 │
│  • Mouse/touch input processing              │
│  • Game loop execution                       │
│                                              │
│  Returns:                                    │
│  • Game state values                         │
│  • Event handlers                            │
│  • Action functions                          │
└──────────────────────────────────────────────┘
```

### src/components/Game/GameCanvas.jsx

**Responsibility:** Visual rendering of game elements

```
┌──────────────────────────────────────────────┐
│           GameCanvas Component                │
│                                              │
│  Rendering:                                  │
│  • Draw paddle                               │
│  • Draw balls                                │
│  • Draw bricks with patterns                 │
│  • Draw power-ups                            │
│  • Draw UI elements on canvas               │
│                                              │
│  Canvas Management:                          │
│  • Resize handling                           │
│  • Aspect ratio maintenance                  │
│  • Animation frame coordination              │
│                                              │
│  Input Capture:                              │
│  • Mouse move events                         │
│  • Touch move events                         │
│  • Click/tap events                          │
└──────────────────────────────────────────────┘
```

### src/utils/constants.js

**Responsibility:** Configuration and game constants

```
┌──────────────────────────────────────────────┐
│            Constants Module                   │
│                                              │
│  • Canvas dimensions                         │
│  • Paddle specifications                     │
│  • Ball properties                           │
│  • Brick layout configuration                │
│  • Power-up definitions                      │
│  • Game state enumerations                   │
│  • Level patterns                            │
│  • Color schemes                             │
└──────────────────────────────────────────────┘
```

### src/utils/helpers.js

**Responsibility:** Utility functions

```
┌──────────────────────────────────────────────┐
│            Helpers Module                     │
│                                              │
│  • Collision detection helpers              │
│  • Math utilities (random, clamp, etc.)     │
│  • LocalStorage operations                   │
│  • Device detection                          │
│  • Score formatting                          │
│  • Animation easing functions                │
└──────────────────────────────────────────────┘
```

## Design Patterns

### 1. Custom Hook Pattern

```javascript
// Encapsulate complex logic in reusable hook
const {
  gameState,
  score,
  // ... other state
  startGame,
  pauseGame,
  // ... other actions
} = useGame();
```

**Benefits:**
- Separation of concerns
- Reusable game logic
- Cleaner component code
- Easier testing

### 2. Compound Component Pattern

```javascript
<MenuOverlay show={condition}>
  <SpecificMenu {...props} />
</MenuOverlay>
```

**Benefits:**
- Flexible composition
- Shared overlay behavior
- Consistent animations

### 3. Container/Presenter Pattern

```javascript
// Container: App.jsx (logic & state)
// Presenter: MenuComponents (UI only)
<StartMenu onStart={startGame} />
```

**Benefits:**
- Clear separation
- Reusable UI components
- Easy to style independently

### 4. Render Props Pattern (Implicit)

```javascript
// GameCanvas receives data, App manages it
<GameCanvas
  paddle={paddle}
  balls={balls}
  bricks={bricks}
  onMouseMove={handleMouseMove}
/>
```

### 5. Controlled Component Pattern

```javascript
// All game state controlled by parent (App/useGame)
// Components receive props and call callbacks
```

## Communication Patterns

### Parent-to-Child Communication

```
App.jsx
  │
  ├─ props ──▶ GameCanvas
  │            (paddle, balls, bricks)
  │
  ├─ props ──▶ TopBar
  │            (score, lives, level)
  │
  └─ props ──▶ Menu Components
               (onStart, onResume, score)
```

### Child-to-Parent Communication

```
GameCanvas
  │
  ├─ onMouseMove ──▶ App.jsx
  ├─ onTouchMove ──▶ useGame Hook
  └─ onClick ────▶ (Updates state)

Menu Components
  │
  ├─ onStart ────▶ App.jsx
  ├─ onResume ───▶ useGame Hook
  └─ onRestart ──▶ (Calls actions)
```

### Event Flow Example

```
User presses Spacebar
       │
       ▼
handleKeyDown()
       │
       ▼
launchBall()
       │
       ▼
setBalls() updates state
       │
       ▼
React re-renders
       │
       ▼
GameCanvas draws new ball position
```

## Performance Optimizations

### 1. useCallback for Event Handlers

```javascript
const handleMouseMove = useCallback((e, rect) => {
  // Memoized to prevent unnecessary re-renders
}, [dependencies]);
```

### 2. useRef for Non-Reactive Values

```javascript
const keysRef = useRef({});  // Doesn't trigger re-render
const animationFrameRef = useRef(null);
```

### 3. Efficient State Updates

```javascript
// Batch updates together
setBalls(newBalls);
setBricks(newBricks);
setScore(newScore);
// React batches these automatically
```

### 4. Canvas Optimization

```javascript
// Only redraw when state changes
useEffect(() => {
  draw(ctx);
}, [paddle, balls, bricks, powerUps]);
```

## Error Boundaries (Future Enhancement)

```
App.jsx
  │
  └─ <ErrorBoundary>
       │
       ├─ GameCanvas
       ├─ TopBar
       └─ Menus
```

## Conclusion

The Brick Rush architecture follows React best practices with:
- **Clear separation of concerns** between logic and presentation
- **Unidirectional data flow** for predictable state management
- **Modular components** for maintainability
- **Custom hooks** for reusable logic
- **Performance optimizations** for smooth gameplay

This architecture makes it easy to:
- Add new features
- Test individual components
- Maintain and debug code
- Scale the application

---

**Last Updated:** January 2024
**Version:** 1.0.0