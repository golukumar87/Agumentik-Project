import { useDispatch } from "react-redux";
import { updateTask } from "../store/taskSlice.js";

const columns = ["Pending", "In Progress", "Completed"];

export default function KanbanBoard({ tasks, onSelect }) {
  const dispatch = useDispatch();

  return (
    <div className="kanban-board">
      {columns.map((column) => (
        <section className="kanban-column" key={column}>
          <div className="kanban-head">
            <h3>{column}</h3>
            <span>{tasks.filter((task) => task.status === column).length}</span>
          </div>
          <div className="kanban-list">
            {tasks
              .filter((task) => task.status === column)
              .map((task) => (
                <article className="kanban-card" key={task._id} onClick={() => onSelect(task)}>
                  <strong>{task.title}</strong>
                  <small>{task.category} • {task.priorityLevel} • Score {task.priorityScore}</small>
                  <select
                    value={task.status}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => dispatch(updateTask({ id: task._id, updates: { status: event.target.value } }))}
                  >
                    {columns.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
