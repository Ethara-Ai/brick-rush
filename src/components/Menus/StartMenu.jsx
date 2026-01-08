import './StartMenu.css';

const StartMenu = ({ onStart }) => {
  return (
    <div className="start-menu">
      <div className="start-menu-content">
        <h1 className="game-title">BRICK RUSH</h1>

        <div className="game-desc">
          <p>Break all the bricks to advance through levels!</p>
          <p>Collect power-ups for special abilities.</p>
        </div>

        <div className="desktop-controls-info">
          <h2>Controls</h2>
          <p>
            <strong>Move:</strong> Arrow Keys or A/D<br />
            <strong>Launch Ball:</strong> Space or Click<br />
            <strong>Pause:</strong> ESC
          </p>
        </div>

        <button
          className="menu-button start-button"
          onClick={onStart}
        >
          START GAME
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
