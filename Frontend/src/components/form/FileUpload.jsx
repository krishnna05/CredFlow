import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Check, FileCheck, AlertCircle, Crown, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

const FileUpload = ({ file, setFile, error, accept }) => {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    multiple: false,
  });

  const isPdf = file?.type === 'application/pdf';
  const isImage = file?.type.startsWith('image/');

  return (
    <div className="w-full" style={{ zoom: '80%' }}>
      {file ? (
        <div className="relative group bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 w-full">
          <div className="flex items-start gap-4">
            {/* File Type Icon */}
            <div className={clsx(
              "p-3 rounded-lg border shrink-0",
              isPdf ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
            )}>
              {isPdf ? <FileText className="w-6 h-6" /> : <FileCheck className="w-6 h-6" />}
            </div>

            {/* Content Info */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-slate-900 truncate pr-2">{file.name}</p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all p-1 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}</p>

              {/* Conditional Impressive Messages - Responsive Layout */}
              <div className="mt-4 w-full">
                {isPdf && (
                  <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-lg flex flex-col sm:flex-row items-start gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <div className="p-1.5 bg-white rounded-full text-amber-600 shrink-0 shadow-sm ring-1 ring-amber-100 mt-0.5 hidden sm:block">
                      <Crown className="w-4 h-4" />
                    </div>
                    {/* Mobile icon version (inline) */}
                    <div className="sm:hidden flex items-center gap-2 mb-1">
                      <div className="p-1 bg-white rounded-full text-amber-600 shrink-0 shadow-sm ring-1 ring-amber-100">
                        <Crown className="w-3 h-3" />
                      </div>
                      <span className="text-sm font-bold text-amber-900">Premium OCR Required</span>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-amber-900 hidden sm:block">
                        Premium OCR Required
                      </h4>
                      <p className="text-xs text-amber-800 mt-0 sm:mt-1 leading-relaxed">
                        Advanced text extraction for PDF documents is available exclusively with an active <strong>Paid Subscription</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {isImage && (
                  <div className="p-3 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 border border-indigo-100/80 rounded-lg flex flex-col sm:flex-row items-start gap-3 shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <div className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-indigo-600 shrink-0 shadow-sm ring-1 ring-indigo-100 mt-0.5 hidden sm:block">
                      <Sparkles className="w-4 h-4 animate-[spin_3s_linear_infinite]" />
                    </div>
                     {/* Mobile icon version (inline) */}
                     <div className="sm:hidden flex items-center gap-2 mb-1">
                      <div className="p-1 bg-white/80 backdrop-blur-sm rounded-full text-indigo-600 shrink-0 shadow-sm ring-1 ring-indigo-100">
                        <Sparkles className="w-3 h-3 animate-[spin_3s_linear_infinite]" />
                      </div>
                      <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700">
                        AI Auto-Fill in Progress
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700 hidden sm:flex items-center gap-1">
                        AI Auto-Fill in Progress
                      </h4>
                      <p className="text-xs text-indigo-800 mt-0 sm:mt-1 leading-relaxed">
                        Our intelligent engine is actively analyzing this image to automatically extract data and fill the relevant fields.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div
            {...getRootProps()}
            className={clsx(
              "relative border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-300 ease-in-out cursor-pointer group overflow-hidden w-full",
              isDragActive
                ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]"
                : error
                  ? "border-red-300 bg-red-50/30"
                  : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50 hover:shadow-sm"
            )}
          >
            <input {...getInputProps()} />
            
            {/* Subtle background decoration */}
            <div className={clsx(
                "absolute inset-0 transition-opacity duration-300 pointer-events-none",
                isDragActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="relative flex flex-col items-center justify-center text-center z-10">
              <div className={clsx(
                "p-4 rounded-2xl mb-4 transition-all duration-300 shadow-sm",
                isDragActive ? "bg-indigo-100 text-indigo-600 scale-110" : "bg-white text-indigo-600 border border-slate-200 group-hover:border-indigo-200 group-hover:scale-105"
              )}>
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-semibold text-slate-900">
                  <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-slate-500">
                  PDF, JPG or PNG (max. 10MB)
                </p>
              </div>
            </div>
          </div>
          {error && (
            <p className="text-sm font-medium text-red-600 mt-3 flex items-center gap-2 animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;