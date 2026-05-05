import { Clock3 } from "lucide-react";

const actionText = {
  created: "created",
  updated: "updated",
  completed: "completed",
  deleted: "deleted"
};

const formatTime = (dateValue) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(dateValue));

export default function ActivityTimeline({ activities }) {
  return (
    <section className="activity-panel">
      <div className="section-title">
        <Clock3 size={18} />
        <h2>Recent activity</h2>
      </div>
      {activities?.length ? (
        <div className="activity-list">
          {activities.map((activity) => (
            <article className={`activity-item ${activity.action}`} key={activity.id}>
              <span />
              <div>
                <strong>
                  {activity.user?.name || "User"} {actionText[activity.action]} "{activity.taskTitle}"
                </strong>
                <small>
                  {activity.category} • {formatTime(activity.createdAt)}
                </small>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state compact">No activity yet.</div>
      )}
    </section>
  );
}
