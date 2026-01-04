import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Check, FileCheck } from 'lucide-react';
import { clsx } from 'clsx';

const FileUpload = ({ file, setFile, error }) => {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  if (file) {
    return (
      <div className="relative group bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
            <FileCheck className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
            
            {/* Fake progress bar to look "techy" */}
            <div className="mt-3 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-full animate-pulse"></div>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-indigo-600 font-medium uppercase tracking-wide">
              <Check className="w-3 h-3" /> Ready for analysis
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={clsx(
          "relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out cursor-pointer",
          isDragActive
            ? "border-indigo-500 bg-indigo-50/50"
            : error
              ? "border-red-300 bg-red-50/30"
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <div className={clsx(
            "p-3 rounded-full mb-3 transition-colors",
            isDragActive ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
          )}>
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">
              PDF (max. 5MB)
            </p>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;