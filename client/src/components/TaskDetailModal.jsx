import { CalendarClock, Clock3, UserRound, X } from "lucide-react";

const formatDate = (dateValue) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short"
  }).format(new Date(dateValue));

const getPriorityReason = (task) => {
  if (task.status === "Completed") return "Completed tasks are moved to Done priority with score 0.";
  if (task.priorityLevel === "Overdue") return "This task is overdue, so it receives the highest priority.";
  if (task.priorityLevel === "High") return "The deadline is close, so the smart engine increased its score.";
  return "Priority is calculated from deadline distance, overdue state and created timestamp order.";
};

export default function TaskDetailModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="task-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" onClick={onClose} title="Close task details" type="button">
          <X size={18} />
        </button>
        <p className="eyebrow">Task detail</p>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <div className="modal-grid">
          <span>{task.category}</span>
          <span>{task.status}</span>
          <span>{task.priorityLevel}</span>
          <span>Score {task.priorityScore}</span>
        </div>
        <div className="modal-facts">
          <div>
            <UserRound size={17} />
            <span>Creator: {task.owner?.name || "User"}</span>
          </div>
          <div>
            <CalendarClock size={17} />
            <span>Deadline: {formatDate(task.deadline)}</span>
          </div>
          <div>
            <Clock3 size={17} />
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
        </div>
        <div className="priority-note">
          <strong>Why this priority?</strong>
          <p>{getPriorityReason(task)}</p>
        </div>
      </section>
    </div>
  );
}
