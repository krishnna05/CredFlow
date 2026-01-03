import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import FileUpload from '../../components/form/FileUpload';
import InputField from '../../components/form/InputField';
import Button from '../../components/common/Button';
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
    if (!file) newErrors.file = "Please upload an invoice PDF";
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
      data.append('invoiceNumber', formData.invoiceNumber);
      data.append('buyerName', formData.buyerName);
      data.append('invoiceAmount', formData.invoiceAmount);
      data.append('issueDate', formData.issueDate);
      data.append('dueDate', formData.dueDate);

      await invoiceService.upload(data);

      toast.success('Invoice uploaded & analyzed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to upload invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Upload Invoice</h1>
          <p className="text-gray-500 mt-1">
            Upload your invoice PDF to receive an instant AI credit assessment.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                1. Invoice Document
              </h3>
              <FileUpload
                file={file}
                setFile={setFile}
                error={errors.file}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                2. Invoice Details
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <InputField
                  label="Invoice Number"
                  placeholder="INV-2024-001"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  error={errors.invoiceNumber}
                />
                <InputField
                  label="Buyer Name"
                  placeholder="Client Company Name"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  error={errors.buyerName}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <InputField
                    label="Amount (₹)"
                    type="number"
                    placeholder="0.00"
                    value={formData.invoiceAmount}
                    onChange={(e) => setFormData({ ...formData, invoiceAmount: e.target.value })}
                    error={errors.invoiceAmount}
                  />
                </div>
                <InputField
                  label="Issue Date"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  error={errors.issueDate}
                />
                <InputField
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  error={errors.dueDate}
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-8">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Analyze & Upload
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;