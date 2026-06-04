import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  ShieldCheck,
  Clock,
  Smartphone,
  Shield,
  TrendingUp,
  Activity,
  Award,
  Star,
} from "lucide-react";

const stats = [
  { label: "Doctors", value: "50+", sub: "Verified practitioners" },
  { label: "Patients", value: "1000+", sub: "Active patients" },
  { label: "Reviews", value: "500+", sub: "Verified patient reviews", accent: true },
];

const featurePills = [
  { icon: ShieldCheck, label: "Trusted Facilities" },
  { icon: Clock, label: "Round-the-Clock Care" },
  { icon: Smartphone, label: "Simple Coordination" },
  { icon: Shield, label: "Private Rooms" },
];

export default function Hero() {
  return (
    <section id="home" className="hero-shell">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
        @keyframes countUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .hero-shell {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #040a18;
        }

        .fi1 { opacity: 0; animation: fadeIn 1.2s ease forwards .2s; }
        .fu1 { opacity: 0; animation: fadeUp .8s cubic-bezier(.16,1,.3,1) forwards .15s; }
        .fu2 { opacity: 0; animation: fadeUp .8s cubic-bezier(.16,1,.3,1) forwards .32s; }
        .fu3 { opacity: 0; animation: fadeUp .8s cubic-bezier(.16,1,.3,1) forwards .48s; }
        .fu4 { opacity: 0; animation: fadeUp .8s cubic-bezier(.16,1,.3,1) forwards .62s; }
        .fu5 { opacity: 0; animation: fadeUp .8s cubic-bezier(.16,1,.3,1) forwards .75s; }
        .fu6 { opacity: 0; animation: fadeUp .8s cubic-bezier(.16,1,.3,1) forwards .88s; }

        .stat-in { opacity: 0; animation: countUp .6s cubic-bezier(.16,1,.3,1) forwards; }
        .s1 { animation-delay: .7s; }
        .s2 { animation-delay: .82s; }
        .s3 { animation-delay: .94s; }
        .s4 { animation-delay: 1.06s; }

        .hero-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 64px 32px 72px;
          max-width: 860px;
          margin: 0 auto;
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 18px;
          border-radius: 999px;
          border: 1px solid rgba(6,182,212,.4);
          background: rgba(6,182,212,.12);
          color: #67e8f9;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 28px;
          backdrop-filter: blur(10px);
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22d3ee;
          flex-shrink: 0;
          animation: blink 1.5s ease-in-out infinite;
        }

        .hero-title {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -2px;
          margin-bottom: 0;
          max-width: 780px;
        }

        .hero-gradient {
          display: inline;
          background: linear-gradient(100deg, #22d3ee 0%, #818cf8 50%, #c084fc 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradMove 4s ease infinite;
        }

        .hero-subtitle {
          font-size: 16px;
          color: #94a3b8;
          line-height: 1.8;
          max-width: 520px;
          margin: 24px 0 0;
        }

        .pill-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 28px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.07);
          font-size: 12px;
          color: #cbd5e1;
          backdrop-filter: blur(8px);
          transition: background .2s, transform .2s, border-color .2s;
        }

        .pill:hover { background: rgba(255,255,255,.13); transform: translateY(-1px); border-color: rgba(255,255,255,.24); }
        .pill-icon { font-size: 13px; color: #38bdf8; }

        .button-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
          margin-top: 36px;
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
          padding: 14px 34px;
          border-radius: 14px;
          background: linear-gradient(135deg, #06b6d4, #2563eb, #7c3aed);
          background-size: 200% auto;
          animation: gradMove 3s ease infinite;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          letter-spacing: .3px;
          transition: transform .25s, box-shadow .25s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 16px 40px rgba(6,182,212,.5); }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
          background-size: 200% auto;
          animation: shimmer 2.2s linear infinite;
        }

        .btn-ghost {
          padding: 14px 28px;
          border-radius: 14px;
          border: 1.5px solid rgba(255,255,255,.25);
          background: rgba(255,255,255,.08);
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: all .2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-ghost:hover { background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.4); transform: translateY(-2px); }

        .social-proof {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .avatar-stack { display: flex; }
        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          margin-right: -9px;
        }

        .stars { display: flex; gap: 2px; }

        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
          margin: 44px 0 36px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          width: 100%;
        }

        .stat-card {
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 18px;
          padding: 20px 18px;
          backdrop-filter: blur(16px);
          transition: background .2s, transform .2s;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #06b6d4, #6366f1);
          opacity: .8;
        }

        .stat-card:hover { background: rgba(255,255,255,.12); transform: translateY(-3px); }
        .stat-label {
          font-size: 10px;
          color: #64748b;
          font-weight: 700;
          letter-spacing: .8px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -1px;
          line-height: 1;
        }

        .stat-meta {
          font-size: 11px;
          margin-top: 6px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .stat-meta.accent { color: #22c55e; }
        .stat-meta.primary { color: #22d3ee; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .hero-content { padding: 48px 18px 56px; }
          .hero-title { letter-spacing: -1px; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="absolute inset-0">
        <img
          className="fi1 absolute inset-0 h-full w-full object-cover"
          src="https://media.istockphoto.com/id/1448093779/photo/young-multiracial-doctor-having-fun-with-little-girl-on-wheelchair.jpg?s=1024x1024&w=is&k=20&c=l8nXFK6rDuXlsh_7Yo0Q2_--m-PfqFNxD0bdQD6oOhM="
          alt="Doctor with a patient in a wheelchair"
        />

        <div className="absolute inset-0 bg-[rgba(4,10,24,.72)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,6,18,.6)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#040a18] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[rgba(4,10,24,.5)] to-transparent" />
        <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,.22)_0%,transparent_65%)]" />
        <div className="absolute -bottom-16 -right-16 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="hero-content">
        <div className="fu1 live-badge">
          <span className="live-dot" />
          Trusted by Hospitals Worldwide
        </div>

        <h1 className="fu2 hero-title">
          Hospital Care
          <span className="hero-gradient"> with Precision and Scale</span>
          <br />for Better Outcomes
        </h1>

        <p className="fu3 hero-subtitle">
          A modern hospital brand focused on dependable operations, coordinated care, and smooth service
          across every department.
        </p>

        <div className="fu4 pill-row">
          {featurePills.map((pill) => {
            const Icon = pill.icon;
            return (
              <span key={pill.label} className="pill">
                <Icon size={13} className="pill-icon" />
                {pill.label}
              </span>
            );
          })}
        </div>

        <div className="fu5 button-row">
          <Link to="/signup" className="btn-primary">
            View Services <ArrowRight size={15} />
          </Link>
        </div>

        <div className="fu5 social-proof">
          <div className="avatar-stack">
            <div className="avatar" style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>D</div>
            <div className="avatar" style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>A</div>
            <div className="avatar" style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}>R</div>
          </div>
          <span style={{ fontSize: 13, color: "#64748b" }}>
            <span style={{ color: "#cbd5e1", fontWeight: 600 }}>1000+ Patients</span>
          </span>
          <div style={{ width: 8 }} />
          <div className="stars">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={13} color="#f59e0b" fill="#f59e0b" />
            ))}
          </div>
          <span style={{ fontSize: 12, color: "#475569" }}>4.9 / 5.0</span>
          <span style={{ width: 12 }} />
          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>500 Reviews</span>
        </div>

        <div className="fu6 divider" />

        <div className="fu6 stats-grid">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`stat-card stat-in s${index + 1}`}>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-meta ${stat.accent ? "accent" : "primary"}`}>
                {stat.accent ? <Activity size={11} /> : <TrendingUp size={11} />}
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="fu6" style={{ width: "100%", height: 1 }} />

        <div className="fu6" style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.1)",
              background: "rgba(255,255,255,.05)",
              color: "#cbd5e1",
              fontSize: 12,
              backdropFilter: "blur(10px)",
            }}
          >
            <Award size={14} color="#38bdf8" /> ISO 27001 Certified
          </div>
        </div>
      </div>
    </section>
  );
}