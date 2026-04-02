import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/navbar';
import Footer from '../components/common/Footer';
import KanbanBoard from '../components/tracker/KanbanBoard';
import { createApplication, deleteApplication, getApplications, updateApplication } from '../services/api';

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ jobTitle: '', company: '', location: '', status: 'saved', notes: '' });

  const fetchApps = async () => {
    try {
      const res = await getApplications();
      setApplications(res.data.applications || []);
    } catch {
      toast.error('Failed to load applications');
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const counts = useMemo(() => applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {}), [applications]);

  const handleMove = async (id, status) => {
    try { await updateApplication(id, { status }); fetchApps(); } catch { toast.error('Could not update status'); }
  };

  const handleDelete = async (id) => {
    try { await deleteApplication(id); fetchApps(); } catch { toast.error('Delete failed'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createApplication(form);
      setShowModal(false);
      setForm({ jobTitle: '', company: '', location: '', status: 'saved', notes: '' });
      fetchApps();
    } catch { toast.error('Could not create application'); }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <section className="card flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold">Application Tracker</h1><p className="mt-1 text-gray-400">Track progress from saved to offer.</p></div>
          <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>Add New Application</button>
        </section>
        <section className="grid gap-4 md:grid-cols-5">
          {['saved', 'applied', 'interview', 'offer', 'rejected'].map((k) => <div key={k} className="card text-center"><p className="text-xs uppercase text-gray-400">{k}</p><p className="text-2xl font-bold">{counts[k] || 0}</p></div>)}
        </section>
        <KanbanBoard applications={applications} onMove={handleMove} onDelete={handleDelete} onCardClick={setSelected} onAddNew={() => setShowModal(true)} />
        {selected && <section className="card"><h3 className="text-lg font-semibold">{selected.jobTitle}</h3><p className="text-gray-400">{selected.company} • {selected.location}</p><p className="mt-3 text-gray-300">{selected.notes || 'No notes yet.'}</p></section>}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <form onSubmit={handleCreate} className="card w-full max-w-lg space-y-3">
              <h3 className="text-xl font-semibold">Add Application</h3>
              <input className="input" placeholder="Job title" value={form.jobTitle} onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))} required />
              <input className="input" placeholder="Company" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} required />
              <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
              <textarea className="input min-h-28" placeholder="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
              <div className="flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn-primary">Save</button></div>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
