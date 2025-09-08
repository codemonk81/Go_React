import React from "react";
import { NewTaskProps } from "../../types";

/**
 * NewTask Component
 *
 * This component renders a modal for creating or updating a task.
 * It includes input fields for the task title and description,
 * and buttons for adding or updating the task, and closing the modal.
 */
const NewTask: React.FC<NewTaskProps> = ({
  isOpen,
  title,
  description,
  updateTitle,
  updateDescription,
  handleAction,
  onClose,
  isUpdate,
}) => {
  // If the modal is not open, return null to prevent rendering.
  if (!isOpen) {
    return null;
  }

  return (
    <div className="bg-gray-300 fixed inset-0 bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-700 p-8 rounded-lg shadow-xl w-96">
        {/* Close button */}
        <div className="items-center flex">
          <button className="ml-auto" onClick={onClose}>
            <i className="fa-solid fa-close"></i>
          </button>
        </div>

        {/* Task title input */}
        <div className="min-h-[60px] p-4 text-xl">
          <label className="font-serif">Task's Title</label>
          <input
            className="bg-transparent block w-full p-2 border border-none focus:outline-none focus:border"
            placeholder="Enter Task title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateTitle(e.target.value)
            }
          />
        </div>

        {/* Task description textarea */}
        <div className="min-h-[100px] p-4 text-xl">
          <label className="font-serif">Task's Description</label>
          <textarea
            rows={5}
            className="bg-transparent block w-full max-h-[358px] p-2 border border-none focus:outline-none focus:border focus:border-none"
            placeholder="Enter Task Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              updateDescription(e.target.value)
            }
          />
        </div>

        {/* Action button (Add or Update) */}
        <div className="flex items-center">
          <button
            className="ml-auto bg-gray-900 mb-3 mr-3 p-2 rounded-lg active:bg-gray-700 hover:text-blue-500"
            onClick={handleAction}
          >
            {isUpdate ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
