import React from "react";
import { TaskListProps } from "../../types";
import TaskItem from "./TaskItem";

/**
 * This component renders a list of tasks. It receives an array of tasks and
 * functions to handle editing, deleting, and marking tasks as done.
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onDone,
}) => {
  return (
    <div className="h-[calc(100vh-180px)] min-h-[400px] overflow-y-auto">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onDone={onDone}
        />
      ))}
    </div>
  );
};

export default TaskList;
