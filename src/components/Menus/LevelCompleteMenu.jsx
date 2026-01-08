import './LevelCompleteMenu.css';

const LevelCompleteMenu = ({ score, currentLevel, onNextLevel, onMainMenu }) => {
  return (
    <div className="level-complete-menu">
      <div className="menu-content">
        <h1 className="level-complete-headline">LEVEL {currentLevel} COMPLETE!</h1>

        <div className="level-complete-score">
          <p className="score-label">SCORE</p>
          <p className="score-value">{score.toString().padStart(6, '0')}</p>
        </div>

        <div className="level-complete-buttons">
          <button
            className="menu-button next-level-button"
            onClick={onNextLevel}
          >
            NEXT LEVEL
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

export default LevelCompleteMenu;
