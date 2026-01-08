import { useEffect } from 'react';
import { useGame } from './hooks/useGame.js';
import { GAME_STATES } from './utils/constants.js';
import GameCanvas from './components/Game/GameCanvas.jsx';
import MenuOverlay from './components/Menus/MenuOverlay.jsx';
import StartMenu from './components/Menus/StartMenu.jsx';
import PauseMenu from './components/Menus/PauseMenu.jsx';
import GameOverMenu from './components/Menus/GameOverMenu.jsx';
import LevelCompleteMenu from './components/Menus/LevelCompleteMenu.jsx';
import TopBar from './components/UI/TopBar.jsx';
import LoadingScreen from './components/Loading/LoadingScreen.jsx';
import './App.css';

function App() {
  const {
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
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    returnToMenu,
    startNextLevel,
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleTouchMove,
    handleCanvasClick
  } = useGame();

  // Setup keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Prevent context menu on right click
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', preventContextMenu);
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  return (
    <div className="app">
      <LoadingScreen isLoading={isLoading} />

      <div className="game-container">
        {/* Top Bar - only visible when playing or paused */}
        {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) && !levelTransitioning && (
          <TopBar score={score} lives={lives} currentLevel={currentLevel} />
        )}

        {/* Game Canvas */}
        <div className="canvas-container">
          <GameCanvas
            paddle={paddle}
            balls={balls}
            bricks={bricks}
            activePowerUps={activePowerUps}
            brickDropProgress={brickDropProgress}
            score={score}
            lives={lives}
            currentLevel={currentLevel}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={handleCanvasClick}
          />
        </div>

        {/* Start Menu */}
        <MenuOverlay show={gameState === GAME_STATES.START_MENU}>
          <StartMenu onStart={startGame} />
        </MenuOverlay>

        {/* Pause Menu */}
        <MenuOverlay show={gameState === GAME_STATES.PAUSED}>
          <PauseMenu
            onResume={resumeGame}
            onRestart={restartGame}
            onMainMenu={returnToMenu}
          />
        </MenuOverlay>

        {/* Game Over Menu */}
        <MenuOverlay show={gameState === GAME_STATES.GAME_OVER}>
          <GameOverMenu
            score={score}
            highScore={highScore}
            onRestart={restartGame}
            onMainMenu={returnToMenu}
          />
        </MenuOverlay>

        {/* Level Complete Menu */}
        <MenuOverlay show={gameState === GAME_STATES.LEVEL_COMPLETE}>
          <LevelCompleteMenu
            score={score}
            currentLevel={currentLevel}
            onNextLevel={startNextLevel}
            onMainMenu={returnToMenu}
          />
        </MenuOverlay>
      </div>

      {/* Game hints and controls info */}
      {gameState === GAME_STATES.PLAYING && !ballLaunched && (
        <div className="game-hint">
          Press SPACE or Click to launch ball
        </div>
      )}
    </div>
  );
}

export default App;
