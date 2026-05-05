import { Activity, BarChart3, CheckCircle2, Trophy } from "lucide-react";

export default function InsightsPanel({ insights }) {
  const categories = insights.categoryDistribution || [];
  const completedByUser = insights.completedByUser || [];
  const maxCategoryCount = Math.max(1, ...categories.map((item) => item.count));

  return (
    <section className="insights-layout">
      <article className="insight-summary">
        <div className="section-title">
          <Trophy size={18} />
          <h2>Productivity insights</h2>
        </div>
        <div className="insight-list">
          <div>
            <CheckCircle2 size={18} />
            <span>{insights.productivityInsights.completedTodayText}</span>
          </div>
          <div>
            <Activity size={18} />
            <span>{insights.activity.dailyActivityCount} activity updates today</span>
          </div>
          <div>
            <BarChart3 size={18} />
            <span>Most active category: {insights.productivityInsights.mostActiveCategory}</span>
          </div>
        </div>
      </article>

      <article className="category-panel">
        <div className="section-title">
          <BarChart3 size={18} />
          <h2>Category distribution</h2>
        </div>
        {categories.length ? (
          <div className="category-list">
            {categories.map((item) => (
              <div className="category-row" key={item.category}>
                <div className="category-label">
                  <span>{item.category}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="bar-track">
                  <div style={{ width: `${(item.count / maxCategoryCount) * 100}%` }} />
                </div>
                <small>{item.completed} completed</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state compact">No category activity yet.</div>
        )}
      </article>

      <article className="user-panel">
        <div className="section-title">
          <CheckCircle2 size={18} />
          <h2>Completed per user</h2>
        </div>
        {completedByUser.length ? (
          <div className="user-list">
            {completedByUser.map((item) => (
              <div className="user-row" key={item.userId || item.email}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.email}</span>
                </div>
                <b>{item.completed}</b>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state compact">No completed tasks yet.</div>
        )}
      </article>
    </section>
  );
}
