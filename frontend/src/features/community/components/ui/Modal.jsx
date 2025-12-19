import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Modal = ({ isOpen, onClose, title, children, className, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col',
          sizeClasses[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const ModalHeader = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10', className)}>
    {children}
  </div>
);

export const ModalBody = ({ children, className }) => (
  <div className={cn('p-6', className)}>{children}</div>
);

export const ModalFooter = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3', className)}>
    {children}
  </div>
);
