import React, { useState } from 'react';

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

const fieldTypeToInputType: Record<string, string> = {
  text: 'text',
  number: 'number',
  date: 'date',
};

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit, initialValues = {}, submitLabel }) => {
  const [form, setForm] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    schema.forEach(field => {
      initial[field.name] = initialValues[field.name] ?? '';
    });
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({ ...f, [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    schema.forEach(field => {
      if (field.required && !form[field.name]) {
        errs[field.name] = 'Required';
      }
    });
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded shadow" onSubmit={handleSubmit}>
      {schema.map(field => (
        <div key={field.name} className="flex flex-col gap-1">
          <label htmlFor={field.name} className="font-medium">
            {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
              className="px-2 py-1 rounded border dark:bg-gray-900 dark:text-gray-100"
            />
          ) : field.type === 'select' || field.type === 'dropdown' ? (
            <select
              id={field.name}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
              className="px-2 py-1 rounded border dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="">Select...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={fieldTypeToInputType[field.type] || 'text'}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
              className="px-2 py-1 rounded border dark:bg-gray-900 dark:text-gray-100"
            />
          )}
          {errors[field.name] && <span className="text-red-500 text-sm">{errors[field.name]}</span>}
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : (submitLabel || 'Submit')}
      </button>
    </form>
  );
};

export default DynamicForm; 