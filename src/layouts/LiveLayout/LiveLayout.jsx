import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes';

export const LiveLayout = () => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="live-layout-wrapper">
      {/* Top Floating Utility Control Bar */}
      <div className="live-layout-controls">
        <button 
          type="button" 
          className="live-ctrl-btn" 
          onClick={() => navigate(ROUTES.ADMIN)}
          title="Exit Live View back to Admin Dashboard"
        >
          <ArrowLeft size={16} /> Exit Broadcast
        </button>

        <button 
          type="button" 
          className="live-ctrl-btn" 
          onClick={toggleFullscreen}
          title="Toggle Fullscreen for TV Display"
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>
      </div>

      <Outlet />
    </div>
  );
};
