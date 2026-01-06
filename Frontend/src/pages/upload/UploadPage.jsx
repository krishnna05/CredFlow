import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, Building2, Hash, ReceiptIndianRupee,
  ChevronRight, Home, UploadCloud, FileText,
  AlertCircle, ChevronDown, Loader2, X, Crown,
  Calendar, Clock, FileType, User, CreditCard, Plus, Trash2, Calculator
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import FileUpload from '../../components/form/FileUpload';
import InputField from '../../components/form/InputField';
import invoiceService from '../../services/invoiceService';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

const SectionHeader = ({ title, icon: Icon, subtitle }) => (
  <div className="flex items-start gap-3 mb-6 pb-4 border-b border-slate-100">
    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shadow-sm shrink-0">
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error, icon: Icon, disabled }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-slate-400" />}
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-slate-50 border ${
          error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200'
        } rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:border-indigo-400 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <option value="" disabled>Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
    </div>
    {error && <p className="text-xs text-red-500 ml-1 font-medium">{error}</p>}
  </div>
);

// --- Main Component ---

export default function UploadPage() {
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [showPdfPremiumAlert, setShowPdfPremiumAlert] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    poNumber: '',
    date: '',
    dueDate: '',
    paymentStatus: 'pending',
    vendorName: '',
    vendorTaxId: '',
    buyerName: '',
    buyerTaxId: '',
    amount: '',
    taxAmount: '',
    paymentTerms: '',
    category: '',
    lineItems: [
      { id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    description: '' 
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // -- Handlers --

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    setFile(selectedFile);
    setErrors({});
    
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    if (selectedFile.type === 'application/pdf') {
      setShowPdfPremiumAlert(true);
      toast.success("PDF attached. Manual entry required.", { icon: '📄' });
    } else if (selectedFile.type.startsWith('image/')) {
      setShowPdfPremiumAlert(false);
      await processImageOCR(selectedFile);
    } else {
      toast.error("Unsupported file format.");
      removeFile();
    }
  };

  const processImageOCR = async (imageFile) => {
    setOcrLoading(true);
    try {
      toast.loading("Analyzing invoice image...", { id: 'ocr' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockExtracted = {
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
        poNumber: `PO-${Math.floor(Math.random() * 1000)}`,
        amount: "12500.00",
        taxAmount: "2250.00",
        date: new Date().toISOString().split('T')[0],
        vendorName: "Tech Solutions Pvt Ltd",
        buyerName: "Acme Corp",
        category: "services"
      };

      setFormData(prev => ({ ...prev, ...mockExtracted }));
      toast.success("Details auto-filled via FreeOCR!", { id: 'ocr' });
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("Could not read text. Please fill manually.", { id: 'ocr' });
    } finally {
      setOcrLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setShowPdfPremiumAlert(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // -- Line Item Handlers --

  const handleLineItemChange = (id, field, value) => {
    setFormData(prev => {
      const updatedItems = prev.lineItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = (parseFloat(updatedItem.quantity || 0) * parseFloat(updatedItem.rate || 0)).toFixed(2);
          }
          return updatedItem;
        }
        return item;
      });
      return { ...prev, lineItems: updatedItems };
    });
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0 }
      ]
    }));
  };

  const removeLineItem = (id) => {
    if (formData.lineItems.length === 1) return; 
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  // -- Submit --

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.invoiceNumber) newErrors.invoiceNumber = "Required";
    if (!formData.amount) newErrors.amount = "Required";
    if (!formData.date) newErrors.date = "Required";
    if (!formData.vendorName) newErrors.vendorName = "Required";
    if (!file) {
      toast.error("Please upload an invoice document");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('invoiceData', JSON.stringify(formData));

      await invoiceService.uploadInvoice(data);
      
      toast.success("Invoice successfully submitted!");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[117.65%] h-full origin-top-left transform scale-[0.85]">
      
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-8 pb-10">
        
        {/* Breadcrumbs */}
        <nav className="flex mb-8 overflow-x-auto whitespace-nowrap pb-2 md:pb-0" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 px-1">
            <li className="inline-flex items-center">
              <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-200 hover:text-indigo-600 transition-colors">
                <Home size={20} className="mr-2" />
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight size={18} className="text-slate-300" />
                <Link to="/invoices" className="ml-1 text-sm font-medium text-slate-200 hover:text-indigo-600 md:ml-2 transition-colors">Finance</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight size={18} className="text-slate-300" />
                <span className="ml-1 text-sm font-semibold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full md:ml-2">New Invoice</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* --- LEFT COLUMN: Upload Area --- */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
              <SectionHeader 
                title="Document Upload" 
                subtitle="Supported: PDF, JPG, PNG" 
                icon={UploadCloud} 
              />

              {!file ? (
                <div className="h-64">
                  <FileUpload 
                    file={file}
                    setFile={handleFileChange}
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpeg', '.jpg']
                    }}
                    error={errors.file}
                  />
                </div>
              ) : (
                // -- File Preview Card --
                <div className="relative group rounded-xl overflow-hidden border-2 border-indigo-100 bg-slate-50 transition-all hover:shadow-md">
                  <button
                    onClick={removeFile}
                    type="button"
                    className="absolute top-3 right-3 p-2 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-full shadow-sm z-20 transition-all"
                    title="Remove File"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>

                  <div className="flex flex-col items-center">
                    {file.type.startsWith('image/') ? (
                      <div className="relative w-full h-56 bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img src={previewUrl} alt="Invoice" className="w-full h-full object-contain" />
                        {ocrLoading && (
                          <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center text-indigo-600 z-10">
                            <Loader2 className="animate-spin mb-3 text-indigo-500" size={32} />
                            <span className="text-sm font-bold tracking-wide animate-pulse">EXTRACTING DATA...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center text-slate-400 gap-3 border-b border-slate-100">
                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                          <FileText size={48} className="text-red-500" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">PDF Document</span>
                      </div>
                    )}

                    <div className="w-full p-4 bg-white border-t border-slate-100">
                      <p className="text-sm font-bold text-slate-800 truncate" title={file.name}>{file.name}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                        <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span className="uppercase font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px] tracking-wide">
                          {file.type.split('/')[1]}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {showPdfPremiumAlert && (
              <div className="relative overflow-hidden rounded-xl border border-orange-200/60 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-5 shadow-sm ring-1 ring-orange-100">
                <div className="flex gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl text-white shadow-lg shadow-orange-200 h-fit shrink-0">
                    <Crown size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Premium Feature</h4>
                    <p className="text-xs leading-relaxed text-slate-600 mb-3">
                      Manual entry required for PDF. Upgrade to <span className="font-bold text-orange-600">Pro</span> for auto-extraction.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: Form Data (8 cols) --- */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
              
              <div className="p-6 md:p-10 space-y-10 flex-grow">
                
                {/* 1. Invoice Basics */}
                <div>
                  <SectionHeader 
                    title="General Information" 
                    subtitle="Key dates and identifiers" 
                    icon={Hash} 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField 
                      label="Invoice Number"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. INV-001"
                      icon={Hash}
                      error={errors.invoiceNumber}
                      disabled={ocrLoading}
                    />
                    <InputField 
                      label="PO Number"
                      name="poNumber"
                      value={formData.poNumber}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      icon={FileText}
                      disabled={ocrLoading}
                    />
                    <SelectField
                      label="Payment Status"
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleInputChange}
                      icon={CreditCard}
                      options={[
                        { value: 'paid', label: 'Paid' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'overdue', label: 'Overdue' },
                        { value: 'draft', label: 'Draft' }
                      ]}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <InputField 
                      label="Invoice Date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      icon={Calendar}
                      error={errors.date}
                      disabled={ocrLoading}
                    />
                    <InputField 
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      icon={Clock}
                      disabled={ocrLoading}
                    />
                  </div>
                </div>

                {/* 2. Entities (Vendor & Buyer) */}
                <div>
                  <SectionHeader 
                    title="Entities Involved" 
                    subtitle="Vendor and Buyer details" 
                    icon={Building2} 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Vendor Column */}
                    <div className="space-y-4 p-5 bg-slate-50/50 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Vendor Details</h4>
                      <InputField 
                        label="Vendor Name"
                        name="vendorName"
                        value={formData.vendorName}
                        onChange={handleInputChange}
                        icon={Building2}
                        error={errors.vendorName}
                        className="bg-white"
                        disabled={ocrLoading}
                      />
                      <InputField 
                        label="Vendor Tax ID / GSTIN"
                        name="vendorTaxId"
                        value={formData.vendorTaxId}
                        onChange={handleInputChange}
                        icon={FileType}
                        className="bg-white"
                        disabled={ocrLoading}
                      />
                    </div>

                    {/* Buyer Column */}
                    <div className="space-y-4 p-5 bg-slate-50/50 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Buyer Details</h4>
                      <InputField 
                        label="Buyer Name"
                        name="buyerName"
                        value={formData.buyerName}
                        onChange={handleInputChange}
                        icon={User}
                        className="bg-white"
                        disabled={ocrLoading}
                      />
                      <InputField 
                        label="Buyer Tax ID / GSTIN"
                        name="buyerTaxId"
                        value={formData.buyerTaxId}
                        onChange={handleInputChange}
                        icon={FileType}
                        className="bg-white"
                        disabled={ocrLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Line Items */}
                <div>
                  <SectionHeader 
                    title="Line Items" 
                    subtitle="Products or services billed" 
                    icon={FileText} 
                  />
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    
                    {/* Responsive Table Wrapper */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm min-w-[600px] md:min-w-0">
                        <thead className="bg-slate-100 text-slate-500 font-medium border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 w-1/2">Description</th>
                            <th className="px-4 py-3 w-20">Qty</th>
                            <th className="px-4 py-3 w-28">Rate</th>
                            <th className="px-4 py-3 w-28 text-right">Amount</th>
                            <th className="px-2 py-3 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {formData.lineItems.map((item, index) => (
                            <tr key={item.id} className="group bg-white hover:bg-slate-50/50">
                              <td className="p-2 pl-4">
                                <input
                                  type="text"
                                  placeholder="Item description"
                                  value={item.description}
                                  onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                                  className="w-full bg-transparent border-0 focus:ring-0 p-0 text-sm placeholder:text-slate-400 font-medium text-slate-700"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-indigo-500 outline-none text-slate-700"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={item.rate}
                                  onChange={(e) => handleLineItemChange(item.id, 'rate', e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-right focus:ring-1 focus:ring-indigo-500 outline-none text-slate-700"
                                />
                              </td>
                              <td className="p-2 pr-4 text-right font-mono text-slate-600">
                                {item.amount || '0.00'}
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeLineItem(item.id)}
                                  className="text-slate-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-indigo-100"
                    >
                      <Plus size={14} /> Add Line Item
                    </button>
                  </div>
                </div>

                {/* 4. Financials */}
                <div>
                  <SectionHeader 
                    title="Financial Details" 
                    subtitle="Amounts, taxes, and terms" 
                    icon={Calculator} 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      label="Expense Category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      icon={FileText}
                      options={[
                        { value: 'inventory', label: 'Inventory / COGS' },
                        { value: 'technology', label: 'Software & Technology' },
                        { value: 'marketing', label: 'Marketing & Advertising' },
                        { value: 'professional', label: 'Professional Services' },
                        { value: 'utilities', label: 'Utilities & Rent' },
                        { value: 'other', label: 'Other Expenses' }
                      ]}
                    />
                    <SelectField
                      label="Payment Terms"
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleInputChange}
                      icon={Clock}
                      options={[
                        { value: 'immediate', label: 'Due on Receipt' },
                        { value: 'net15', label: 'Net 15 Days' },
                        { value: 'net30', label: 'Net 30 Days' },
                        { value: 'net45', label: 'Net 45 Days' },
                        { value: 'net60', label: 'Net 60 Days' }
                      ]}
                    />
                    
                    <InputField 
                      label="Total Tax Amount (₹)"
                      name="taxAmount"
                      type="number"
                      value={formData.taxAmount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      icon={ReceiptIndianRupee}
                    />

                    <InputField 
                      label="Total Amount (₹)"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      icon={ReceiptIndianRupee}
                      error={errors.amount}
                      className="font-bold text-slate-900"
                    />
                  </div>
                  
                  {/* Description Field */}
                  <div className="mt-6">
                    <label className="text-xs font-bold text-slate-700 ml-1 mb-1.5 block flex items-center gap-1.5">
                      <FileText size={12} className="text-slate-400" />
                      Description / Notes
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                      placeholder="Add any additional context about this invoice..."
                      disabled={ocrLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 md:px-10 py-5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-0 mt-auto">
                <button
                  type="button"
                  onClick={() => setIsDiscardModalOpen(true)}
                  className="w-full md:w-auto px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-all"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading || ocrLoading}
                  className="w-full md:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Processing...' : 'Submit Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Discard Modal */}
        <Modal
          isOpen={isDiscardModalOpen}
          onClose={() => setIsDiscardModalOpen(false)}
          title="Discard Changes?"
        >
          <div className="space-y-4">
            <p className="text-slate-600 text-sm">
              Are you sure you want to leave? Any data entered will be permanently lost.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsDiscardModalOpen(false)}>Keep Editing</Button>
              <Button className="bg-red-600 text-white hover:bg-red-700 border-red-600" onClick={() => navigate('/dashboard')}>Discard & Exit</Button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}