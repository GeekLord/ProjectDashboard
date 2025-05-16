import React from 'react';

// Define the type for a form field
export type FormField = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
};

export type DynamicFormProps = {
  schema: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  submitLabel?: string;
};

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit, initialValues, submitLabel }) => {
  // Placeholder UI
  return (
    <form className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <div className="text-gray-400">DynamicForm fields will render here.</div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled>
        {submitLabel || 'Submit'}
      </button>
    </form>
  );
};

export default DynamicForm; 