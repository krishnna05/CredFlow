import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

const InputField = ({
  label,
  error,
  icon: Icon,
  className,
  type = "text",
  helperText,
  ...props
}) => {
  return (
    <div className={clsx("w-full group", className)}>
      <div className="flex justify-between items-baseline mb-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
      </div>

      <div className="relative">
        <input
          type={type}
          className={clsx(
            "w-full py-2.5 rounded-lg border text-sm transition-all duration-200 outline-none shadow-sm",
            "placeholder:text-slate-400",
            error
              ? "border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10",
            // FIX: Explicitly toggle padding. If Icon exists, force pl-10 (40px). If not, use standard px-3.
            Icon ? "pl-10 pr-3" : "px-3"
          )}
          {...props}
        />

        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={clsx("h-4 w-4 transition-colors", error ? "text-red-400" : "text-slate-400 group-focus-within:text-indigo-600")} />
          </div>
        )}

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      )}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;