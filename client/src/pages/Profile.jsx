import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/navbar';
import Footer from '../components/common/Footer';
import ResumePreview from '../components/resume/ResumePreview';
import { useAuth } from '../hooks/useAuth';
import { getApplications, getMyResume } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getMyResume().then((res) => setResume(res.data.resume)).catch(() => setResume(null));
    getApplications().then((res) => setApplications(res.data.applications || [])).catch(() => setApplications([]));
  }, []);

  const initials = useMemo(() => (user?.name || 'U').split(' ').map((t) => t[0]).join('').slice(0, 2).toUpperCase(), [user]);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <section className="card flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">{initials}</div><div><h1 className="text-2xl font-bold">{user?.name}</h1><p className="text-gray-400">{user?.email}</p></div></div>
          <button type="button" className="btn-secondary" onClick={() => { logoutUser(); navigate('/login'); }}>Logout</button>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          <div className="card"><p className="text-sm text-gray-400">Applications</p><p className="text-3xl font-bold">{applications.length}</p></div>
          <div className="card"><p className="text-sm text-gray-400">Interviews</p><p className="text-3xl font-bold">{applications.filter((a) => a.status === 'interview').length}</p></div>
          <div className="card"><p className="text-sm text-gray-400">Offers</p><p className="text-3xl font-bold">{applications.filter((a) => a.status === 'offer').length}</p></div>
        </section>
        {resume && <ResumePreview resume={resume} />}
        <section className="card space-y-3">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <input className="input" type="password" placeholder="Current password" />
          <input className="input" type="password" placeholder="New password" />
          <button type="button" className="btn-primary">Update Password</button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
