import './GameOverMenu.css';

const GameOverMenu = ({ score, highScore, onRestart, onMainMenu }) => {
  const isNewHighScore = score >= highScore;

  return (
    <div className="game-over-menu">
      <div className="menu-content">
        <h1 className="game-over-headline">GAME OVER</h1>

        <div className="game-over-score">
          <p className="score-label">SCORE</p>
          <p className="score-value">{score.toString().padStart(6, '0')}</p>

          {isNewHighScore && (
            <p className="new-high-score">NEW HIGH SCORE!</p>
          )}

          {!isNewHighScore && (
            <>
              <p className="high-score-label">HIGH SCORE</p>
              <p className="high-score-value">{highScore.toString().padStart(6, '0')}</p>
            </>
          )}
        </div>

        <div className="game-over-buttons">
          <button
            className="menu-button restart-button"
            onClick={onRestart}
          >
            TRY AGAIN
          </button>

          <button
            className="menu-button main-menu-button"
            onClick={onMainMenu}
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverMenu;
