import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

const InputField = ({
  label,
  error,
  icon: Icon,
  className,
  ...props
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          className={clsx(
            "w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none text-sm",
            "disabled:bg-gray-50 disabled:text-gray-500",
            error
              ? "border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent",
            Icon && "pl-10"
          )}
          {...props}
        />

        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={clsx("h-5 w-5", error ? "text-red-400" : "text-gray-400")} />
          </div>
        )}

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;