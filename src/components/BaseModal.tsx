import { Dialog, DialogContent, DialogOverlay, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import React from "react";

type BaseModalProps = React.ComponentProps<typeof DialogContent> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
};

export function BaseModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = "",
  ...props
}: BaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-md transition-all duration-300" />
      <DialogContent
        className={
          `max-w-lg sm:max-w-xl p-4 sm:p-8 rounded-2xl shadow-2xl shadow-black/40 border border-primary/30 bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl animate-fade-in mx-auto ${className}`
        }
        {...props}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}

// Add fade-in animation
// In your global CSS (e.g., globals.css), add:
// @keyframes fade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
// .animate-fade-in { animation: fade-in 0.25s cubic-bezier(0.4,0,0.2,1); } 