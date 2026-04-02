import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      toast.success('Account created');
      navigate('/upload');
    } catch (error) {
      const apiError = error.response?.data;
      const firstFieldError = apiError?.errors?.[0]?.msg;
      toast.error(firstFieldError || apiError?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required /></div>
        <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required /></div>
        <div><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required /></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        <p className="text-sm text-gray-400">Already have an account? <Link className="text-primary" to="/login">Login</Link></p>
      </form>
    </div>
  );
}

