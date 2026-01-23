import { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';

const VideoPlayer = ({ movieId }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframeEl = iframeRef.current;

    // منع قائمة الزر الأيمن داخل iframe
    const handleContextMenu = (e) => {
      if (iframeEl?.contains(e.target)) e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  if (!movieId) return null;

  const iframeSrc = `https://vidlink.pro/movie/${movieId}?nextbutton=true`;

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="Movie Player"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '10px',
          backgroundColor: '#000'
        }}
      />
    </div>
  );
};

VideoPlayer.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default memo(VideoPlayer);
