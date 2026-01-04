import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const variants = {
  primary: 'bg-primary text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-primary/20 focus:ring-gray-900 border border-transparent',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-100 shadow-sm',
  accent: 'bg-accent text-primary font-bold hover:bg-[#c2e340] hover:shadow-[0_0_15px_rgba(209,243,75,0.4)] focus:ring-[#d1f34b] border border-transparent',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 border border-transparent',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
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
        'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;