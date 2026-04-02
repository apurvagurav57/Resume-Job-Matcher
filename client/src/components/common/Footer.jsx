import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-surface py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-gray-400 md:flex-row">
        <p>ResuMatch © 2024 - AI-Powered Job Matching</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-primary" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <Link className="hover:text-primary" to="/">Home</Link>
        </div>
      </div>
    </footer>
  );
}
