//src/ForgotPassword
import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ loading: false, message: '', error: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ loading: true, message: '', error: '' });
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'A technical error occurred. Please try again.');

      setState({ loading: false, message: data.message, error: '' });
    } catch (err) {
      setState({ loading: false, message: '', error: err.message || 'A technical error occurred. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-[] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-6 text-[]">
          Forgot your password?
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 border border-[] rounded bg-[] text-[] placeholder-[]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

       <button
  type="submit"
  disabled={state.loading}
  className={`btn-brown-full ${state.loading ? "opacity-50 cursor-not-allowed" : ""}`}
>
  {state.loading ? "Sending…" : "Send reset link"}
</button>

        </form>

        {state.message && <p className="text-siteText mt-4">{state.message}</p>}
        {state.error && <p className="text-siteText mt-4 border-l-2 border-siteDark pl-3">{state.error}</p>}
      </div>
    </div>
  );
}
