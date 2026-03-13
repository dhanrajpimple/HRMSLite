import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl transition-all sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full h-10 w-10 p-0 text-slate-500 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};
