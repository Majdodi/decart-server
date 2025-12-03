import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "./api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState({ loading: false, message: '', error: '' });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8)
      return setState({ loading: false, message: '', error: 'Password must be at least 8 characters' });

    if (password !== confirm)
      return setState({ loading: false, message: '', error: 'Passwords do not match' });

    setState({ loading: true, message: '', error: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Server error');

      setState({ loading: false, message: 'Password updated successfully. Redirecting…', error: '' });
      setTimeout(() => navigate('/login', { replace: true }), 1500);
  
    } catch (err) {
      setState({ loading: false, message: '', error: err.message });
    }
  };

  return (
    <div className="max-w-md mx-auto pt-32 px-4 text-siteText">

      <h1 className="text-3xl font-bold mb-8 text-siteText">
        Reset Password
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">

        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 border border-siteText/40 rounded bg-siteBg text-siteText placeholder-siteText/50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full p-3 border border-siteText/40 rounded bg-siteBg text-siteText placeholder-siteText/50"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          type="submit"
          disabled={state.loading}
          className={`w-full py-3 rounded font-semibold transition 
            ${state.loading 
              ? 'bg-siteText/40 text-siteBg opacity-60' 
              : 'bg-siteText text-siteBg hover:bg-siteText/90'}`}
        >
          {state.loading ? 'Saving…' : 'Set new password'}
        </button>
      </form>

      {state.message && <p className="text-green-700 mt-4">{state.message}</p>}
      {state.error && <p className="text-red-600 mt-4">{state.error}</p>}
    </div>
  );
}
