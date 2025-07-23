import React from 'react';
import './../styles/force-landscape.css';

const ForceLandscape = () => {
  return (
    <div className="force-landscape-overlay">
      <div className="force-landscape-message">
        <p>Please rotate your device to landscape mode for the best experience.</p>
      </div>
    </div>
  );
};

export default ForceLandscape;
