# Contributing to Brick Rush

First off, thank you for considering contributing to Brick Rush! 🎮✨

The following is a set of guidelines for contributing to Brick Rush. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How Can I Contribute?](#how-can-i-contribute)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this standard. Please report unacceptable behavior by opening an issue.

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/brick-rush.git
   cd brick-rush
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/brick-rush.git
   ```

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Run linter:**
   ```bash
   npm run lint
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**

- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/device information
- Console errors (if any)

**Example:**
```markdown
**Bug:** Ball passes through paddle on fast movement

**Steps to Reproduce:**
1. Start new game
2. Move paddle rapidly left and right
3. Launch ball
4. Ball occasionally passes through paddle

**Expected:** Ball should always bounce off paddle
**Actual:** Ball passes through paddle ~5% of the time

**Environment:**
- Browser: Chrome 120.0
- OS: macOS 14.0
- Device: MacBook Pro
```

### Suggesting Features

Feature requests are welcome! Before submitting:

1. Check if the feature already exists
2. Check if it's already requested in issues
3. Provide clear use case and benefits

**Template:**
```markdown
**Feature:** Add power-up preview indicator

**Problem:** Players don't know what power-up does until they collect it

**Solution:** Show small icon/tooltip when power-up is on screen

**Benefits:**
- Better user experience
- Strategic gameplay decisions
- Reduces confusion for new players
```

### Code Contributions

1. **Pick an issue** or create one
2. **Comment** on the issue to let others know you're working on it
3. **Create a branch** from `main`
4. **Make your changes**
5. **Test thoroughly**
6. **Submit a pull request**

## Style Guidelines

### JavaScript/React

**Follow existing code style:**

```javascript
// ✅ Good
const calculateScore = (bricksDestroyed, multiplier) => {
  return bricksDestroyed * 10 * multiplier;
};

// ❌ Bad
function calculate_score(bricks,mult){
  return bricks*10*mult
}
```

**Key conventions:**

- Use `const` for immutable values, `let` for mutable
- Use arrow functions for callbacks and functional components
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use destructuring where appropriate

**Component structure:**

```javascript
// ✅ Good component structure
import { useState, useEffect } from 'react';
import './MyComponent.css';

const MyComponent = ({ prop1, prop2, onAction }) => {
  // 1. State declarations
  const [state, setState] = useState(initialValue);

  // 2. Side effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 4. Render
  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### CSS

**Naming conventions:**

```css
/* Use kebab-case for class names */
.game-container { }
.menu-button { }
.high-score-display { }

/* Use BEM for complex components */
.menu__item { }
.menu__item--active { }

/* Organize properties logically */
.example {
  /* Positioning */
  position: relative;
  top: 0;
  
  /* Box model */
  display: flex;
  width: 100%;
  padding: 10px;
  
  /* Typography */
  font-size: 16px;
  color: #fff;
  
  /* Visual */
  background: #000;
  
  /* Animation */
  transition: all 0.3s ease;
}
```

### File Organization

```
src/
├── components/          # React components
│   ├── Game/           # Game-specific components
│   ├── Menus/          # Menu components
│   ├── UI/             # Reusable UI components
│   └── Loading/        # Loading components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and constants
└── styles/             # Global styles
```

## Commit Guidelines

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

**Examples:**

```bash
# Good commits
git commit -m "feat(game): add laser paddle power-up"
git commit -m "fix(collision): resolve ball-paddle penetration bug"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(menu): improve button hover animations"
git commit -m "refactor(hooks): extract collision logic to separate hook"

# Bad commits
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "changes to game"
```

### Commit Best Practices

- Write clear, concise commit messages
- Commit logical units of work
- Don't commit commented-out code
- Don't commit TODO comments
- Test before committing

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Code has been tested thoroughly
- [ ] No console errors or warnings
- [ ] All new code has comments where needed
- [ ] README updated if needed
- [ ] No merge conflicts with main branch

### PR Title Format

Use the same format as commit messages:

```
feat(component): add new feature
fix(game): resolve collision bug
docs: update contributing guide
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
1. Step one
2. Step two
3. Expected result

## Screenshots (if applicable)
Add screenshots or GIFs

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] No new warnings
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
```

### Review Process

1. **Automated checks** must pass (linting, build)
2. **Code review** by at least one maintainer
3. **Testing** on different browsers/devices
4. **Approval** from maintainer
5. **Merge** by maintainer

### After PR is Merged

1. Delete your feature branch
2. Pull latest changes from main
3. Update your fork

```bash
git checkout main
git pull upstream main
git push origin main
```

## Project Structure

### Key Files

- `src/App.jsx` - Main application component
- `src/hooks/useGame.js` - Core game logic
- `src/utils/constants.js` - Game configuration
- `src/utils/helpers.js` - Utility functions
- `src/components/` - React components

### Adding New Features

**Example: Adding a new power-up**

1. **Add constant** in `src/utils/constants.js`:
   ```javascript
   export const POWERUP_TYPES = {
     // existing...
     LASER: 'laser'
   };
   ```

2. **Add color**:
   ```javascript
   export const POWERUP_COLORS = {
     // existing...
     [POWERUP_TYPES.LASER]: '#ff0000'
   };
   ```

3. **Implement logic** in `src/hooks/useGame.js`:
   ```javascript
   const activatePowerUp = (type) => {
     if (type === POWERUP_TYPES.LASER) {
       // Implementation
     }
   };
   ```

4. **Test thoroughly**
5. **Update documentation**
6. **Submit PR**

## Testing Guidelines

### Manual Testing Checklist

- [ ] Start new game works
- [ ] Paddle movement (keyboard/mouse/touch)
- [ ] Ball launches correctly
- [ ] Collisions work (paddle, walls, bricks)
- [ ] Power-ups spawn and activate
- [ ] Score updates correctly
- [ ] Lives decrease on ball loss
- [ ] Level progression works
- [ ] Game over displays correctly
- [ ] High score saves and loads
- [ ] Pause/resume functionality
- [ ] Responsive on mobile
- [ ] Works in multiple browsers

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Questions?

- **General questions:** Open a discussion
- **Bug reports:** Open an issue
- **Feature requests:** Open an issue with `[Feature Request]` tag
- **Security issues:** Email maintainers directly

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Brick Rush! 🎮✨

---

**Happy Coding!** If you have questions, don't hesitate to ask. We're here to help!