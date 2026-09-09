import React from 'react';
import './ImageFrame.css';

const ImageFrame = ({ src, alt, className = '' }) => (
  <div className={`image-frame ${className}`.trim()}>
    <span className="image-frame__corner image-frame__corner--tl" />
    <span className="image-frame__corner image-frame__corner--tr" />
    <span className="image-frame__corner image-frame__corner--bl" />
    <span className="image-frame__corner image-frame__corner--br" />
    <div className="image-frame__media">
      <img src={src} alt={alt} />
    </div>
  </div>
);

export default ImageFrame;
