import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Building2, Hash, ReceiptIndianRupee, ChevronRight, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';

import FileUpload from '../../components/form/FileUpload';
import InputField from '../../components/form/InputField';
import invoiceService from '../../services/invoiceService';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    buyerName: '',
    invoiceAmount: '',
    issueDate: '',
    dueDate: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!file) newErrors.file = "Invoice document is required";
    if (!formData.invoiceNumber) newErrors.invoiceNumber = "Invoice number is required";
    if (!formData.buyerName) newErrors.buyerName = "Buyer name is required";
    if (!formData.issueDate) newErrors.issueDate = "Issue date is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (!formData.invoiceAmount || Number(formData.invoiceAmount) <= 0) {
      newErrors.invoiceAmount = "Valid amount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const data = new FormData();
      data.append('file', file);
      // Append other fields...
      Object.keys(formData).forEach(key => data.append(key, formData[key]));

      await invoiceService.upload(data);
      toast.success('Invoice uploaded successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to upload invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX: Changed bg-slate-50 to bg-[#F0F4FF] (Light Indigo Tint)
    <div className="min-h-screen bg-[#F6F8FF]">
      {/* Decorative Technical Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <button onClick={() => navigate('/dashboard')} className="hover:text-slate-800 transition-colors">
              <Home className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="font-medium text-slate-900">Upload Invoice</span>
          </nav>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Upload New Invoice</h1>
              <p className="text-slate-500 mt-1 text-sm">Upload your invoice details for AI-powered credit assessment.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: File Upload (The Primary Action) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900">Document</h3>
                <p className="text-xs text-slate-500 mt-0.5">PDF format required</p>
              </div>
              <div className="p-5">
                <FileUpload file={file} setFile={setFile} error={errors.file} />
                
                {/* Micro-helper text */}
                <div className="mt-4 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 flex gap-3">
                  <div className="mt-0.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-900">AI Auto-Extraction</p>
                    <p className="text-[11px] text-indigo-700 leading-relaxed mt-0.5">
                      Our system will attempt to cross-reference the uploaded file with the details provided.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Metadata Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-200">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-sm font-bold text-slate-900">Invoice Details</h3>
                 <p className="text-xs text-slate-500 mt-0.5">Manually verify the extracted information</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField
                    label="Invoice Number"
                    placeholder="e.g. INV-2024-001"
                    icon={Hash}
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    error={errors.invoiceNumber}
                  />
                  <InputField
                    label="Buyer Name"
                    placeholder="Client Company Name"
                    icon={Building2}
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    error={errors.buyerName}
                  />
                </div>

                <div className="border-t border-slate-100 my-4"></div>

                <div className="grid sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-1">
                    <InputField
                      label="Total Amount"
                      type="number"
                      placeholder="0.00"
                      icon={ReceiptIndianRupee}
                      value={formData.invoiceAmount}
                      onChange={(e) => setFormData({ ...formData, invoiceAmount: e.target.value })}
                      error={errors.invoiceAmount}
                      helperText="Include all taxes"
                    />
                  </div>
                  <InputField
                    label="Issue Date"
                    type="date"
                    icon={Calendar}
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    error={errors.issueDate}
                  />
                  <InputField
                    label="Due Date"
                    type="date"
                    icon={Calendar}
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    error={errors.dueDate}
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex items-center justify-end gap-3">
                 <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow focus:ring-4 focus:ring-indigo-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
                  {loading ? 'Processing...' : 'Analyze & Upload'}
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadPage;