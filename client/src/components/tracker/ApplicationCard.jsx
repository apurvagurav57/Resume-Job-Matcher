import { Trash2 } from "lucide-react";
import { formatDate, getStatusColor } from "../../utils/formatters";

export default function ApplicationCard({ application, onDelete, onClick }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onClick(application)}
          className="text-left"
        >
          <p className="font-medium text-white">
            {application.jobTitle || "Untitled role"}
          </p>
          <p className="text-sm text-gray-400">
            {application.company || "Unknown company"}
          </p>
        </button>
        <button
          type="button"
          onClick={() => onDelete(application._id)}
          className="rounded p-1 text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Applied: {formatDate(application.appliedAt || application.createdAt)}
      </p>
      <span
        className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs ${getStatusColor(application.status)}`}
      >
        {application.status}
      </span>
      {application.notes && (
        <p className="mt-2 line-clamp-2 text-xs text-gray-400">
          {application.notes}
        </p>
      )}
    </div>
  );
}
