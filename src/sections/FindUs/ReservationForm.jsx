import React, { useState } from 'react';
import { Button, SubHeading } from '../../components/ui';
import { createReservation } from '../../lib/api/reservations';
import './ReservationForm.css';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '19:00',
  guests: 2,
  notes: '',
};

const ReservationForm = () => {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await createReservation({
        ...form,
        guests: Number(form.guests),
        notes: form.notes.trim() || undefined,
      });
      setStatus('success');
      setMessage('Your table is requested. We will confirm by email.');
      setForm(emptyForm);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Unable to book right now.');
    }
  };

  return (
    <div className="reservation" id="reserve" data-reveal="up">
      <div className="reservation__title">
        <SubHeading title="Reservations" />
        <h2 className="headtext__cormorant">Book a table</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className="reservation__grid">
          <label className="reservation__field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
          <label className="reservation__field">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={onChange} required />
          </label>
          <label className="reservation__field">
            <span>Phone</span>
            <input name="phone" value={form.phone} onChange={onChange} required />
          </label>
          <label className="reservation__field">
            <span>Guests</span>
            <select name="guests" value={form.guests} onChange={onChange}>
              {Array.from({ length: 12 }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>
          <label className="reservation__field">
            <span>Date</span>
            <input type="date" name="date" value={form.date} onChange={onChange} required />
          </label>
          <label className="reservation__field">
            <span>Time</span>
            <input type="time" name="time" value={form.time} onChange={onChange} required />
          </label>
          <label className="reservation__field reservation__field--wide">
            <span>Notes</span>
            <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Occasion, allergies, seating preference" />
          </label>
        </div>
        <div className="reservation__actions">
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending' : 'Request table'}
          </Button>
        </div>
        {message ? (
          <p className={`reservation__message ${status === 'error' ? 'reservation__message--error' : ''}`}>
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
};

export default ReservationForm;
