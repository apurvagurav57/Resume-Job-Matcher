import { Menu, UserCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upload', label: 'Upload Resume' },
  { to: '/matches', label: 'Job Matches' },
  { to: '/tracker', label: 'Tracker' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-xl font-bold tracking-tight text-primary">ResuMatch</Link>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'text-primary' : 'text-gray-300 hover:text-white')}>
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="relative hidden md:block">
          <button type="button" onClick={() => setProfileOpen((p) => !p)} className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm hover:border-primary">
            <UserCircle2 className="h-4 w-4" />
            <span>{user?.name || 'User'}</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-800 bg-card p-4 shadow-lg">
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="truncate text-sm text-gray-400">{user?.email}</p>
              <div className="mt-3 flex gap-2">
                <Link to="/profile" className="btn-secondary px-4 py-2 text-sm">Profile</Link>
                <button type="button" className="btn-primary px-4 py-2 text-sm" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </div>
        <button type="button" className="md:hidden" onClick={() => setMenuOpen((m) => !m)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {menuOpen && (
        <div className="border-t border-gray-800 bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-primary">
                {item.label}
              </Link>
            ))}
            <button type="button" className="btn-primary w-full" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </header>
  );
}
