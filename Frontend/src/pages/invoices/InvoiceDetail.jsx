import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Calendar, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

import invoiceService from '../../services/invoiceService';
import CreditScoreGauge from '../analytics/CreditScoreGauge';
import RiskReport from '../analytics/RiskReport';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allInvoices = await invoiceService.getAll();
        const found = allInvoices.find(inv => inv._id === id);

        if (found) {
          setInvoice(found);
        } else {
          navigate('/invoices');
        }
      } catch (error) {
        console.error("Failed to fetch invoice details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) return <Loader fullScreen />;
  if (!invoice) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/invoices')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Invoice #{invoice.invoiceNumber}
              <Badge variant={invoice.financingStatus}>
                {invoice.financingStatus.toUpperCase()}
              </Badge>
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Issued to <span className="font-medium text-gray-900">{invoice.buyerName}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {invoice.pdfUrl && (
            <a
              href={`http://localhost:5000/${invoice.pdfUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="secondary" className="gap-2">
                <ExternalLink className="w-4 h-4" /> View PDF
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(invoice.invoiceAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Issue Date</p>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {format(new Date(invoice.issueDate), 'dd MMM yyyy')}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Due Date</p>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {format(new Date(invoice.dueDate), 'dd MMM yyyy')}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Financed Amt</p>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <Wallet className="w-4 h-4 text-gray-400" />
                  {invoice.financedAmount ? formatCurrency(invoice.financedAmount) : '-'}
                </div>
              </div>
            </div>
          </Card>

          <Card className={clsx(
            "border-l-4",
            invoice.financingStatus === 'approved' ? "border-l-primary" : "border-l-red-500"
          )}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Financing Decision</h3>
            <p className="text-gray-700 mb-4">
              {invoice.decisionNotes?.length > 0
                ? invoice.decisionNotes.join(' ')
                : "Analysis complete. Review the credit score and risk factors."}
            </p>

            {invoice.financingStatus === 'pending' && (
              <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                This invoice is currently under manual review.
              </div>
            )}
            {invoice.financingStatus === 'rejected' && (
              <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg text-sm">
                Financing cannot be offered for this invoice due to high risk factors.
              </div>
            )}
            {invoice.financingStatus === 'approved' && (
              <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg text-sm font-medium">
                Approved! You can receive up to {formatCurrency(invoice.financedAmount)} for this invoice.
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="flex flex-col items-center">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider w-full text-left mb-2">
              Buyer Credit Score
            </h3>
            <CreditScoreGauge
              score={invoice.creditScore}
              grade={invoice.creditGrade}
            />
          </Card>

          <RiskReport invoice={invoice} />
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetail;