import { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ isLoading, progress = 0, onLoadComplete }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        if (onLoadComplete) {
          onLoadComplete();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onLoadComplete]);

  if (!shouldRender) return null;

  return (
    <div className={`loading-screen ${!isVisible ? 'hidden' : ''}`}>
      <div className="loading-content">
        <h1 className="loading-title">BRICK RUSH</h1>
        <p className="loading-subtitle">Loading...</p>

        <div className="loading-spinner"></div>

        {progress > 0 && (
          <div className="loading-progress">
            <div
              className="loading-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
