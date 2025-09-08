import React from "react";

interface TopBarProps {
  onModal: () => void;
}

/**
 * TopBar Component
 *
 * This component renders the top bar of the application, displaying the title
 * and a button to open the new task modal.
 */
function TopBar({ onModal }: TopBarProps) {
  return (
    <div className="bg-gray-800 h-[75px] w-full flex items-center">
      {/* Title */}
      <div className="font-bold font-serif text-4xl p-5 text-slate-300">
        Task Management
      </div>

      {/* Create button */}
      <div className="flex items-center ml-auto mr-7">
        <button
          onClick={onModal}
          className="bg-gray-900 rounded-lg hover:text-blue-500 active:bg-gray-700 min-w-[80px] min-h-[40px]"
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default TopBar;
