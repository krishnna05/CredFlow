import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, AlertTriangle, Activity, Lock, Eye, Ban, Download, Search, Filter 
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend 
} from "recharts";
import RiskBadge from "../components/RiskBadge";
import FraudBadge from "../components/FraudBadge";
import "./RiskFraud.css";

// --- MOCK DATA ---
const MOCK_DATA = [
  { id: "INV-2091", business: "K-Tech Innovations", amount: 125000, risk: "HIGH", fraud: "clean", flags: [] },
  { id: "INV-2093", business: "Vertex Solutions", amount: 850000, risk: "HIGH", fraud: "flagged", flags: ["AMOUNT_SPIKE"] }, 
  { id: "INV-2091", business: "K-Tech Innovations", amount: 125000, risk: "HIGH", fraud: "fraud", flags: ["DUPLICATE_ID"] }, 
  { id: "INV-2095", business: "Oceanic Trade", amount: 12000, risk: "LOW", fraud: "clean", flags: [] },
  { id: "INV-2096", business: "Rapid Build", amount: 300000, risk: "MEDIUM", fraud: "clean", flags: [] },
  { id: "INV-2097", business: "Solaris Inc", amount: 2000000, risk: "HIGH", fraud: "flagged", flags: ["AMOUNT_SPIKE", "NEW_BUSINESS"] },
];

export default function RiskFraud() {
  const [invoices, setInvoices] = useState(MOCK_DATA);
  const [stats, setStats] = useState({ exposure: 0, highRisk: 0, fraud: 0, flagged: 0 });

  useEffect(() => {
    const high = invoices.filter(i => i.risk === "HIGH").length;
    const fraudCount = invoices.filter(i => i.fraud === "fraud").length;
    const flaggedCount = invoices.filter(i => i.fraud === "flagged").length;
    const exp = invoices.reduce((acc, curr) => acc + curr.amount, 0);
    
    setStats({ exposure: exp, highRisk: high, fraud: fraudCount, flagged: flaggedCount });
  }, [invoices]);

  const chartData = [
    { name: "Clean", value: invoices.filter(i => i.fraud === "clean").length, color: "#10b981" },
    { name: "Flagged", value: invoices.filter(i => i.fraud === "flagged").length, color: "#f59e0b" },
    { name: "Fraud", value: invoices.filter(i => i.fraud === "fraud").length, color: "#ef4444" },
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

  return (
    <div className="risk-dashboard">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Risk & Fraud Monitor</h1>
          <div className="status-badge">
            <span className="dot pulse"></span> Live Monitoring
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Download size={16}/> Export</button>
          <button className="btn btn-primary"><Activity size={16}/> System Check</button>
        </div>
      </header>

      {/* KPI GRID */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue"><Activity size={20}/></div>
          <div>
              <label>Total Exposure</label>
              <h3>{formatCurrency(stats.exposure)}</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon red"><Ban size={20}/></div>
          <div>
              <label>Confirmed Fraud</label>
              <h3>{stats.fraud}</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orange"><ShieldAlert size={20}/></div>
          <div>
              <label>Flagged / Suspicious</label>
              <h3>{stats.flagged}</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon gray"><AlertTriangle size={20}/></div>
          <div>
              <label>High Risk Invoices</label>
              <h3>{stats.highRisk}</h3>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <div className="content-grid">
        
        {/* LEFT COLUMN: VISUALS */}
        <div className="left-column">
          <div className="panel chart-panel">
            <div className="panel-header">
              <h4>Distribution</h4>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie 
                    data={chartData} 
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "6px", fontSize: "12px" }}
                    itemStyle={{ color: "#e5e7eb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="panel alerts-panel">
            <div className="panel-header">
              <h4><ShieldAlert size={16}/> Live Alerts</h4>
            </div>
            <div className="alert-list">
              {invoices.filter(i => i.flags.length > 0).map((inv, idx) => (
                <div key={idx} className={`alert-item ${inv.fraud === 'fraud' ? 'critical' : 'warning'}`}>
                  <div className="alert-icon">
                    {inv.fraud === 'fraud' ? <Ban size={14} /> : <AlertTriangle size={14} />}
                  </div>
                  <div className="alert-content">
                    <span className="alert-title">{inv.flags[0].replace('_', ' ')}</span>
                    <span className="alert-desc">{inv.id} • {inv.business}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TABLE */}
        <div className="panel table-panel">
          <div className="panel-header space-between">
            <h4>Suspicious Activity Watchlist</h4>
            <div className="table-actions">
              <button className="icon-btn"><Search size={16}/></button>
              <button className="icon-btn"><Filter size={16}/></button>
            </div>
          </div>
          <div className="table-container">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Invoice Details</th>
                  <th>Status</th>
                  <th>Risk Flags</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.filter(i => i.fraud !== 'clean').map((inv, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="cell-group">
                          <span className="primary-text">{inv.id}</span>
                          <span className="sub-text">{inv.business}</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        <FraudBadge status={inv.fraud} />
                      </div>
                    </td>
                    <td>
                      <div className="flags-row">
                          {inv.flags.map(f => (
                          <span key={f} className="flag-pill">
                              {f.replace('_', ' ')}
                          </span>
                          ))}
                      </div>
                    </td>
                    <td>
                      <div className="action-row right">
                          <button className="btn-icon danger" title="Block"><Lock size={14}/></button>
                          <button className="btn-icon" title="View"><Eye size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}