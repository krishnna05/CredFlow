import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, FileText, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import invoiceService from '../../services/invoiceService';
import InvoiceRow from './components/InvoiceRow';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Calculate Quick Stats for the Header
  const stats = useMemo(() => {
    const totalAmount = invoices.reduce((acc, inv) => acc + (inv.invoiceAmount || 0), 0);
    const financedAmount = invoices
      .filter(inv => inv.financingStatus === 'approved')
      .reduce((acc, inv) => acc + (inv.invoiceAmount || 0), 0);
    const pendingCount = invoices.filter(inv => inv.financingStatus === 'pending').length;

    return { totalAmount, financedAmount, pendingCount };
  }, [invoices]);

  const filteredInvoices = invoices.filter(inv => 
    inv.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Invoices</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Manage uploaded invoices, track approvals, and view risk insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none w-48 transition-all hover:border-gray-300"
            />
          </div>
          <Button variant="secondary" className="h-8 px-3 text-xs gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filters
          </Button>
          <Button onClick={() => navigate('/upload')} className="h-8 px-3 text-xs gap-1.5 shadow-lg shadow-primary/20">
            <Plus className="w-3.5 h-3.5" /> New Invoice
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Value</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Financed</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.financedAmount)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Approval</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900">{stats.pendingCount} <span className="text-xs font-normal text-gray-400">Invoices</span></div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {invoices.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">No invoices found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Upload your first invoice to get started.</p>
            <Button onClick={() => navigate('/upload')} size="sm">Upload Now</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {/* Vibrant High Contrast Header */}
                <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
                  <th className="py-3 pl-5 pr-3 w-1/4 rounded-tl-lg">Invoice / Buyer</th>
                  <th className="px-3 py-3 w-1/6">Dates</th>
                  <th className="px-3 py-3 w-1/6">Amount</th>
                  <th className="px-3 py-3 w-1/6">Risk Analysis</th>
                  <th className="px-3 py-3 w-1/6">Status</th>
                  <th className="py-3 pl-3 pr-5 text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.length > 0 ? (
                   filteredInvoices.map((invoice) => (
                    <InvoiceRow key={invoice._id} invoice={invoice} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-xs text-gray-500">
                      No matching invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;