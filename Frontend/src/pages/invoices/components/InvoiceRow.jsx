import { useNavigate } from 'react-router-dom';
import { ChevronRight, Building2 } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

const InvoiceRow = ({ invoice }) => {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/invoices/${invoice._id}`)}
      className="group hover:bg-gray-50/80 transition-all duration-200 cursor-pointer border-b border-gray-50 last:border-0"
    >
      <td className="py-3 pl-5 pr-3">
        <div className="flex items-center gap-3">
          {/* Icon Box */}
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg group-hover:bg-white group-hover:text-primary group-hover:shadow-sm ring-1 ring-transparent group-hover:ring-gray-200 transition-all">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
              {invoice.buyerName}
            </span>
            <span className="text-[10px] font-medium text-gray-400 tracking-wide uppercase mt-0.5">
              #{invoice.invoiceNumber}
            </span>
          </div>
        </div>
      </td>

      <td className="px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-gray-700">{formatDate(invoice.issueDate)}</span>
          <span className="text-[10px] text-gray-400">Due: {formatDate(invoice.dueDate)}</span>
        </div>
      </td>

      <td className="px-3 py-3">
        <span className="text-sm font-bold text-gray-900 tracking-tight">
          {formatCurrency(invoice.invoiceAmount)}
        </span>
      </td>

      <td className="px-3 py-3">
        <Badge variant={invoice.riskLevel}>
          {invoice.riskLevel || 'ANALYZING'}
        </Badge>
      </td>

      <td className="px-3 py-3">
        <Badge variant={invoice.financingStatus} outline>
          {invoice.financingStatus === 'approved' ? 'FINANCED' : invoice.financingStatus.toUpperCase()}
        </Badge>
      </td>

      <td className="py-3 pl-3 pr-5 text-right">
        <button className="p-1.5 rounded-md text-gray-300 hover:text-primary hover:bg-gray-200 transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default InvoiceRow;