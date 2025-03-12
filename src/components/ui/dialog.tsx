import React from "react";
import { Button } from "./button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "danger" | "success";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
}: DialogProps) {
  if (!isOpen) return null;

  // Handle primary button style
  const getPrimaryButtonClass = () => {
    switch (primaryAction?.variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md z-10 p-6 m-4 relative animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="py-2">{children}</div>

        <div className="flex justify-end space-x-3 mt-6">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="border-gray-300 hover:bg-gray-50"
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              className={getPrimaryButtonClass()}
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "primary",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "primary" | "danger" | "success";
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      primaryAction={{
        label: confirmLabel,
        onClick: onConfirm,
        variant,
      }}
      secondaryAction={{
        label: cancelLabel,
        onClick: onClose,
      }}
    >
      <p className="text-gray-600">{message}</p>
    </Dialog>
  );
}

export function ResultDialog({
  isOpen,
  onClose,
  isCorrect,
}: {
  isOpen: boolean;
  onClose: () => void;
  isCorrect: boolean;
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isCorrect ? "Correct!" : "Incorrect!"}
      primaryAction={{
        label: "Continue",
        onClick: onClose,
        variant: isCorrect ? "success" : "primary",
      }}
    >
      <div className="flex flex-col items-center py-6">
        {isCorrect ? (
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-14 h-14 text-green-600"
            >
              <path
                fillRule="evenodd"
                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-14 h-14 text-red-600"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <p className="text-xl font-medium text-center">
          {isCorrect
            ? "Well done! You got the correct answer."
            : "Sorry, that's not correct."}
        </p>
      </div>
    </Dialog>
  );
}
