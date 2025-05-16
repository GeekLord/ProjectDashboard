import React from 'react';

export type Entry = {
  id: number;
  [key: string]: any;
};

export type EntriesTableProps = {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
};

const EntriesTable: React.FC<EntriesTableProps> = ({ entries, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Placeholder rows */}
          <tr>
            <td className="px-4 py-2 text-gray-400" colSpan={2}>Entries will be listed here.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EntriesTable; 