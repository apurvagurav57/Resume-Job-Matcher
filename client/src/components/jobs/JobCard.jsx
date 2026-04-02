import { Bookmark, ExternalLink, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import MatchScore from './MatchScore';
import { formatDate, formatSalary } from '../../utils/formatters';
import { saveJob } from '../../services/api';

export default function JobCard({ job }) {
  const handleSave = async () => {
    try {
      await saveJob(job.jobId);
      toast.success('Job saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  return (
    <article className="card flex h-full flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{job.company || 'Unknown company'}</p>
          <p className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="h-3 w-3" /> {job.location || 'N/A'}</p>
        </div>
        <MatchScore score={job.matchScore || 0} size={64} />
      </div>

      <h3 className="text-lg font-semibold text-white">{job.title}</h3>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary/20 px-2 py-1 text-primary">{job.workType || 'N/A'}</span>
        <span className="rounded-full bg-gray-800 px-2 py-1 text-gray-300">{formatSalary(job.salary)}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {(job.strengths || []).slice(0, 3).map((s, i) => (
          <span key={`${s}-${i}`} className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-1 text-xs text-green-300">{s}</span>
        ))}
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Posted: {formatDate(job.postedAt)}</span>
          <button type="button" className="rounded-md p-1 hover:bg-gray-800" onClick={handleSave}>
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link to={`/jobs/${job.jobId}`} state={{ job }} className="btn-secondary px-3 py-2 text-center text-sm">View Details</Link>
          <a href={job.applyLink} target="_blank" rel="noreferrer" className="btn-primary flex items-center justify-center gap-1 px-3 py-2 text-sm">
            Apply <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
