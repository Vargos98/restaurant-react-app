import React, { useState } from 'react';
import { SubHeading, Button } from '../../ui';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="app__newsletter" data-reveal="up">
      <div className="app__newsletter-heading">
        <SubHeading title="Newsletter" />
        <h1 className="headtext__cormorant">Subscribe to our newsletter</h1>
        <p className="p__opensans">Seasonal menus, late-night sittings, and notes from the cellar.</p>
      </div>
      {subscribed ? (
        <p className="p__opensans app__newsletter-success">You are on the list. We will write when the next seating opens.</p>
      ) : (
        <form className="app__newsletter-input flex__center" onSubmit={onSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            aria-label="Email address"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      )}
    </div>
  );
};

export default Newsletter;
