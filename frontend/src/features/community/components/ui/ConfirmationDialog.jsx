import { AlertTriangle, Info } from 'lucide-react';
import { Modal, ModalBody } from './Modal';
import { Button } from './Button';

export const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  icon = 'danger' 
}) => {
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalBody className="p-6 text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          icon === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {icon === 'danger' ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onClose} className="flex-1">
                {cancelText}
            </Button>
            <Button 
                variant={icon === 'danger' ? 'destructive' : 'primary'} 
                onClick={handleConfirm}
                className={`flex-1 ${icon === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
                {confirmText}
            </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
