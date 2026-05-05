const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const calculatePriorityScore = (deadline, status) => {
  if (status === "Completed") return 0;

  const deadlineTime = new Date(deadline).getTime();
  const diff = deadlineTime - Date.now();

  if (diff < 0) {
    const overdueDays = Math.ceil(Math.abs(diff) / DAY);
    return 1000 + overdueDays * 10;
  }

  if (diff <= HOUR) return 950;
  if (diff <= 6 * HOUR) return 850;
  if (diff <= DAY) return 700;
  if (diff <= 3 * DAY) return 520;
  if (diff <= 7 * DAY) return 330;
  return 150;
};

export const getPriorityLevel = (score, status) => {
  if (status === "Completed") return "Done";
  if (score >= 1000) return "Overdue";
  if (score >= 700) return "High";
  if (score >= 330) return "Medium";
  return "Low";
};

export const sortBySmartPriority = (tasks) => {
  return [...tasks].sort((a, b) => {
    const priorityDiff = b.priorityScore - a.priorityScore;
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};
