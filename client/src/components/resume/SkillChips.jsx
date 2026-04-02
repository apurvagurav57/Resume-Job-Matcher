export default function SkillChips({ skills = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <span key={`${skill}-${i}`} className="rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-sm text-primary">
          {skill}
        </span>
      ))}
    </div>
  );
}
