import React, { useState, useEffect } from "react";
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Eye, 
  UploadCloud 
} from "lucide-react";
import "./Invoices.css";
import API from "../services/api"; 

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    clientName: "",
    amount: "",
    dueDate: "",
    file: null
  });

  useEffect(() => {
    setInvoices([
      { _id: "1", client: "Acme Corp", amount: 12000, due: "2025-02-15", status: "Approved", invoiceNumber: "INV-001", risk: "Low" },
      { _id: "2", client: "Globex Inc", amount: 4500, due: "2025-01-20", status: "Financed", invoiceNumber: "INV-002", risk: "Low" },
      { _id: "3", client: "Soylent Corp", amount: 8900, due: "2025-03-01", status: "Pending", invoiceNumber: "INV-003", risk: "Medium" },
      { _id: "4", client: "Umbrella Corp", amount: 15000, due: "2024-12-10", status: "Repaid", invoiceNumber: "INV-004", risk: "Low" },
      { _id: "5", client: "Initech", amount: 20000, due: "2025-04-10", status: "Rejected", invoiceNumber: "INV-005", risk: "High" },
    ]);
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    console.log("Uploading to Cloudinary:", formData);
    
    const newInv = {
      _id: Date.now(),
      client: formData.clientName,
      amount: parseFloat(formData.amount),
      due: formData.dueDate,
      status: "Pending",
      invoiceNumber: formData.invoiceNumber,
      risk: "Calculating..."
    };
    setInvoices([newInv, ...invoices]);
    setIsUploadOpen(false);
  };

  // --- HELPER: Lifecycle Status Badge ---
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <span className="badge badge-pending"><Clock size={12}/> Pending</span>;
      case "Approved": return <span className="badge badge-approved"><CheckCircle size={12}/> Approved</span>;
      case "Financed": return <span className="badge badge-financed"><DollarSign size={12}/> Financed</span>;
      case "Repaid": return <span className="badge badge-repaid"><CheckCircle size={12}/> Repaid</span>;
      case "Rejected": return <span className="badge badge-rejected"><XCircle size={12}/> Rejected</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  // --- HELPER: Action Buttons based on Status ---
  const renderActions = (inv) => {
    switch (inv.status) {
      case "Pending":
        return <button className="btn-action secondary" disabled>⏳ Under Review</button>;
      case "Approved":
        return <button className="btn-action primary">💸 Request Financing</button>;
      case "Financed":
        return <button className="btn-action outline">📄 View Loan</button>;
      case "Repaid":
        return <span className="text-muted">✅ Completed</span>;
      case "Rejected":
        return <button className="btn-action danger">View Reason</button>;
      default:
        return null;
    }
  };

  return (
    <div className="invoices-page">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Invoice Management</h1>
          <p className="subtitle">Upload, track, and finance your invoices.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
          <Plus size={18} /> Upload Invoice
        </button>
      </header>

      {/* MAIN TABLE */}
      <div className="table-container">
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Risk</th>
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
                  <span className={`risk-dot ${inv.risk?.toLowerCase()}`}></span> 
                  {inv.risk}
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