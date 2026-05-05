import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createTask, updateTask } from "../store/taskSlice.js";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  status: "Pending",
  deadline: ""
};

const formatForInput = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const addHours = (hours) => {
  const date = new Date(Date.now() + hours * 60 * 60 * 1000);
  return formatForInput(date);
};

const templates = [
  {
    label: "Frontend",
    value: {
      title: "Polish dashboard UI",
      description: "Improve responsive layout, empty states and task card readability.",
      category: "Frontend",
      status: "Pending",
      deadline: addHours(8)
    }
  },
  {
    label: "Backend",
    value: {
      title: "Verify API flow",
      description: "Check protected routes, MongoDB persistence and task mutation responses.",
      category: "Backend",
      status: "Pending",
      deadline: addHours(12)
    }
  },
  {
    label: "Demo",
    value: {
      title: "Record assessment demo",
      description: "Show architecture, modules, real-time updates and insights dashboard.",
      category: "Submission",
      status: "Pending",
      deadline: addHours(24)
    }
  }
];

export default function TaskForm({ editingTask, onDone }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        category: editingTask.category,
        status: editingTask.status,
        deadline: formatForInput(editingTask.deadline)
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingTask]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, deadline: new Date(form.deadline).toISOString() };

    try {
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask._id, updates: payload })).unwrap();
      } else {
        await dispatch(createTask(payload)).unwrap();
      }

      setForm(emptyForm);
      onDone();
    } catch (_error) {
      // Error message is already displayed from Redux state.
    }
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      {!editingTask && (
        <div className="template-row">
          {templates.map((template) => (
            <button key={template.label} onClick={() => setForm(template.value)} type="button">
              {template.label}
            </button>
          ))}
        </div>
      )}
      <label>
        <span>Title</span>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Design review" required />
      </label>
      <label>
        <span>Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What needs to be done?"
          rows="4"
          required
        />
      </label>
      <label>
        <span>Category</span>
        <input name="category" value={form.category} onChange={handleChange} placeholder="Frontend, Backend, Docs" required />
      </label>
      <div className="form-pair">
        <label>
          <span>Status</span>
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>
        <label>
          <span>Deadline</span>
          <input name="deadline" value={form.deadline} onChange={handleChange} type="datetime-local" required />
        </label>
      </div>
      <div className="form-actions">
        {editingTask && (
          <button className="ghost-button" onClick={onDone} type="button">
            Cancel
          </button>
        )}
        <button className="primary-button" type="submit">
          {editingTask ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
}
