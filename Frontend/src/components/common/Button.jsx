import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
  primary: 'bg-primary text-white hover:bg-gray-800 focus:ring-gray-900',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200',
  accent: 'bg-accent text-primary font-medium hover:bg-[#c2e340] focus:ring-[#d1f34b]',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  className,
  disabled,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={twMerge(
        'relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;