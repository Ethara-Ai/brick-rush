import './TopBar.css';

const TopBar = ({ score, lives, currentLevel }) => {
  return (
    <div className="top-bar">
      <div className="top-bar-side">
        <span className="top-bar-label">Score:</span>
        <span className="top-bar-value">{score.toString().padStart(6, '0')}</span>
      </div>

      <div className="top-bar-center">
        <span className="top-bar-level">Level {currentLevel}</span>
      </div>

      <div className="top-bar-side">
        <span className="top-bar-label">Lives:</span>
        <span className="top-bar-value">{lives}</span>
      </div>
    </div>
  );
};

export default TopBar;
