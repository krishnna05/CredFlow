import { useNavigate } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

const InvoiceRow = ({ invoice }) => {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/invoices/${invoice._id}`)}
      className="group hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
    >
      <td className="py-4 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{invoice.buyerName}</p>
            <p className="text-xs text-gray-500">#{invoice.invoiceNumber}</p>
          </div>
        </div>
      </td>

      <td className="px-3 py-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">{formatDate(invoice.issueDate)}</span>
          <span className="text-xs text-gray-500">Due: {formatDate(invoice.dueDate)}</span>
        </div>
      </td>

      <td className="px-3 py-4">
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(invoice.invoiceAmount)}
        </p>
      </td>

      <td className="px-3 py-4">
        <Badge variant={invoice.riskLevel}>
          {invoice.riskLevel || 'ANALYZING'}
        </Badge>
      </td>

      <td className="px-3 py-4">
        <Badge variant={invoice.financingStatus}>
          {invoice.financingStatus === 'approved' ? 'FINANCED' : invoice.financingStatus.toUpperCase()}
        </Badge>
      </td>

      <td className="py-4 pl-3 pr-6 text-right">
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors inline-block" />
      </td>
    </tr>
  );
};

export default InvoiceRow;