import { useEffect, useRef } from 'react';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BALL_COLOR,
  PADDLE_COLOR,
  POWERUP_TYPES
} from '../../utils/constants.js';

const GameCanvas = ({
  paddle,
  balls,
  bricks,
  activePowerUps,
  brickDropProgress,
  score,
  lives,
  currentLevel,
  onMouseMove,
  onTouchMove,
  onClick
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Resize canvas to maintain aspect ratio
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const windowWidth = rect.width;
      const windowHeight = rect.height;

      const targetAspectRatio = GAME_WIDTH / GAME_HEIGHT;
      const windowAspectRatio = windowWidth / windowHeight;

      let newCanvasWidth, newCanvasHeight;

      if (windowAspectRatio > targetAspectRatio) {
        newCanvasHeight = windowHeight;
        newCanvasWidth = newCanvasHeight * targetAspectRatio;
      } else {
        newCanvasWidth = windowWidth;
        newCanvasHeight = newCanvasWidth / targetAspectRatio;
      }

      canvas.width = GAME_WIDTH;
      canvas.height = GAME_HEIGHT;
      canvas.style.width = `${newCanvasWidth}px`;
      canvas.style.height = `${newCanvasHeight}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Draw paddle
  const drawPaddle = (ctx) => {
    ctx.fillStyle = PADDLE_COLOR;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  };

  // Draw balls
  const drawBalls = (ctx) => {
    balls.forEach(ball => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color || BALL_COLOR;
      ctx.fill();
      ctx.closePath();
    });
  };

  // Draw bricks
  const drawBricks = (ctx) => {
    bricks.forEach(brick => {
      if (brick.status === 0) return;

      let dropY = brick.y;
      if (brickDropProgress < 1) {
        const targetY = brick.y;
        const startY = -brick.height;
        dropY = startY + (targetY - startY) * brickDropProgress;
      }

      // Draw brick shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(brick.x + 2, dropY + 2, brick.width, brick.height);

      // Draw brick
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, dropY, brick.width, brick.height);

      // Draw brick border/highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(brick.x + 1, dropY + 1, brick.width - 2, brick.height - 2);

      // Draw steel brick pattern
      if (brick.isSteel) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < brick.width; i += 8) {
          for (let j = 0; j < brick.height; j += 8) {
            if ((i + j) % 16 === 0) {
              ctx.fillRect(brick.x + i, dropY + j, 4, 4);
            }
          }
        }
      }

      // Draw power-up indicator
      if (brick.powerUp && !brick.isSteel) {
        const size = 8;
        const x = brick.x + brick.width / 2 - size / 2;
        const y = dropY + brick.height / 2 - size / 2;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    });
  };

  // Draw power-ups
  const drawPowerUps = (ctx) => {
    activePowerUps.forEach(pu => {
      ctx.fillStyle = pu.color;
      ctx.fillRect(pu.x, pu.y, pu.size, pu.size);

      // Draw power-up letter
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const letter = pu.type === POWERUP_TYPES.MULTIBALL ? 'M' : 'S';
      ctx.fillText(letter, pu.x + pu.size / 2, pu.y + pu.size / 2);
    });
  };

  // Draw UI (score, level, lives)
  const drawUI = (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';

    // Score
    ctx.fillText(`Score: ${score.toString().padStart(6, '0')}`, 20, 30);

    // Level
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${currentLevel}`, GAME_WIDTH / 2, 30);

    // Lives
    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${lives}`, GAME_WIDTH - 20, 30);
  };

  // Main draw function
  const draw = (ctx) => {
    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw game elements
    drawBricks(ctx);
    drawPaddle(ctx);
    drawBalls(ctx);
    drawPowerUps(ctx);
    drawUI(ctx);
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const animate = () => {
      draw(ctx);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [paddle, balls, bricks, activePowerUps, brickDropProgress, score, lives, currentLevel]);

  // Event handlers
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    onMouseMove(e, rect);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    onTouchMove(e, rect);
  };

  const handleClick = (e) => {
    onClick(e);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a'
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
        style={{
          display: 'block',
          cursor: 'none',
          touchAction: 'none'
        }}
      />
    </div>
  );
};

export default GameCanvas;
