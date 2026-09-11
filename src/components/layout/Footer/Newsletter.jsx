import React, { useState } from 'react';
import { SubHeading, Button } from '../../ui';
import { subscribeNewsletter } from '../../../lib/api/newsletter';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setMessage('');

    try {
      await subscribeNewsletter(email.trim());
      setStatus('success');
      setMessage('You are on the list. We will write when the next seating opens.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Unable to subscribe right now.');
    }
  };

  return (
    <div className="app__newsletter" data-reveal="up">
      <div className="app__newsletter-heading">
        <SubHeading title="Newsletter" />
        <h1 className="headtext__cormorant">Subscribe to our newsletter</h1>
        <p className="p__opensans">Seasonal menus, late-night sittings, and notes from the cellar.</p>
      </div>
      {status === 'success' ? (
        <p className="p__opensans app__newsletter-success">{message}</p>
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
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending' : 'Subscribe'}
          </Button>
        </form>
      )}
      {status === 'error' ? (
        <p className="p__opensans app__newsletter-error">{message}</p>
      ) : null}
    </div>
  );
};

export default Newsletter;
