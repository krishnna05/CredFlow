import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, FileText } from 'lucide-react';
import invoiceService from '../../services/invoiceService';
import InvoiceRow from './components/InvoiceRow';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await invoiceService.getAll();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your uploaded invoices and track financing status.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button onClick={() => navigate('/upload')} className="gap-2">
            <Plus className="w-4 h-4" /> New Invoice
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No invoices found</h3>
            <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
              Upload your first invoice to get an instant credit score analysis.
            </p>
            <Button onClick={() => navigate('/upload')}>Upload Invoice</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  <th className="py-3 pl-6 pr-3">Invoice / Buyer</th>
                  <th className="px-3 py-3">Dates</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Risk Analysis</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="py-3 pl-3 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <InvoiceRow key={invoice._id} invoice={invoice} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;