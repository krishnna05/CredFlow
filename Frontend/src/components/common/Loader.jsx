import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const Loader = ({ size = 'medium', className, fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const spinner = (
    <Loader2
      className={clsx(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center p-4">{spinner}</div>;
};

export default Loader;