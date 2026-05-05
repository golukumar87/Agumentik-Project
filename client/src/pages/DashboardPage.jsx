import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Clock3, Columns3, Database, List, LogOut, Plus, Radio, Search, Sparkles, Users, Zap } from "lucide-react";
import ActivityTimeline from "../components/ActivityTimeline.jsx";
import InsightsPanel from "../components/InsightsPanel.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskDetailModal from "../components/TaskDetailModal.jsx";
import TaskList from "../components/TaskList.jsx";
import StatGrid from "../components/StatGrid.jsx";
import { disconnectSocket, connectSocket } from "../services/socket.js";
import { logout } from "../store/authSlice.js";
import { fetchInsights } from "../store/insightSlice.js";
import { createDemoTasks, fetchTasks } from "../store/taskSlice.js";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { data: insights, loading: insightsLoading, error: insightsError } = useSelector((state) => state.insights);
  const { items, loading, error } = useSelector((state) => state.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [filters, setFilters] = useState({ query: "", status: "All", priority: "All", due: "All" });
  const [showLivePanel, setShowLivePanel] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchInsights());

    const socket = connectSocket(token, dispatch, (data) => {
      const label = data.eventType?.replace("task:", "").replace("demo:created", "demo created");
      setToast(`Live update: ${label || "dashboard synced"}`);
      window.setTimeout(() => setToast(null), 3200);
    });
    return () => {
      socket?.disconnect();
      disconnectSocket();
    };
  }, [dispatch, token]);

  const stats = useMemo(() => {
    const now = Date.now();
    const dueSoon = items.filter((task) => {
      const diff = new Date(task.deadline).getTime() - now;
      return task.status !== "Completed" && diff >= 0 && diff <= 24 * 60 * 60 * 1000;
    }).length;

    return {
      total: insights.totals.totalTasks,
      completed: insights.totals.completedTasks,
      pending: insights.totals.pendingTasks,
      overdue: insights.totals.overdueTasks,
      dueSoon
    };
  }, [insights, items]);

  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());
  };

  const filteredTasks = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return items.filter((task) => {
      const matchesQuery =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query);
      const matchesStatus = filters.status === "All" || task.status === filters.status;
      const matchesPriority = filters.priority === "All" || task.priorityLevel === filters.priority;
      const deadline = new Date(task.deadline).getTime();
      const now = Date.now();
      const inWeek = deadline >= now && deadline <= now + 7 * 24 * 60 * 60 * 1000;
      const today = new Date(task.deadline).toDateString() === new Date().toDateString();
      const matchesDue =
        filters.due === "All" ||
        (filters.due === "Today" && today) ||
        (filters.due === "This week" && inWeek) ||
        (filters.due === "Overdue" && task.priorityLevel === "Overdue") ||
        (filters.due === "Completed" && task.status === "Completed");
      return matchesQuery && matchesStatus && matchesPriority && matchesDue;
    });
  }, [filters, items]);

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Task workspace</p>
          <h1>Welcome, {user?.name}</h1>
        </div>
        <div className="topbar-actions">
          <button
            className="live-badge"
            onClick={() => setShowLivePanel((current) => !current)}
            type="button"
            aria-expanded={showLivePanel}
            aria-controls="live-module-panel"
          >
            <Radio size={16} />
            Live
          </button>
          <button className="ghost-button" onClick={handleLogout} type="button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>
      {showLivePanel && (
        <section className="live-panel" id="live-module-panel">
          <div className="live-panel-head">
            <div>
              <p className="eyebrow">Module 3</p>
              <h2>Real-Time Task Updates</h2>
              <p>Socket.io keeps the workspace synchronized when tasks are created, updated, completed or deleted.</p>
            </div>
            <span className="live-status-dot">
              <Radio size={16} />
              Socket.io connected
            </span>
          </div>
          <div className="live-grid">
            <article>
              <Zap size={20} />
              <strong>Within 1 second</strong>
              <span>Updates are pushed instantly without manual page refresh.</span>
            </article>
            <article>
              <Users size={20} />
              <strong>Multi-user sync</strong>
              <span>Active users and browser tabs see the same task changes.</span>
            </article>
            <article>
              <CheckCircle2 size={20} />
              <strong>Tracked events</strong>
              <span>New task, status change and delete actions refresh tasks and insights.</span>
            </article>
          </div>
          <div className="live-activity-strip">
            <Clock3 size={18} />
            <span>
              Current workspace: {stats.total} tasks, {stats.pending} pending, {stats.overdue} overdue,{" "}
              {insights.activity.dailyActivityCount} activity updates today.
            </span>
          </div>
        </section>
      )}
      {toast && <div className="toast-notice">{toast}</div>}

      <StatGrid stats={stats} />
      <section className="command-strip">
        <div>
          <Sparkles size={18} />
          <span>Smart priority engine ranks overdue and near-deadline work first, then keeps older same-priority tasks ahead.</span>
        </div>
        <strong>{stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate</strong>
      </section>
      {insightsError && <p className="error-text dashboard-error">{insightsError}</p>}
      <InsightsPanel insights={insights} />
      <ActivityTimeline activities={insights.recentActivities} />

      <section className="workspace-grid">
        <aside className="task-editor">
          <div className="section-title">
            <Plus size={18} />
            <h2>{editingTask ? "Update task" : "Create task"}</h2>
          </div>
          <TaskForm editingTask={editingTask} onDone={() => setEditingTask(null)} />
        </aside>
        <section className="task-area">
          <div className="task-area-header">
            <div>
              <p className="eyebrow">Smart priority queue</p>
              <h2>Tasks sorted by urgency</h2>
            </div>
            <div className="task-area-actions">
              {(loading || insightsLoading) && <span className="status-pill neutral">Syncing</span>}
              <button className="ghost-button" onClick={() => dispatch(createDemoTasks())} type="button">
                <Database size={17} />
                Demo data
              </button>
              <div className="view-toggle">
                <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} type="button">
                  <List size={17} />
                </button>
                <button className={viewMode === "kanban" ? "active" : ""} onClick={() => setViewMode("kanban")} type="button">
                  <Columns3 size={17} />
                </button>
              </div>
            </div>
          </div>
          <div className="task-toolbar">
            <label className="search-box">
              <Search size={17} />
              <input
                value={filters.query}
                onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                placeholder="Search tasks"
              />
            </label>
            <select
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
              aria-label="Filter by status"
            >
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <select
              value={filters.priority}
              onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}
              aria-label="Filter by priority"
            >
              <option>All</option>
              <option>Overdue</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
              <option>Done</option>
            </select>
            <select
              value={filters.due}
              onChange={(event) => setFilters((current) => ({ ...current, due: event.target.value }))}
              aria-label="Filter by due date"
            >
              <option>All</option>
              <option>Today</option>
              <option>This week</option>
              <option>Overdue</option>
              <option>Completed</option>
            </select>
          </div>
          {error && <p className="error-text">{error}</p>}
          {viewMode === "kanban" ? (
            <KanbanBoard tasks={filteredTasks} onSelect={setSelectedTask} />
          ) : (
            <TaskList tasks={filteredTasks} onEdit={setEditingTask} onSelect={setSelectedTask} />
          )}
        </section>
      </section>
      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </main>
  );
}
