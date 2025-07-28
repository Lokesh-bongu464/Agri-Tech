import React from "react";

const ConfirmationDialog = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure?",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 rounded-lg shadow-lg max-w-sm w-full p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
