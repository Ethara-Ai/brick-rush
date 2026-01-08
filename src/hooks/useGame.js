import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PADDLE_BASE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_MARGIN_BOTTOM,
  PADDLE_STRETCH_WIDTH,
  PADDLE_STRETCH_DURATION,
  BALL_RADIUS,
  BALL_INITIAL_SPEED,
  BALL_COLOR,
  BRICK_ROW_COUNT,
  BRICK_COLUMN_COUNT,
  BRICK_PADDING,
  BRICK_OFFSET_TOP,
  BRICK_OFFSET_LEFT,
  BRICK_BASE_WIDTH,
  BRICK_HEIGHT,
  BRICK_COLORS,
  STEEL_BRICK_COLOR,
  BRICK_PATTERNS,
  STEEL_BRICK_PATTERNS,
  POWERUP_SIZE,
  POWERUP_SPEED,
  POWERUP_TYPES,
  POWERUP_COLORS,
  GAME_STATES
} from '../utils/constants.js';
import {
  random,
  loadHighScore,
  updateHighScore as updateHighScoreHelper,
  checkBallBrickCollision,
  checkBallPaddleCollision,
  checkPowerUpPaddleCollision,
  calculateBounceAngle,
  easeInOutCubic
} from '../utils/helpers.js';

export const useGame = () => {
  // Game state
  const [gameState, setGameState] = useState(GAME_STATES.START_MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => loadHighScore());
  const [isLoading, setIsLoading] = useState(false);

  // Paddle state
  const [paddle, setPaddle] = useState({
    x: GAME_WIDTH / 2 - PADDLE_BASE_WIDTH / 2,
    y: GAME_HEIGHT - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_BASE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 0
  });

  // Ball state
  const [balls, setBalls] = useState([]);
  const [ballLaunched, setBallLaunched] = useState(false);

  // Bricks state
  const [bricks, setBricks] = useState([]);

  // PowerUps state
  const [activePowerUps, setActivePowerUps] = useState([]);

  // Animation state
  const [brickDropProgress, setBrickDropProgress] = useState(1);
  const [levelTransitioning, setLevelTransitioning] = useState(false);

  // Refs for game loop and input
  const animationFrameRef = useRef(null);
  const keysRef = useRef({});
  const mouseXRef = useRef(GAME_WIDTH / 2);
  const paddleStretchTimeoutRef = useRef(null);
  const paddleSpeedRef = useRef(6);

  // Initialize or reset game
  const initGameVariables = useCallback(() => {
    setScore(0);
    setLives(3);
    setCurrentLevel(1);
    setBallLaunched(false);
    setActivePowerUps([]);
    setBrickDropProgress(1);
    setLevelTransitioning(false);
  }, []);

  // Create bricks for current level
  const createBricks = useCallback((level) => {
    const newBricks = [];
    const patternIndex = Math.min(level - 1, BRICK_PATTERNS.length - 1);
    const selectedPattern = BRICK_PATTERNS[patternIndex];
    const steelPatternIndex = Math.min(level - 1, STEEL_BRICK_PATTERNS.length - 1);
    const steelPattern = STEEL_BRICK_PATTERNS[steelPatternIndex];

    for (let row = 0; row < BRICK_ROW_COUNT; row++) {
      for (let col = 0; col < BRICK_COLUMN_COUNT; col++) {
        if (selectedPattern[row][col] === 1) {
          const brickX = BRICK_OFFSET_LEFT + col * (BRICK_BASE_WIDTH + BRICK_PADDING);
          const brickY = BRICK_OFFSET_TOP + row * (BRICK_HEIGHT + BRICK_PADDING);

          const isSteel = steelPattern[row] && steelPattern[row][col] === 1;

          let powerUpType = null;
          if (!isSteel && Math.random() < 0.1) {
            powerUpType = Math.random() < 0.5 ? POWERUP_TYPES.MULTIBALL : POWERUP_TYPES.STRETCH_PADDLE;
          }

          newBricks.push({
            x: brickX,
            y: brickY,
            width: BRICK_BASE_WIDTH,
            height: BRICK_HEIGHT,
            color: isSteel ? STEEL_BRICK_COLOR : BRICK_COLORS[row % BRICK_COLORS.length],
            status: 1,
            powerUp: powerUpType,
            isSteel
          });
        }
      }
    }

    setBricks(newBricks);
  }, []);

  // Reset paddle and ball
  const resetPaddleAndBall = useCallback(() => {
    setPaddle({
      x: GAME_WIDTH / 2 - PADDLE_BASE_WIDTH / 2,
      y: GAME_HEIGHT - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
      width: PADDLE_BASE_WIDTH,
      height: PADDLE_HEIGHT,
      dx: 0
    });

    setBalls([{
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT - BALL_RADIUS,
      radius: BALL_RADIUS,
      speed: BALL_INITIAL_SPEED,
      dx: 0,
      dy: -BALL_INITIAL_SPEED,
      color: BALL_COLOR
    }]);

    setBallLaunched(false);
  }, []);

  // Launch ball
  const launchBall = useCallback(() => {
    if (!ballLaunched) {
      setBalls(prevBalls => {
        const newBalls = [...prevBalls];
        if (newBalls.length > 0) {
          const launchAngle = random(-Math.PI / 4, Math.PI / 4);
          newBalls[0].dx = BALL_INITIAL_SPEED * Math.sin(launchAngle);
          newBalls[0].dy = -BALL_INITIAL_SPEED * Math.cos(launchAngle);
        }
        return newBalls;
      });
      setBallLaunched(true);
    }
  }, [ballLaunched]);

  // Start game
  const startGame = useCallback(() => {
    initGameVariables();
    createBricks(1);
    resetPaddleAndBall();
    setGameState(GAME_STATES.PLAYING);
  }, [initGameVariables, createBricks, resetPaddleAndBall]);

  // Start next level
  const startNextLevel = useCallback(() => {
    const nextLevel = currentLevel + 1;
    setCurrentLevel(nextLevel);
    setLevelTransitioning(true);

    setTimeout(() => {
      createBricks(nextLevel);
      resetPaddleAndBall();
      setBrickDropProgress(0);

      const duration = 800;
      const startTime = Date.now();

      const animateDrop = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setBrickDropProgress(easeInOutCubic(progress));

        if (progress < 1) {
          requestAnimationFrame(animateDrop);
        } else {
          setLevelTransitioning(false);
          setGameState(GAME_STATES.PLAYING);
        }
      };

      requestAnimationFrame(animateDrop);
    }, 500);
  }, [currentLevel, createBricks, resetPaddleAndBall]);

  // Spawn power-up
  const spawnPowerUp = useCallback((x, y, type) => {
    setActivePowerUps(prev => [...prev, {
      x,
      y,
      size: POWERUP_SIZE,
      type,
      color: POWERUP_COLORS[type],
      dy: POWERUP_SPEED
    }]);
  }, []);

  // Activate power-up
  const activatePowerUp = useCallback((type, currentBalls, currentPaddle) => {
    if (type === POWERUP_TYPES.MULTIBALL) {
      const originalBall = currentBalls[0];
      if (!originalBall) return;

      const newBalls = [];
      for (let i = 0; i < 2; i++) {
        const angle = random(-Math.PI / 3, Math.PI / 3);
        newBalls.push({
          x: originalBall.x,
          y: originalBall.y,
          radius: BALL_RADIUS,
          speed: BALL_INITIAL_SPEED,
          dx: BALL_INITIAL_SPEED * Math.sin(angle),
          dy: -BALL_INITIAL_SPEED * Math.abs(Math.cos(angle)),
          color: BALL_COLOR
        });
      }

      setBalls(prev => [...prev, ...newBalls]);
    } else if (type === POWERUP_TYPES.STRETCH_PADDLE) {
      if (paddleStretchTimeoutRef.current) {
        clearTimeout(paddleStretchTimeoutRef.current);
      }

      const startWidth = currentPaddle.width;
      const endWidth = PADDLE_STRETCH_WIDTH;
      const startTime = Date.now();
      const duration = 300;

      const animateStretch = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        const newWidth = startWidth + (endWidth - startWidth) * easeProgress;

        setPaddle(prev => ({
          ...prev,
          width: newWidth,
          x: prev.x - (newWidth - prev.width) / 2
        }));

        if (progress < 1) {
          requestAnimationFrame(animateStretch);
        }
      };

      requestAnimationFrame(animateStretch);

      paddleStretchTimeoutRef.current = setTimeout(() => {
        const shrinkStartTime = Date.now();
        const shrinkDuration = 300;

        const animateShrink = () => {
          const elapsed = Date.now() - shrinkStartTime;
          const progress = Math.min(elapsed / shrinkDuration, 1);
          const easeProgress = easeInOutCubic(progress);
          const newWidth = PADDLE_STRETCH_WIDTH - (PADDLE_STRETCH_WIDTH - PADDLE_BASE_WIDTH) * easeProgress;

          setPaddle(prev => ({
            ...prev,
            width: newWidth,
            x: prev.x + (prev.width - newWidth) / 2
          }));

          if (progress < 1) {
            requestAnimationFrame(animateShrink);
          }
        };

        requestAnimationFrame(animateShrink);
      }, PADDLE_STRETCH_DURATION);
    }
  }, []);

  // Update paddle position based on mouse/touch
  const updatePaddlePosition = useCallback((targetX) => {
    setPaddle(prev => {
      const newX = Math.max(0, Math.min(targetX - prev.width / 2, GAME_WIDTH - prev.width));
      return { ...prev, x: newX };
    });
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING || levelTransitioning) {
      return;
    }

    // Update paddle with keyboard
    setPaddle(prev => {
      let newX = prev.x;
      if (keysRef.current.ArrowLeft || keysRef.current.KeyA) {
        newX = Math.max(0, prev.x - paddleSpeedRef.current);
      }
      if (keysRef.current.ArrowRight || keysRef.current.KeyD) {
        newX = Math.min(GAME_WIDTH - prev.width, prev.x + paddleSpeedRef.current);
      }
      return { ...prev, x: newX };
    });

    // Update balls
    setBalls(prevBalls => {
      let newBalls = prevBalls.map(ball => {
        let newBall = { ...ball };

        if (!ballLaunched) {
          // Ball follows paddle before launch
          newBall.x = paddle.x + paddle.width / 2;
          return newBall;
        }

        // Move ball
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;

        // Wall collisions
        if (newBall.x + newBall.radius > GAME_WIDTH || newBall.x - newBall.radius < 0) {
          newBall.dx = -newBall.dx;
          newBall.x = Math.max(newBall.radius, Math.min(GAME_WIDTH - newBall.radius, newBall.x));
        }

        if (newBall.y - newBall.radius < 0) {
          newBall.dy = -newBall.dy;
          newBall.y = newBall.radius;
        }

        // Paddle collision
        if (checkBallPaddleCollision(newBall, paddle)) {
          const angle = calculateBounceAngle(newBall, paddle);
          newBall.dx = newBall.speed * Math.sin(angle);
          newBall.dy = -newBall.speed * Math.abs(Math.cos(angle));
          newBall.y = paddle.y - newBall.radius;
        }

        return newBall;
      });

      // Remove balls that fell off screen
      newBalls = newBalls.filter(ball => ball.y - ball.radius < GAME_HEIGHT);

      // Check if all balls are lost
      if (newBalls.length === 0 && ballLaunched) {
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives > 0) {
          resetPaddleAndBall();
        } else {
          const newHighScore = updateHighScoreHelper(score, highScore);
          setHighScore(newHighScore);
          setGameState(GAME_STATES.GAME_OVER);
        }
      }

      return newBalls;
    });

    // Ball-brick collisions
    setBricks(prevBricks => {
      const newBricks = [...prevBricks];
      let scoreIncrease = 0;
      let allBricksCleared = true;

      balls.forEach(ball => {
        newBricks.forEach(brick => {
          if (brick.status === 1 && checkBallBrickCollision(ball, brick)) {
            if (!brick.isSteel) {
              brick.status = 0;
              scoreIncrease += 10;

              if (brick.powerUp) {
                spawnPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.powerUp);
              }
            }

            // Calculate collision side
            const ballCenterX = ball.x;
            const ballCenterY = ball.y;
            const brickCenterX = brick.x + brick.width / 2;
            const brickCenterY = brick.y + brick.height / 2;

            const overlapX = Math.abs(ballCenterX - brickCenterX) - brick.width / 2;
            const overlapY = Math.abs(ballCenterY - brickCenterY) - brick.height / 2;

            if (overlapX > overlapY) {
              ball.dy = -ball.dy;
            } else {
              ball.dx = -ball.dx;
            }
          }

          if (brick.status === 1) {
            allBricksCleared = false;
          }
        });
      });

      if (scoreIncrease > 0) {
        setScore(prev => prev + scoreIncrease);
      }

      if (allBricksCleared && balls.length > 0) {
        setGameState(GAME_STATES.LEVEL_COMPLETE);
      }

      return newBricks;
    });

    // Update power-ups
    setActivePowerUps(prevPowerUps => {
      return prevPowerUps.filter(pu => {
        pu.y += pu.dy;

        if (checkPowerUpPaddleCollision(pu, paddle)) {
          activatePowerUp(pu.type, balls, paddle);
          return false;
        }

        return pu.y < GAME_HEIGHT;
      });
    });
  }, [gameState, levelTransitioning, ballLaunched, paddle, balls, lives, score, highScore, spawnPowerUp, activatePowerUp, resetPaddleAndBall]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING && !levelTransitioning) {
      const loop = () => {
        gameLoop();
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, levelTransitioning, gameLoop]);

  // Keyboard input handlers
  const handleKeyDown = useCallback((e) => {
    keysRef.current[e.code] = true;

    if (e.code === 'Space' && gameState === GAME_STATES.PLAYING && !ballLaunched) {
      e.preventDefault();
      launchBall();
    }

    if (e.code === 'Escape' && gameState === GAME_STATES.PLAYING) {
      e.preventDefault();
      setGameState(GAME_STATES.PAUSED);
    }
  }, [gameState, ballLaunched, launchBall]);

  const handleKeyUp = useCallback((e) => {
    keysRef.current[e.code] = false;
  }, []);

  // Mouse/touch handlers
  const handleMouseMove = useCallback((e, canvasRect) => {
    if (gameState === GAME_STATES.PLAYING) {
      const scaleX = GAME_WIDTH / canvasRect.width;
      const mouseX = (e.clientX - canvasRect.left) * scaleX;
      updatePaddlePosition(mouseX);
    }
  }, [gameState, updatePaddlePosition]);

  const handleTouchMove = useCallback((e, canvasRect) => {
    if (gameState === GAME_STATES.PLAYING && e.touches.length > 0) {
      const scaleX = GAME_WIDTH / canvasRect.width;
      const touchX = (e.touches[0].clientX - canvasRect.left) * scaleX;
      updatePaddlePosition(touchX);
    }
  }, [gameState, updatePaddlePosition]);

  const handleCanvasClick = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING && !ballLaunched) {
      launchBall();
    }
  }, [gameState, ballLaunched, launchBall]);

  // Pause/Resume
  const pauseGame = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING) {
      setGameState(GAME_STATES.PAUSED);
    }
  }, [gameState]);

  const resumeGame = useCallback(() => {
    if (gameState === GAME_STATES.PAUSED) {
      setGameState(GAME_STATES.PLAYING);
    }
  }, [gameState]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const returnToMenu = useCallback(() => {
    initGameVariables();
    resetPaddleAndBall();
    setGameState(GAME_STATES.START_MENU);
  }, [initGameVariables, resetPaddleAndBall]);

  return {
    // State
    gameState,
    score,
    lives,
    currentLevel,
    highScore,
    paddle,
    balls,
    bricks,
    activePowerUps,
    ballLaunched,
    brickDropProgress,
    levelTransitioning,
    isLoading,

    // Actions
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    returnToMenu,
    startNextLevel,
    launchBall,

    // Event handlers
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleTouchMove,
    handleCanvasClick
  };
};
