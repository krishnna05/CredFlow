import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Activity, 
  Lock,
  Eye,
  Ban
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import "./RiskFraud.css";

// --- MOCK DATA ---
const MOCK_INVOICES = [
  { id: "INV-2091", business: "K-Tech Innovations", amount: 125000, date: "2025-01-02", status: "blocked", paymentHistory: "poor" },
  { id: "INV-2092", business: "Apex Logistics", amount: 45000, date: "2025-01-02", status: "cleared", paymentHistory: "good" },
  { id: "INV-2093", business: "Vertex Solutions", amount: 850000, date: "2025-01-03", status: "review", paymentHistory: "average" }, // High amount
  { id: "INV-2091", business: "K-Tech Innovations", amount: 125000, date: "2025-01-03", status: "blocked", paymentHistory: "poor" }, // Duplicate ID
  { id: "INV-2095", business: "Oceanic Trade", amount: 12000, date: "2025-01-04", status: "cleared", paymentHistory: "good" },
  { id: "INV-2096", business: "Rapid Build", amount: 300000, date: "2025-01-04", status: "review", paymentHistory: "good" },
  { id: "INV-2097", business: "Solaris Inc", amount: 2000000, date: "2025-01-04", status: "blocked", paymentHistory: "new" }, // Spike
];

// --- RISK ENGINE LOGIC ---
const calculateRisk = (inv, allInvoices) => {
  let score = 0;
  const flags = [];

  // 1. Amount Spike Rule (> 500k is considered high for this segment)
  if (inv.amount > 500000) {
    score += 40;
    flags.push("AMOUNT_SPIKE");
  }

  // 2. Duplicate Invoice Rule
  const duplicates = allInvoices.filter(i => i.id === inv.id);
  if (duplicates.length > 1) {
    score += 50;
    if (!flags.includes("DUPLICATE_ID")) flags.push("DUPLICATE_ID");
  }

  // 3. History Rule
  if (inv.paymentHistory === "poor") score += 30;
  if (inv.paymentHistory === "new") score += 15;

  // 4. Status Rule
  if (inv.status === "blocked") score += 20;

  // Cap Score at 100
  score = Math.min(score, 100);

  // Determine Level
  let level = "LOW";
  if (score > 70) level = "HIGH";
  else if (score > 40) level = "MEDIUM";

  return { ...inv, riskScore: score, riskLevel: level, fraudFlags: flags };
};

export default function RiskFraud() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({ exposure: 0, highRiskCount: 0, fraudCount: 0, defaults: 0 });

  useEffect(() => {
    const processed = MOCK_INVOICES.map((inv) => calculateRisk(inv, MOCK_INVOICES));
    
    const highRisk = processed.filter(i => i.riskLevel === "HIGH");
    const fraud = processed.filter(i => i.fraudFlags.length > 0);
    
    setInvoices(processed);
    setStats({
      exposure: processed.reduce((sum, i) => sum + i.amount, 0),
      highRiskCount: highRisk.length,
      fraudCount: fraud.length,
      defaults: 2 
    });
  }, []);

  // --- CHART DATA ---
  const riskDistribution = [
    { name: "Low Risk", value: invoices.filter(i => i.riskLevel === "LOW").length, color: "#00D97E" },
    { name: "Medium Risk", value: invoices.filter(i => i.riskLevel === "MEDIUM").length, color: "#F2C94C" },
    { name: "High Risk", value: invoices.filter(i => i.riskLevel === "HIGH").length, color: "#FF4D4D" },
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

  return (
    <div className="risk-page">
      {/* HEADER */}
      <header className="risk-header">
        <div>
          <h1>Risk & Fraud Monitoring</h1>
          <p>Real-time intelligence • Rule Engine v2.1 active</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary"><Download size={16}/> Export Report</button>
          <button className="btn-primary"><Activity size={16}/> System Check</button>
        </div>
      </header>

      {/* KPI SUMMARY */}
      <section className="kpi-grid">
        <div className="kpi-card dark">
          <div className="kpi-icon blue"><Activity size={24} /></div>
          <div className="kpi-info">
            <label>Total Exposure</label>
            <h3>{formatCurrency(stats.exposure)}</h3>
          </div>
        </div>
        <div className="kpi-card dark">
          <div className="kpi-icon red"><AlertTriangle size={24} /></div>
          <div className="kpi-info">
            <label>High Risk Invoices</label>
            <h3>{stats.highRiskCount}</h3>
          </div>
        </div>
        <div className="kpi-card dark">
          <div className="kpi-icon orange"><ShieldAlert size={24} /></div>
          <div className="kpi-info">
            <label>Active Fraud Flags</label>
            <h3>{stats.fraudCount}</h3>
          </div>
        </div>
        <div className="kpi-card dark">
          <div className="kpi-icon gray"><Ban size={24} /></div>
          <div className="kpi-info">
            <label>Confirmed Defaults</label>
            <h3>{stats.defaults}</h3>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <div className="risk-content-grid">
        
        {/* LEFT: CHART & ALERTS */}
        <div className="risk-visuals">
          <div className="panel chart-panel">
            <h4>Risk Distribution</h4>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel alerts-panel">
            <h4><ShieldAlert size={16}/> Live Fraud Alerts</h4>
            <div className="alert-list">
              {invoices.filter(i => i.fraudFlags.includes("DUPLICATE_ID")).map((inv, idx) => (
                <div key={idx} className="alert-item high">
                  <AlertTriangle size={16} />
                  <div>
                    <span className="alert-title">Duplicate Invoice ID</span>
                    <span className="alert-desc">{inv.id} uploaded multiple times.</span>
                  </div>
                </div>
              ))}
              {invoices.filter(i => i.fraudFlags.includes("AMOUNT_SPIKE")).map((inv, idx) => (
                <div key={idx} className="alert-item medium">
                  <Activity size={16} />
                  <div>
                    <span className="alert-title">Abnormal Amount Spike</span>
                    <span className="alert-desc">{inv.business} posted {formatCurrency(inv.amount)}.</span>
                  </div>
                </div>
              ))}
              {stats.fraudCount === 0 && <p className="text-muted">No active alerts.</p>}
            </div>
          </div>
        </div>

        {/* RIGHT: TABLE */}
        <div className="panel table-panel">
          <div className="panel-header">
            <h4>High Risk Watchlist</h4>
            <div className="table-controls">
              <div className="search-box">
                <Search size={14} />
                <input type="text" placeholder="Search ID..." />
              </div>
              <button className="icon-btn"><Filter size={16}/></button>
            </div>
          </div>

          <table className="risk-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Score</th>
                <th>Flags</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .sort((a, b) => b.riskScore - a.riskScore) 
                .map((inv, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="cell-group">
                      <span className="font-mono">{inv.id}</span>
                      <span className="sub-text">{inv.business}</span>
                    </div>
                  </td>
                  <td>{formatCurrency(inv.amount)}</td>
                  <td>
                    <div className="score-badge-wrapper">
                      <span className={`score-badge ${inv.riskLevel.toLowerCase()}`}>
                        {inv.riskScore}
                      </span>
                      <div className="risk-bar">
                        <div 
                          className={`risk-fill ${inv.riskLevel.toLowerCase()}`} 
                          style={{ width: `${inv.riskScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {inv.fraudFlags.length > 0 ? (
                      <div className="flags-row">
                        {inv.fraudFlags.map(f => (
                          <span key={f} className="flag-icon" title={f}>
                            {f === "DUPLICATE_ID" ? "📄" : "📈"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="action-row">
                      <button className="btn-icon" title="View Details"><Eye size={16}/></button>
                      <button className="btn-icon danger" title="Block"><Lock size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}