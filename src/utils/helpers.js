import { HIGH_SCORE_KEY } from './constants.js';

/**
 * Generate a random number between min and max (inclusive)
 */
export const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Load high score from localStorage
 */
export const loadHighScore = () => {
  const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
  return savedHighScore ? parseInt(savedHighScore, 10) : 0;
};

/**
 * Save high score to localStorage
 */
export const saveHighScore = (score) => {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.error('Failed to save high score:', error);
  }
};

/**
 * Update high score if current score is higher
 */
export const updateHighScore = (currentScore, currentHighScore) => {
  if (currentScore > currentHighScore) {
    saveHighScore(currentScore);
    return currentScore;
  }
  return currentHighScore;
};

/**
 * Check if device is mobile
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if device is desktop
 */
export const isDesktopDevice = () => {
  return !isMobileDevice();
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Check collision between ball and brick
 */
export const checkBallBrickCollision = (ball, brick) => {
  if (brick.status === 0) return false;

  const ballLeft = ball.x - ball.radius;
  const ballRight = ball.x + ball.radius;
  const ballTop = ball.y - ball.radius;
  const ballBottom = ball.y + ball.radius;

  const brickLeft = brick.x;
  const brickRight = brick.x + brick.width;
  const brickTop = brick.y;
  const brickBottom = brick.y + brick.height;

  return (
    ballRight > brickLeft &&
    ballLeft < brickRight &&
    ballBottom > brickTop &&
    ballTop < brickBottom
  );
};

/**
 * Check collision between ball and paddle
 */
export const checkBallPaddleCollision = (ball, paddle) => {
  const ballBottom = ball.y + ball.radius;
  const ballTop = ball.y - ball.radius;
  const ballLeft = ball.x - ball.radius;
  const ballRight = ball.x + ball.radius;

  const paddleTop = paddle.y;
  const paddleBottom = paddle.y + paddle.height;
  const paddleLeft = paddle.x;
  const paddleRight = paddle.x + paddle.width;

  return (
    ballBottom >= paddleTop &&
    ballTop < paddleBottom &&
    ballRight > paddleLeft &&
    ballLeft < paddleRight &&
    ball.dy > 0
  );
};

/**
 * Check collision between powerup and paddle
 */
export const checkPowerUpPaddleCollision = (powerUp, paddle) => {
  return (
    powerUp.x + powerUp.size > paddle.x &&
    powerUp.x < paddle.x + paddle.width &&
    powerUp.y + powerUp.size > paddle.y &&
    powerUp.y < paddle.y + paddle.height
  );
};

/**
 * Calculate ball bounce angle off paddle
 */
export const calculateBounceAngle = (ball, paddle) => {
  const collidePoint = ball.x - (paddle.x + paddle.width / 2);
  const normalizedCollidePoint = collidePoint / (paddle.width / 2);
  const maxAngle = Math.PI / 3; // 60 degrees
  return normalizedCollidePoint * maxAngle;
};

/**
 * Easing function for animations (ease-in-out)
 */
export const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Format score with leading zeros
 */
export const formatScore = (score, length = 6) => {
  return score.toString().padStart(length, '0');
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate aspect ratio constrained dimensions
 */
export const calculateAspectRatioDimensions = (containerWidth, containerHeight, targetAspectRatio) => {
  const containerAspectRatio = containerWidth / containerHeight;
  let width, height;

  if (containerAspectRatio > targetAspectRatio) {
    height = containerHeight;
    width = height * targetAspectRatio;
  } else {
    width = containerWidth;
    height = width / targetAspectRatio;
  }

  return { width, height };
};
