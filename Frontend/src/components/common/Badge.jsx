import clsx from 'clsx';
import { getStatusColor } from '../../utils/riskColorMap';

const Badge = ({ children, variant, className }) => {
  const statusKey = variant || (typeof children === 'string' ? children : 'DEFAULT');
  const colors = getStatusColor(statusKey);

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;