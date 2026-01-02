import React, { useEffect, useState } from "react";
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  PieChart,
  DollarSign,
  Info
} from "lucide-react";
import "./Financing.css";

export default function Financing() {
  const [invoices, setInvoices] = useState([]);

  // Calculator State
  const [calcAmount, setCalcAmount] = useState(100000);
  const [advancePercent, setAdvancePercent] = useState(80);
  const [tenure, setTenure] = useState(30);

  useEffect(() => {
    // Dummy data source
    setInvoices([
        { _id: 1, invoiceNumber: "INV-001", business: "TechFlow Sys", dueDate: "2025-02-15", amount: 50000, status: "approved", financingStatus: "pending" },
        { _id: 2, invoiceNumber: "INV-002", business: "Global Corp", dueDate: "2025-03-01", amount: 120000, status: "approved", financingStatus: "financed", financedAmount: 96000, repaymentAmount: 98000, repaymentDate: "2025-04-01" },
        { _id: 3, invoiceNumber: "INV-003", business: "Alpha Retail", dueDate: "2025-02-20", amount: 75000, status: "approved", financingStatus: "pending" },
        { _id: 4, invoiceNumber: "INV-004", business: "Beta Logistics", dueDate: "2025-02-25", amount: 200000, status: "approved", financingStatus: "pending" }
    ]);
  }, []);

  const eligibleInvoices = invoices.filter(
    (inv) => inv.status === "approved" && inv.financingStatus !== "financed"
  );

  const activeFinancing = invoices.filter(
    (inv) => inv.financingStatus === "financed"
  );

  // Calculations
  const calculatedDisbursed = Math.round(calcAmount * (advancePercent / 100));
  const platformFee = Math.round(calculatedDisbursed * 0.02);
  const repaymentAmount = calculatedDisbursed + platformFee;

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumSignificantDigits: 10
  }).format(amount);

  return (
    <div className="finance-container">
      
      {/* 1. HEADER & HERO STATS */}
      <header className="header-cluster">
        <div className="header-titles">
          <h1>Financing Center</h1>
          <p>Manage your working capital and invoice discounting.</p>
        </div>
        {/* Date or other meta could go here */}
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header"><DollarSign size={14} /> Available Limit</div>
          <div className="stat-value highlight">₹50,00,000</div>
        </div>
        <div className="stat-card">
          <div className="stat-header"><PieChart size={14} /> Utilization</div>
          <div className="stat-value">12.5%</div>
        </div>
        <div className="stat-card">
          <div className="stat-header"><TrendingUp size={14} /> Active Loans</div>
          <div className="stat-value">{activeFinancing.length}</div>
        </div>
      </div>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: DATA TABLES (70% Width) */}
        <main className="content-area">
          
          {/* Section: Eligible Invoices */}
          <section>
            <div className="section-title">
              <CheckCircle size={18} className="icon-accent" />
              <span>Eligible for Financing</span>
              <span className="counter-badge">{eligibleInvoices.length}</span>
            </div>

            <div className="table-panel">
              {eligibleInvoices.length === 0 ? (
                <div className="empty-state">No invoices available for financing.</div>
              ) : (
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th width="30%">Invoice Details</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>You Get (80%)</th>
                      <th style={{textAlign: 'right'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleInvoices.map((inv) => (
                      <tr key={inv._id}>
                        <td>
                          <div className="cell-group">
                            <span className="text-bold">{inv.invoiceNumber}</span>
                            <span className="text-sub">{inv.business}</span>
                          </div>
                        </td>
                        <td className="text-sub">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="mono-price">{formatCurrency(inv.amount)}</td>
                        <td className="mono-price" style={{color: 'var(--accent-primary)'}}>
                          {formatCurrency(inv.amount * 0.8)}
                        </td>
                        <td style={{textAlign: 'right'}}>
                          <button 
                            className="btn-ghost"
                            onClick={() => {
                              setCalcAmount(inv.amount);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            Simulate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Section: Active Loans */}
          <section>
            <div className="section-title">
              <Clock size={18} className="icon-blue" />
              <span>Active Repayments</span>
            </div>

            <div className="table-panel">
              {activeFinancing.length === 0 ? (
                <div className="empty-state">No active loans currently.</div>
              ) : (
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Invoice Ref</th>
                      <th>Disbursed</th>
                      <th>Repayment Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeFinancing.map((inv) => (
                      <tr key={inv._id}>
                        <td className="text-bold">{inv.invoiceNumber}</td>
                        <td className="mono-price">{formatCurrency(inv.financedAmount)}</td>
                        <td className="mono-price">{formatCurrency(inv.repaymentAmount)}</td>
                        <td className="text-sub">{new Date(inv.repaymentDate).toLocaleDateString()}</td>
                        <td>
                          <span className="status-pill blue">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>

        {/* RIGHT COLUMN: SIMULATOR (30% Width, Sticky) */}
        <aside className="sticky-sidebar">
          <div className="calc-panel">
            <div className="panel-header">
              <Calculator size={20} className="icon-accent"/> 
              <span>Cost Simulator</span>
            </div>

            <div className="form-group">
              <label>Invoice Value</label>
              <div className="input-container">
                <span className="input-prefix">₹</span>
                <input 
                  type="number" 
                  className="dark-input"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="row-2">
              <div className="form-group">
                <label>Advance %</label>
                <select 
                  className="dark-select"
                  value={advancePercent}
                  onChange={(e) => setAdvancePercent(Number(e.target.value))}
                >
                  <option value={70}>70%</option>
                  <option value={80}>80%</option>
                  <option value={90}>90%</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tenure</label>
                <select 
                  className="dark-select"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                >
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>
            </div>

            <div className="calc-summary">
              <span className="summary-label">Disbursal Amount</span>
              <span className="summary-value">{formatCurrency(calculatedDisbursed)}</span>
              
              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Platform Fee (2%)</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
                <div className="breakdown-row final">
                  <span>Total Repayment</span>
                  <span>{formatCurrency(repaymentAmount)}</span>
                </div>
              </div>
            </div>

            <button className="btn-cta">
              Get Financing <ArrowRight size={18}/>
            </button>
            
            <div style={{marginTop: '16px', display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)'}}>
              <Info size={14} style={{minWidth: '14px'}}/>
              <p style={{margin:0}}>Rates are estimated based on your current credit profile tier.</p>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}