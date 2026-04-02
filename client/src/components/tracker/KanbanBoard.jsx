import { Plus } from "lucide-react";
import ApplicationCard from "./ApplicationCard";

const columns = ["saved", "applied", "interview", "offer", "rejected"];

export default function KanbanBoard({
  applications,
  onMove,
  onDelete,
  onCardClick,
  onAddNew,
}) {
  const grouped = columns.reduce((acc, status) => {
    acc[status] = applications.filter((a) => a.status === status);
    return acc;
  }, {});

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {columns.map((status) => (
        <div
          key={status}
          className="rounded-xl border border-gray-800 bg-surface p-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const id = e.dataTransfer.getData("text/plain");
            if (id) onMove(id, status);
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              {status}
            </h3>
            <span className="rounded-full bg-primary/20 px-2 py-1 text-xs text-primary">
              {grouped[status].length}
            </span>
          </div>

          {status === "saved" && (
            <button
              type="button"
              onClick={onAddNew}
              className="mb-3 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-700 px-2 py-2 text-xs text-gray-300 hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" /> Add Job
            </button>
          )}

          <div className="space-y-3">
            {grouped[status].map((application) => (
              <div
                key={application._id}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", application._id)
                }
              >
                <ApplicationCard
                  application={application}
                  onDelete={onDelete}
                  onClick={onCardClick}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
