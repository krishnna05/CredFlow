import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import API from "../services/api";
import { 
  FileText, 
  Wallet, 
  Bell, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  CheckCircle2,
  Activity
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 'logout' removed as it's not used here anymore

  useEffect(() => {
    API.get("/invoices")
      .then((res) => {
        setInvoices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  // KPI Calculations
  const totalInvoices = invoices.length;
  const totalFinanced = invoices.reduce((sum, inv) => sum + (inv.financedAmount || 0), 0);
  const totalExposure = invoices.reduce((sum, inv) => sum + (inv.financingStatus === "approved" ? (inv.financedAmount || 0) : 0), 0);
  const defaults = invoices.filter((inv) => inv.repaymentStatus === "defaulted").length;

  const formatCurrency = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumSignificantDigits: 3 }).format(val);
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

  return (
    // Added padding container to replace the removed .main-scroll-area styling
    <div style={{ padding: "32px 48px" }}>
        <header className="page-header">
            <div className="header-title">
                <h1>Business Overview</h1>
                <p>Real-time financial intelligence & risk monitoring</p>
            </div>
            <div className="header-controls">
                <div className="search-wrapper">
                    <Search size={16} className="search-icon"/>
                    <input type="text" placeholder="Search invoices..." />
                </div>
                <div className="date-filter">
                    <span>Last 30 Days</span>
                    <ChevronDown size={14} />
                </div>
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="indicator-dot" />
                </button>
            </div>
        </header>

        {/* KPI Section */}
        <section className="kpi-row">
            <div className="kpi-card">
                <div className="kpi-top">
                    <div className="icon-boxHZ green"><FileText size={20} /></div>
                    <span className="trend positive">+12% <ArrowUpRight size={14}/></span>
                </div>
                <div className="kpi-val">
                    <span className="label">Total Invoices</span>
                    <span className="value">{totalInvoices}</span>
                </div>
            </div>

            <div className="kpi-card">
                <div className="kpi-top">
                    <div className="icon-boxHZ teal"><TrendingUp size={20} /></div>
                    <span className="trend positive">+5.2% <ArrowUpRight size={14}/></span>
                </div>
                <div className="kpi-val">
                    <span className="label">Total Financed</span>
                    <span className="value highlight-teal">{formatCurrency(totalFinanced)}</span>
                </div>
            </div>

            <div className="kpi-card">
                <div className="kpi-top">
                    <div className="icon-box blue"><Wallet size={20} /></div>
                    <span className="trend neutral">0% <ArrowUpRight size={14}/></span>
                </div>
                <div className="kpi-val">
                    <span className="label">Total Exposure</span>
                    <span className="value highlight-blue">{formatCurrency(totalExposure)}</span>
                </div>
            </div>

            <div className="kpi-card">
                <div className="kpi-top">
                    <div className="icon-box red"><AlertTriangle size={20} /></div>
                    <span className="trend negative">{defaults > 0 ? `+${defaults}` : "0"} <ArrowUpRight size={14}/></span>
                </div>
                <div className="kpi-val">
                    <span className="label">Defaults</span>
                    <span className="value highlight-red">{defaults}</span>
                </div>
            </div>
        </section>

        <div className="dashboard-grid">
            {/* INVOICE TABLE */}
            <div className="grid-main panel-container">
                <div className="panel-header">
                    <h3>Recent Invoices</h3>
                    <button className="link-btn">View All</button>
                </div>
                
                <div className="table-wrapper">
                    <table className="saas-table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Risk & Grade</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center">Loading data...</td></tr>
                            ) : invoices.length === 0 ? (
                                <tr><td colSpan="6" className="text-center">No invoices found.</td></tr>
                            ) : (
                                invoices.map(inv => (
                                <tr key={inv._id}>
                                    <td className="col-primary">
                                        <span className="inv-id">{inv.invoiceNumber}</span>
                                        <span className="inv-sub">{inv.customer || "Client"}</span>
                                    </td>
                                    <td className="col-date">{formatDate(inv.createdAt || inv.invoiceDate)}</td>
                                    <td className="col-amount">{formatCurrency(inv.invoiceAmount)}</td>
                                    <td>
                                        <div className="risk-cell">
                                            {inv.creditGrade ? (
                                                <span className={`grade-tag grade-${inv.creditGrade}`}>{inv.creditGrade}</span>
                                            ) : (
                                                <span className="grade-tag disable">-</span>
                                            )}
                                            {inv.fraudStatus === 'suspected' ? (
                                                <span className="badge-fraud">FRAUD SUSPECT</span>
                                            ) : (
                                                <span className="risk-text">{inv.riskLevel ? `${inv.riskLevel} Risk` : "Analyzing..."}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill status-${(inv.repaymentStatus || inv.financingStatus || 'pending').toLowerCase()}`}>
                                            {inv.financingStatus === 'approved' ? <CheckCircle2 size={12}/> : <Activity size={12}/>}
                                            <span>{inv.financingStatus || "Pending"}</span>
                                        </span>
                                    </td>
                                    <td className="col-action"><button className="action-btn"><MoreHorizontal size={16} /></button></td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="grid-side">
                <div className="ai-widget glow-border">
                    <div className="widget-header">
                        <span className="ai-emoji">🤖</span>
                        <h4>CredFlow Intelligence</h4>
                    </div>
                    <div className="widget-body">
                        <p>AI analysis active. Real-time risk scoring running on {invoices.length} invoices.</p>
                        <div className="ai-placeholder-visual">
                            <div className="ai-load-bar"></div>
                            <div className="ai-text-line" style={{width: '70%'}}></div>
                            <div className="ai-text-line" style={{width: '40%'}}></div>
                        </div>
                    </div>
                </div>

                <div className="system-widget panel-container">
                    <div className="widget-header">
                        <h4>System Health</h4>
                        <span className="health-badge">98% Optimal</span>
                    </div>
                    <div className="health-track"><div className="track-fill" style={{width: '98%'}}></div></div>
                    <div className="health-meta"><span>API Latency</span><span>24ms</span></div>
                </div>
            </aside>
        </div>
    </div>
  );
}