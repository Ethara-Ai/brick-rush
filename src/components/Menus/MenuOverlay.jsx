import { useEffect, useState } from 'react';
import './MenuOverlay.css';

const MenuOverlay = ({ children, show, onTransitionEnd }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for fade out animation before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
        if (onTransitionEnd) {
          onTransitionEnd();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [show, onTransitionEnd]);

  if (!shouldRender) return null;

  return (
    <div className={`menu-overlay ${isVisible ? 'fade-in' : 'fade-out'}`}>
      <div className="menu-overlay-content">
        {children}
      </div>
    </div>
  );
};

export default MenuOverlay;
