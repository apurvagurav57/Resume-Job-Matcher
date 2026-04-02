export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatSalary = (salary) => {
  if (!salary || salary === "Not specified") return "Salary not disclosed";
  return salary;
};

export const getScoreColor = (score) => {
  if (score >= 80) return "#43E97B";
  if (score >= 60) return "#FFB300";
  return "#FF6584";
};

export const getStatusColor = (status) => {
  const colors = {
    saved: "bg-gray-500/20 text-gray-400",
    applied: "bg-blue-500/20 text-blue-400",
    interview: "bg-yellow-500/20 text-yellow-400",
    offer: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
  };
  return colors[status] || colors.saved;
};
