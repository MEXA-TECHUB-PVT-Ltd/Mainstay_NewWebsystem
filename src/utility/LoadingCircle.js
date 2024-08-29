import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CircularProgressBar = ({ url }) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress < 100 ? prevProgress + 1 : prevProgress
      );
    }, 50);

    // No interval cleanup here to keep running indefinitely
    return () => {
      // If you want to clean up resources when the component unmounts, you can add cleanup logic here
    };
  }, []);

  if (progress === 100) {
    window.location = url;
  }
  const containerStyle = {
    width: '100px',
    height: '100px',
    position: 'relative',
  };

  const progressBarStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '4px solid #eee', // Border color of the circular progress bar
    position: 'absolute',
    boxSizing: 'border-box',
  };

  const progressFillStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    clipPath: 'polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 0)',
    border: '4px solid #3498db', // Color of the progress in the circular bar (border)
    boxSizing: 'border-box',
    position: 'absolute',
  };

  const textStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#3498db', // Color of the progress text
  };

  return (
    <div style={containerStyle}>
      <div style={progressBarStyle}></div>
      <div
        style={{
          ...progressFillStyle,
          transform: `rotate(${progress * 3.6 - 90}deg)`,
        }}
      ></div>
      <div style={textStyle}>{progress}%</div>
    </div>
  );
};

export default CircularProgressBar;
