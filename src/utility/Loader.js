import React from 'react';

const Loader = () => {
  const loaderOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid #0F6D6A',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const keyframesStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={loaderOverlayStyle}>
      <style>{keyframesStyle}</style>
      <div style={spinnerStyle}></div>
      {/* You can add a loading message or other elements here */}
    </div>
  );
};

export default Loader;
