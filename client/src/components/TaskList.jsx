import { useDispatch } from "react-redux";
import { CalendarClock, CheckCircle2, Pencil, Trash2, UserRound } from "lucide-react";
import { deleteTask, updateTask } from "../store/taskSlice.js";

const levelClass = {
  Overdue: "danger",
  High: "warning",
  Medium: "medium",
  Low: "low",
  Done: "done"
};

const formatDate = (dateValue) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(dateValue));

const getTimeSignal = (task) => {
  if (task.status === "Completed") return "Completed";
  const diff = new Date(task.deadline).getTime() - Date.now();
  if (diff < 0) return "Overdue now";
  const hours = Math.ceil(diff / (60 * 60 * 1000));
  if (hours <= 24) return `Due in ${hours}h`;
  const days = Math.ceil(hours / 24);
  return `Due in ${days}d`;
};

export default function TaskList({ tasks, onEdit, onSelect }) {
  const dispatch = useDispatch();

  if (!tasks.length) {
    return (
      <div className="empty-state rich-empty">
        <CheckCircle2 size={30} />
        <strong>No tasks match this view</strong>
        <span>Create a task or adjust filters to start the priority queue.</span>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article className={`task-card ${levelClass[task.priorityLevel] || ""}`} key={task._id} onClick={() => onSelect(task)}>
          <div className="task-card-main">
            <div className="task-title-row">
              <div>
                <h3>{task.title}</h3>
                <small>{getTimeSignal(task)}</small>
              </div>
              <div className="priority-stack">
                <span className={`status-pill ${levelClass[task.priorityLevel] || ""}`}>{task.priorityLevel}</span>
                <b>Score {task.priorityScore}</b>
              </div>
            </div>
            <p>{task.description}</p>
            <div className="task-meta">
              <span>{task.category}</span>
              <span>
                <UserRound size={15} />
                {task.owner?.name || "User"}
              </span>
              <span>
                <CalendarClock size={15} />
                {formatDate(task.deadline)}
              </span>
              <span>{task.status}</span>
            </div>
          </div>
          <div className="task-controls">
            <select
              value={task.status}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => dispatch(updateTask({ id: task._id, updates: { status: event.target.value } }))}
              aria-label={`Update status for ${task.title}`}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <button className="icon-button" onClick={(event) => { event.stopPropagation(); onEdit(task); }} title="Edit task" type="button">
              <Pencil size={17} />
            </button>
            <button className="icon-button danger-icon" onClick={(event) => { event.stopPropagation(); dispatch(deleteTask(task._id)); }} title="Delete task" type="button">
              <Trash2 size={17} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
