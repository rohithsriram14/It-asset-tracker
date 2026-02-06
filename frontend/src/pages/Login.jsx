import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Login failed');
        return;
      }
      // on success, redirect or update app state
      window.location.href = '/';
    } catch (err) {
      setError('Login failed — unable to contact server');
    }
  }

  return (
    <div className="app-container">
      <h1>Login</h1>
      <p className="lead">Enter your credentials to access the system.</p>

      {error && <div role="alert" style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
        </div>

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="btn">Login</button>
      </form>

      <footer className="app-footer">IT Asset Tracking System</footer>
    </div>
  );
}