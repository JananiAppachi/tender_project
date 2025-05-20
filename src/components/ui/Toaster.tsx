import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const Toaster = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 w-full sm:w-auto max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

const ToastItem = ({ 
  toast: { id, title, description, variant = 'info', duration = 5000 }, 
  onRemove 
}: { 
  toast: Toast; 
  onRemove: (id: string) => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const variants = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      classes: 'border-l-4 border-emerald-500 bg-emerald-50'
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      classes: 'border-l-4 border-red-500 bg-red-50'
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      classes: 'border-l-4 border-blue-500 bg-blue-50'
    }
  };

  return (
    <div
      className={`p-4 rounded-md shadow-md flex items-start animate-slideUp ${variants[variant].classes}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">{variants[variant].icon}</div>
      <div className="flex-1 mr-2">
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toaster;