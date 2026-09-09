import React from 'react';
import { scrollToId } from '../../../lib/gsap/scrollTo';
import './Button.css';

const Button = ({
  href,
  children,
  className = '',
  variant = 'solid',
  type = 'button',
  onClick,
}) => {
  const classes = ['btn', variant === 'ghost' ? 'btn--ghost' : '', className]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event) => {
    if (href && href.startsWith('#')) {
      event.preventDefault();
      scrollToId(href);
    }
    if (onClick) onClick(event);
  };

  if (href) {
    return (
      <a href={href} className={classes} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button;
