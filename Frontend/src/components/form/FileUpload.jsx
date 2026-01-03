import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X } from 'lucide-react';
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
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
            <FileText className="w-5 h-5 text-red-500" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFile(null)}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-accent bg-accent/5"
            : error
              ? "border-red-300 bg-red-50 hover:bg-red-100"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-3 bg-white rounded-full shadow-sm mb-2">
            <UploadCloud className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">
            {isDragActive ? "Drop the PDF here" : "Click to upload invoice PDF"}
          </p>
          <p className="text-xs text-gray-500">
            PDF up to 5MB. Must be a valid tax invoice.
          </p>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;