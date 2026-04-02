import SkillChips from './SkillChips';

export default function ResumePreview({ resume }) {
  const parsed = resume?.parsedData || {};
  if (!resume) return null;

  return (
    <section className="card space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{parsed.name || 'Candidate Profile'}</h3>
          <p className="text-sm text-gray-400">{parsed.email || 'No email extracted'}</p>
          <p className="text-sm text-gray-400">{parsed.phone || 'No phone extracted'}</p>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
          {parsed.experienceYears ?? 0} years experience
        </span>
      </div>

      <div>
        <p className="mb-1 text-sm text-gray-400">Education</p>
        <p className="text-gray-200">{parsed.education || 'Not available'}</p>
      </div>

      <div>
        <p className="mb-2 text-sm text-gray-400">Skills</p>
        <SkillChips skills={parsed.skills || []} />
      </div>

      <div>
        <p className="mb-1 text-sm text-gray-400">Professional Summary</p>
        <p className="text-gray-300">{parsed.summary || 'Summary not generated yet.'}</p>
      </div>
    </section>
  );
}
