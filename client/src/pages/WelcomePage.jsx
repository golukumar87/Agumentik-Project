import { useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardCheck, Radio, ShieldCheck, Trophy } from "lucide-react";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className="welcome-shell">
      <section className="welcome-panel">
        <div className="brand-mark welcome-mark">
          <ClipboardCheck size={36} />
        </div>
        <p className="eyebrow">Real-time productivity management system</p>
        <h1>Productivity Manager</h1>
        <p className="welcome-copy">
          Manage tasks, track progress, view real-time updates and analyze productivity from one clean mini SaaS
          workspace.
        </p>
        <div className="welcome-feature-row">
          <span>
            <ShieldCheck size={17} />
            JWT auth
          </span>
          <span>
            <Radio size={17} />
            Socket.io live
          </span>
          <span>
            <Trophy size={17} />
            Smart insights
          </span>
        </div>
        <button className="primary-button welcome-button" onClick={() => navigate("/auth")} type="button">
          Let's start
          <ArrowRight size={19} />
        </button>
      </section>
    </main>
  );
}
