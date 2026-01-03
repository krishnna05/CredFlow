import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

const SelectBox = ({
  label,
  options = [],
  error,
  placeholder = "Select an option",
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
        <select
          className={clsx(
            "w-full px-4 py-2.5 rounded-xl border appearance-none transition-all duration-200 outline-none text-sm bg-white",
            error
              ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-200 text-gray-900 hover:border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent",
            "disabled:bg-gray-50 disabled:text-gray-500"
          )}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectBox;