import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Filter, 
  Search, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  X,
  Check
} from 'lucide-react';
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
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const stats = useMemo(() => {
    const totalAmount = invoices.reduce((acc, inv) => acc + (inv.invoiceAmount || 0), 0);
    const financedAmount = invoices
      .filter(inv => inv.financingStatus === 'approved')
      .reduce((acc, inv) => acc + (inv.invoiceAmount || 0), 0);
    const pendingCount = invoices.filter(inv => inv.financingStatus === 'pending').length;

    return { totalAmount, financedAmount, pendingCount };
  }, [invoices]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'ALL' || 
      inv.financingStatus?.toUpperCase() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      <div className="relative bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 shadow-xl border border-indigo-900/50">
        
        <div className="relative p-5 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Invoices</h1>
              <p className="text-indigo-200 mt-1 text-xs max-w-lg font-medium">
                Manage uploaded invoices, track financing approvals, and view real-time risk insights.
              </p>
            </div>

            {/* Compact Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search buyer or invoice #" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-indigo-900/50 border border-indigo-800/50 rounded-lg text-white placeholder-indigo-400 focus:bg-indigo-900/80 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-800/50 focus:outline-none transition-all w-full md:w-56 shadow-sm"
                />
              </div>

              {/* Filter Button */}
              <div className="relative z-50" ref={filterRef}>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`h-8 px-3 flex items-center gap-1.5 text-xs font-semibold rounded-lg border transition-all shadow-sm ${
                    filterStatus !== 'ALL' 
                      ? 'bg-white text-indigo-900 border-white hover:bg-indigo-50' 
                      : 'bg-indigo-900/50 text-indigo-200 border-indigo-800/50 hover:bg-indigo-900/80'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {filterStatus === 'ALL' ? 'Filter' : filterStatus}
                  {filterStatus !== 'ALL' && (
                    <X 
                      className="w-3 h-3 ml-1 p-0.5 rounded-full bg-indigo-100 text-indigo-900 hover:bg-indigo-200" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterStatus('ALL');
                      }}
                    />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-indigo-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
                      Filter Status
                    </div>
                    {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setIsFilterOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between transition-colors"
                      >
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                        {filterStatus === status && <Check className="w-3 h-3 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate('/upload')} 
                className="h-8 px-4 flex items-center gap-1.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-lg shadow-md transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> New Invoice
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-0">
            {/* Card 1 */}
            <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-800/50 rounded-xl p-3 hover:bg-indigo-900/60 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-200 rounded-md">
                   <DollarSign className="w-3.5 h-3.5" />
                </div>
                <span className="text-indigo-200/80 text-[10px] font-bold uppercase tracking-wider">Total Value</span>
              </div>
              <div className="text-lg font-bold text-white pl-1">{formatCurrency(stats.totalAmount)}</div>
            </div>

            {/* Card 2 */}
            <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-800/50 rounded-xl p-3 hover:bg-indigo-900/60 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-400/20 text-emerald-300 rounded-md">
                   <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="text-indigo-200/80 text-[10px] font-bold uppercase tracking-wider">Financed</span>
              </div>
              <div className="text-lg font-bold text-white pl-1">{formatCurrency(stats.financedAmount)}</div>
            </div>

            {/* Card 3 */}
            <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-800/50 rounded-xl p-3 hover:bg-indigo-900/60 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-amber-400/20 text-amber-300 rounded-md">
                   <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-indigo-200/80 text-[10px] font-bold uppercase tracking-wider">Pending</span>
              </div>
              
              <div className="flex items-baseline gap-1.5 pl-1 text-white">
                <span className="text-lg font-bold">{stats.pendingCount}</span>
                <span className="text-xs font-medium text-indigo-300/80">Invoices</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card  */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {invoices.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">No invoices found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Upload your first invoice to get started.</p>
            <Button onClick={() => navigate('/upload')} size="sm">Upload Now</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                  <th className="py-3 pl-5 pr-3 w-1/4">Invoice / Buyer</th>
                  <th className="px-3 py-3 w-1/6">Dates</th>
                  <th className="px-3 py-3 w-1/6">Amount</th>
                  <th className="px-3 py-3 w-1/6">Risk Analysis</th>
                  <th className="px-3 py-3 w-1/6">Status</th>
                  <th className="py-3 pl-3 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInvoices.length > 0 ? (
                   filteredInvoices.map((invoice) => (
                    <InvoiceRow key={invoice._id} invoice={invoice} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Search className="w-6 h-6 mb-2 opacity-50" />
                        <p className="text-xs font-medium">No matches found.</p>
                        <button 
                          onClick={() => {setSearchTerm(''); setFilterStatus('ALL');}}
                          className="mt-1 text-[10px] text-indigo-600 font-bold hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
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