import { AlertTriangle, CheckCircle2, Clock3, Flame, ListTodo } from "lucide-react";

const statConfig = [
  { key: "total", label: "Total tasks", icon: ListTodo },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
  { key: "pending", label: "Pending", icon: Clock3 },
  { key: "overdue", label: "Overdue", icon: AlertTriangle },
  { key: "dueSoon", label: "Due in 24h", icon: Flame }
];

export default function StatGrid({ stats }) {
  return (
    <section className="stat-grid">
      {statConfig.map(({ key, label, icon: Icon }) => (
        <article className="stat-card" key={key}>
          <Icon size={20} />
          <div>
            <span>{label}</span>
            <strong>{stats[key]}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}
