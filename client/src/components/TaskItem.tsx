import React, { useState } from "react";
import { TaskItemProps } from "../../types";

/**
 * TaskItem Component
 *
 * This component renders a single task item with its title, description, and action buttons.
 * It allows users to edit, delete, and mark the task as done.
 */
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onDone,
}) => {
  const maxLength = 250;

  /**
   * Truncates a string to a specified maximum length, adding an ellipsis if needed.
   * @param str The string to truncate.
   * @param maxLength The maximum length of the string.
   * @returns The truncated string.
   */
  const truncateString = (str: string, maxLength: number): string => {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.substring(0, maxLength) + "...";
    }
  };

  const [description, setDescription] = useState<string>(
    truncateString(task.description, maxLength)
  );

  return (
    <div className="w-full bg-gray-800 rounded-lg hover:bg-gray-900 active:bg-gray-700 max-h-[200px] mb-2 p-5">
      <div className="min-h-[100px] font-serif">
        <div className="flex items-center">
          <div className="text-2xl p-3 font-medium">{task.title}</div>
          <div className="ml-auto gap-2 flex pr-3">
            <button
              className="hover:text-blue-500 active:text-gray-500"
              onClick={() => onDone(task.id)}
            >
              <i className="fa-solid fa-gear fa-x"></i>
            </button>
            <button
              className="hover:text-blue-500 active:text-gray-500"
              onClick={() => onEdit(task)}
            >
              <i className="fa-solid fa-pen-to-square fa-x"></i>
            </button>
            <button
              className="hover:text-blue-500 active:text-gray-500"
              onClick={() => onDelete(task.id)}
            >
              <i className="fa-solid fa-trash-can fa-x"></i>
            </button>
          </div>
        </div>
        <div className="text-sm p-3 ml-3 font-mono font-thin">
          <span>Description:</span>
          <br />
          {description}
        </div>
        <div className="p-3 items-center flex">
          <span className="ml-auto">
            {task.state === 0
              ? "IN_PROGRESS"
              : task.state === 1
              ? "REVIEW"
              : "COMPLETE"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
