import React from 'react';
import { images } from '../../../constants';
import './SubHeading.css';

const SubHeading = ({ title, className = '' }) => (
  <div className={`subheading ${className}`.trim()}>
    <p className="p__cormorant">{title}</p>
    <img src={images.spoon} alt="" className="spoon__img" />
  </div>
);

export default SubHeading;
