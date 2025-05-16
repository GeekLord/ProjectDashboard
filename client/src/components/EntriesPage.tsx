import { useState } from 'react';

const EntriesPage = () => {
  const [tab, setTab] = useState<'new' | 'list'>('new');
  // TODO: Fetch assigned projects and form schema
  // TODO: Fetch entries for the current user

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${tab === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
          onClick={() => setTab('new')}
          aria-label="Switch to New Entry tab"
        >
          New Entry
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${tab === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
          onClick={() => setTab('list')}
          aria-label="Switch to My Entries tab"
        >
          My Entries
        </button>
      </div>
      <div>
        {tab === 'new' ? (
          <div>{/* <DynamicForm /> will go here */} <div className="text-gray-500">DynamicForm placeholder</div></div>
        ) : (
          <div>{/* <EntriesTable /> will go here */} <div className="text-gray-500">EntriesTable placeholder</div></div>
        )}
      </div>
    </div>
  );
};

export default EntriesPage; 