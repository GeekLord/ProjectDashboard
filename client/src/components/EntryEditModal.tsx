import React from 'react';
import { FormField } from './DynamicForm';
import { Entry } from './EntriesTable';

export type EntryEditModalProps = {
  open: boolean;
  entry: Entry | null;
  schema: FormField[];
  onSave: (data: Record<string, any>) => void;
  onClose: () => void;
};

const EntryEditModal: React.FC<EntryEditModalProps> = ({ open, entry, schema, onSave, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-pink-300">Edit Entry</h2>
        <div className="text-gray-400 mb-4">EntryEditModal form will render here.</div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200" onClick={onClose} aria-label="Cancel edit">Cancel</button>
          <button className="px-4 py-2 rounded bg-blue-500 text-white" disabled>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EntryEditModal; 