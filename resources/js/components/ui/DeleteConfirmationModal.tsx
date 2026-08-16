import { useRef, useState } from "react";
import { AlertTriangle, CircleAlert, MoveLeft, X } from "lucide-react";
import { Button } from "./button";
import { createPortal } from "react-dom";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    name: string;
    entityType?: "admin" | "variant" | "product" | "item";
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    name, 
    entityType
}: DeleteConfirmationModalProps) {
    const [confirmText, setConfirmText] = useState("");
    const deleteInputRef  = useRef<HTMLInputElement|null>(null)
    if (!isOpen) return null;

    const isDeleteEnabled = confirmText === "DELETE";

    // Dynamic content based on entity type
    const getTitle = () => {
        switch (entityType) {
            case "variant":
                return "Delete Variant";
            case "product":
                return "Delete Product";
            case "item":
                return "Delete Item";
            default:
                return "Delete Admin User";
        }
    };

    const getDescription = () => {
        
        switch (entityType) {
            case "product":
                return `You are about to permanently delete the product "${name}" and all its variants.`;
            case "item":
                return `You are about to permanently delete "${name}".`;
            default:
                return `You are about to permanently delete ${name}. This will remove all their access and data.`;
        }
    };

    const getButtonText = () => {
        switch (entityType) {
            case "variant":
                return "Delete Variant";
            case "product":
                return "Delete Product";
            case "item":
                return "Delete Item";
            default:
                return "Delete Admin";
        }
    };

    const handleConfirm = () => {
        if(confirmText === '') deleteInputRef.current?.focus()
        if (isDeleteEnabled) {
            onConfirm();
            setConfirmText("");
        }
    };

    const handleClose = () => {
        setConfirmText("");
        onClose();
    };

    return  createPortal( 
         
          
          
         <div
                className="fixed inset-0 z-50 overflow-y-auto"
                style={{
                    backdropFilter: "blur(10px)",
                    background: "rgba(0, 0, 0, 0.4)",
                }}
                >


           <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50"
                    onClick={handleClose}
                />
                <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl">
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    {getTitle()}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="px-6 pb-6 space-y-4">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-800 dark:text-red-300">
                                {getDescription()}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Type <span className="font-mono font-bold">DELETE</span> to confirm
                            </label>
                            <input 
                                ref={deleteInputRef}
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Type DELETE"
                            />
                        </div>

                        <div className="flex justify-between gap-3  ">
                          
                            <Button 
                                onClick={handleClose}
                                className="px-4 py-2 grow-1 flex-1 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              Cancel
                            </Button>
                            <Button    
                                
                                className="grow-1 flex-1"
                                variant="danger"
                                onClick={handleConfirm}
                            >
                            {getButtonText()}
                            </Button>    
                               
                        </div>
                    </div>
                </div>
            </div>
        </div>
     , 
     document.body 
    );
}
