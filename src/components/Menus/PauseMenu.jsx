import './PauseMenu.css';

const PauseMenu = ({ onResume, onRestart, onMainMenu }) => {
  return (
    <div className="pause-menu">
      <div className="menu-content">
        <h1 className="pause-headline">PAUSED</h1>

        <div className="pause-buttons">
          <button
            className="menu-button resume-button"
            onClick={onResume}
          >
            RESUME
          </button>

          <button
            className="menu-button restart-button"
            onClick={onRestart}
          >
            RESTART
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

export default PauseMenu;
