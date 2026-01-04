import clsx from 'clsx';
import { getStatusColor } from '../../utils/riskColorMap';

const Badge = ({ children, variant, className, outline = false }) => {
  const statusKey = variant || (typeof children === 'string' ? children : 'DEFAULT');
  const colors = getStatusColor(statusKey);
  const bgClass = colors?.bg || 'bg-gray-100';
  const textClass = colors?.text || 'text-gray-700';
  const borderClass = colors?.border || 'border-gray-200';

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all shadow-sm',
        outline 
          ? `bg-transparent border ${borderClass} ${textClass}` 
          : `${bgClass} ${textClass} border border-transparent`,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;