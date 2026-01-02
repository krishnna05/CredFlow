import React, { useState, useEffect } from "react";
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  UploadCloud,
  Lock
} from "lucide-react";
import "./Invoices.css";
import RiskBadge from "../components/RiskBadge";
import FraudBadge from "../components/FraudBadge";
// import API from "../services/api"; 

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    clientName: "",
    amount: "",
    dueDate: "",
    file: null
  });

  // --- MOCK DATA (Updated with Fraud Scenarios) ---
  useEffect(() => {
    setInvoices([
      { 
        _id: "1", client: "Acme Corp", amount: 12000, due: "2025-02-15", 
        status: "Approved", invoiceNumber: "INV-001", 
        riskLevel: "LOW", fraudStatus: "clean" 
      },
      { 
        _id: "2", client: "Globex Inc", amount: 4500, due: "2025-01-20", 
        status: "Financed", invoiceNumber: "INV-002", 
        riskLevel: "LOW", fraudStatus: "clean" 
      },
      { 
        _id: "3", client: "Soylent Corp", amount: 890000, due: "2025-03-01", 
        status: "Blocked", invoiceNumber: "INV-003", 
        riskLevel: "HIGH", fraudStatus: "flagged" // Flagged due to amount spike
      },
      { 
        _id: "4", client: "Initech", amount: 20000, due: "2025-04-10", 
        status: "Blocked", invoiceNumber: "INV-001", // Duplicate ID
        riskLevel: "HIGH", fraudStatus: "fraud" 
      },
      { 
        _id: "5", client: "Umbrella Corp", amount: 15000, due: "2024-12-10", 
        status: "Repaid", invoiceNumber: "INV-004", 
        riskLevel: "LOW", fraudStatus: "clean" 
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    console.log("Uploading:", formData);
    // Add logic to send to backend here
    setIsUploadOpen(false);
  };

  // --- HELPER: Lifecycle Status Badge ---
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <span className="badge badge-pending"><Clock size={12}/> Pending</span>;
      case "Approved": return <span className="badge badge-approved"><CheckCircle size={12}/> Approved</span>;
      case "Financed": return <span className="badge badge-financed"><DollarSign size={12}/> Financed</span>;
      case "Blocked": return <span className="badge badge-rejected"><Lock size={12}/> Blocked</span>;
      case "Rejected": return <span className="badge badge-rejected"><XCircle size={12}/> Rejected</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  // --- HELPER: Action Buttons (The Logic Core) ---
  const renderActions = (inv) => {
    // 🛑 BLOCKING LOGIC: If Fraud or Flagged, DISABLE everything
    if (inv.fraudStatus === "fraud" || inv.fraudStatus === "flagged") {
      return (
        <button className="btn-action disabled" disabled title="Action Blocked by Risk Engine">
          <Lock size={12} /> Blocked
        </button>
      );
    }

    // Normal Flow
    switch (inv.status) {
      case "Pending":
        return <button className="btn-action secondary" disabled>⏳ Processing</button>;
      case "Approved":
        return <button className="btn-action primary">💸 Get Financed</button>;
      case "Financed":
        return <button className="btn-action outline">📄 View Loan</button>;
      case "Repaid":
        return <span className="text-muted">✅ Completed</span>;
      case "Rejected":
        return <button className="btn-action danger">View Reason</button>;
      default:
        return <span className="text-muted">-</span>;
    }
  };

  return (
    <div className="invoices-page">
      <header className="page-header">
        <div>
          <h1>Invoice Management</h1>
          <p className="subtitle">Risk & Fraud Analysis Active</p>
        </div>
        <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
          <Plus size={18} /> Upload Invoice
        </button>
      </header>

      <div className="table-container">
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Risk Assessment</th> {/* Merged Column */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td className="font-mono">{inv.invoiceNumber}</td>
                <td className="font-bold">{inv.client}</td>
                <td>${inv.amount.toLocaleString()}</td>
                <td>{inv.due}</td>
                <td>
                  <div className="badge-row" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    {/* Show Fraud Badge FIRST - Hierarchy Rule */}
                    <FraudBadge status={inv.fraudStatus} />
                    {/* Show Risk Badge only if not Fraud (or always, per design choice) */}
                    {inv.fraudStatus === 'clean' && <RiskBadge level={inv.riskLevel} />}
                  </div>
                </td>
                <td>{getStatusBadge(inv.status)}</td>
                <td>{renderActions(inv)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {invoices.length === 0 && (
            <div className="empty-state">
                <FileText size={48} opacity={0.2} />
                <p>No invoices found. Upload one to get started.</p>
            </div>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {isUploadOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Upload Invoice</h2>
              <button className="close-btn" onClick={() => setIsUploadOpen(false)}><XCircle size={24}/></button>
            </div>
            
            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label>Invoice File (Image/PDF)</label>
                <div className="file-upload-box">
                    <UploadCloud size={24} />
                    <span>Click to upload or drag and drop</span>
                    <input type="file" required onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                    <label>Invoice Number</label>
                    <input name="invoiceNumber" placeholder="e.g. INV-2025-001" required onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Client Name</label>
                    <input name="clientName" placeholder="Client Company" required onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                    <label>Amount ($)</label>
                    <input name="amount" type="number" placeholder="0.00" required onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Due Date</label>
                    <input name="dueDate" type="date" required onChange={handleInputChange} />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsUploadOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Upload & Analyze</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}