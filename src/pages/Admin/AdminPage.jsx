import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';
import {
  adminLogin,
  adminLogout,
  createAdminMenuItem,
  deleteAdminMenuItem,
  fetchAdminMenu,
  fetchAdminReservations,
  fetchAdminSession,
  fetchAdminSubscribers,
  updateAdminMenuItem,
  updateReservationStatus,
} from '../../lib/api/admin';
import './Admin.css';

const emptyItem = {
  category: 'wine',
  title: '',
  price: '',
  tags: '',
  sortOrder: 0,
};

const AdminPage = () => {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState('reservations');
  const [email, setEmail] = useState('admin@fiestalablanc.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState(emptyItem);

  const loadDesk = async () => {
    const [bookingData, subscriberData, menuData] = await Promise.all([
      fetchAdminReservations(),
      fetchAdminSubscribers(),
      fetchAdminMenu(),
    ]);
    setReservations(bookingData.reservations || []);
    setSubscribers(subscriberData.subscribers || []);
    setMenuItems(menuData.items || []);
  };

  useEffect(() => {
    fetchAdminSession()
      .then(async (payload) => {
        setAdmin(payload.admin);
        await loadDesk();
      })
      .catch(() => setAdmin(null))
      .finally(() => setChecking(false));
  }, []);

  const onLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const payload = await adminLogin(email, password);
      setAdmin(payload.admin);
      await loadDesk();
    } catch (err) {
      setError(err.message);
    }
  };

  const onLogout = async () => {
    await adminLogout();
    setAdmin(null);
  };

  const onStatus = async (id, status) => {
    const payload = await updateReservationStatus(id, status);
    setReservations((current) =>
      current.map((item) => (item.id === id ? payload.reservation : item))
    );
  };

  const onCreateItem = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const payload = await createAdminMenuItem({
        ...newItem,
        sortOrder: Number(newItem.sortOrder) || 0,
      });
      setMenuItems((current) => [...current, payload.item]);
      setNewItem(emptyItem);
      setMessage('Menu item added. The public menu will show it on refresh.');
    } catch (err) {
      setError(err.message);
    }
  };

  const onSaveItem = async (item) => {
    const payload = await updateAdminMenuItem(item.id, {
      category: item.category,
      title: item.title,
      price: item.price,
      tags: item.tags,
      sortOrder: Number(item.sortOrder) || 0,
    });
    setMenuItems((current) => current.map((row) => (row.id === item.id ? payload.item : row)));
    setMessage('Menu item saved.');
  };

  const onDeleteItem = async (id) => {
    await deleteAdminMenuItem(id);
    setMenuItems((current) => current.filter((item) => item.id !== id));
  };

  if (checking) {
    return (
      <main className="admin">
        <div className="admin__shell">
          <p className="admin-empty">Checking session…</p>
        </div>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="admin">
        <div className="admin__shell">
          <p className="admin__kicker">Staff</p>
          <h1 className="admin__title">Admin</h1>
          <div className="admin__card">
            <form className="admin__form" onSubmit={onLogin}>
              <label>
                Email
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </label>
              <label>
                Password
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </label>
              <Button type="submit">Sign in</Button>
              {error ? <p className="admin__message admin__message--error">{error}</p> : null}
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin">
      <div className="admin__shell">
        <div className="admin__top">
          <div>
            <p className="admin__kicker">{admin.email}</p>
            <h1 className="admin__title">Service desk</h1>
          </div>
          <div className="admin-actions">
            <Link to="/" className="btn btn--ghost btn--nav">
              View site
            </Link>
            <Button variant="ghost" className="btn--nav" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </div>

        <div className="admin__tabs">
          {['reservations', 'subscribers', 'menu'].map((id) => (
            <button
              key={id}
              type="button"
              className={`admin__tab ${tab === id ? 'is-active' : ''}`}
              onClick={() => setTab(id)}
            >
              {id}
            </button>
          ))}
        </div>

        {message ? <p className="admin__message">{message}</p> : null}

        {tab === 'reservations' ? (
          <div className="admin__card">
            {reservations.length === 0 ? (
              <p className="admin-empty">No bookings yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>When</th>
                    <th>Party</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        {booking.name}
                        <br />
                        {booking.email}
                        <br />
                        {booking.phone}
                      </td>
                      <td>
                        {booking.date} · {booking.time}
                        {booking.notes ? <><br />{booking.notes}</> : null}
                      </td>
                      <td>{booking.guests}</td>
                      <td className="admin-status">{booking.status}</td>
                      <td>
                        <div className="admin-actions">
                          <Button className="btn--nav" onClick={() => onStatus(booking.id, 'confirmed')}>
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            className="btn--nav"
                            onClick={() => onStatus(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : null}

        {tab === 'subscribers' ? (
          <div className="admin__card">
            {subscribers.length === 0 ? (
              <p className="admin-empty">No subscribers yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td>{subscriber.email}</td>
                      <td>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : null}

        {tab === 'menu' ? (
          <div className="admin__card">
            <form className="admin-menu-form" onSubmit={onCreateItem}>
              <label>
                Category
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem((current) => ({ ...current, category: e.target.value }))}
                >
                  <option value="wine">Wine</option>
                  <option value="cocktail">Cocktail</option>
                </select>
              </label>
              <label>
                Title
                <input
                  value={newItem.title}
                  onChange={(e) => setNewItem((current) => ({ ...current, title: e.target.value }))}
                  required
                />
              </label>
              <label>
                Price
                <input
                  value={newItem.price}
                  onChange={(e) => setNewItem((current) => ({ ...current, price: e.target.value }))}
                  required
                />
              </label>
              <label>
                Tags
                <input
                  value={newItem.tags}
                  onChange={(e) => setNewItem((current) => ({ ...current, tags: e.target.value }))}
                  required
                />
              </label>
              <Button type="submit">Add item</Button>
            </form>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Tags</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <select
                        value={item.category}
                        onChange={(e) =>
                          setMenuItems((current) =>
                            current.map((row) =>
                              row.id === item.id ? { ...row, category: e.target.value } : row
                            )
                          )
                        }
                      >
                        <option value="wine">Wine</option>
                        <option value="cocktail">Cocktail</option>
                      </select>
                    </td>
                    <td>
                      <input
                        value={item.title}
                        onChange={(e) =>
                          setMenuItems((current) =>
                            current.map((row) =>
                              row.id === item.id ? { ...row, title: e.target.value } : row
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={item.price}
                        onChange={(e) =>
                          setMenuItems((current) =>
                            current.map((row) =>
                              row.id === item.id ? { ...row, price: e.target.value } : row
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={item.tags}
                        onChange={(e) =>
                          setMenuItems((current) =>
                            current.map((row) =>
                              row.id === item.id ? { ...row, tags: e.target.value } : row
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Button className="btn--nav" onClick={() => onSaveItem(item)}>
                          Save
                        </Button>
                        <Button variant="ghost" className="btn--nav" onClick={() => onDeleteItem(item.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default AdminPage;
