// Define the structure for a Task object.
export interface Task {
  id: number;
  title: string;
  description: string;
  state: number; // Represents the state of the task (e.g., 0: IN_PROGRESS, 1: REVIEW, 2: COMPLETE)
}

// Define the structure for the API response containing an array of tasks.
export interface TasksResponse {
  tasks: Task[];
}

// Define the structure for the Tasks state in Redux.
export interface TasksState {
  tasks: TasksResponse;
  loading: boolean; // Indicates if tasks are currently being loaded.
  error: string | null; // Stores any error message that occurred during task loading.
}

// This interface seems redundant and isn't used effectively.Consider removing or refactoring.
export interface Tasks {
  task: Task[];
}

// Define the structure for the NewTask component's props.
export interface NewTaskProps {
  isOpen: boolean; // Controls the visibility of the NewTask modal.
  title: string; // The current value of the task title input.
  description: string; // The current value of the task description input.
  updateTitle: (title: string) => void; // Function to update the task title.
  updateDescription: (description: string) => void; // Function to update the task description.
  handleAction: () => void; // Function to handle the add or update task action.
  onClose: () => void; // Function to close the NewTask modal.
  isUpdate: boolean; // Flag indicating whether the modal is in update mode.
}

// Define the structure for the TaskList component's props.
export interface TaskListProps {
  tasks: Task[]; // Array of tasks to display in the list.
  onEdit: (task: Task) => void; // Function to handle editing a task.
  onDone: (taskId: number) => void; // Function to handle marking a task as done.
  onDelete: (taskId: number) => void; // Function to handle deleting a task.
}

// Define the structure for the TaskItem component's props.
export interface TaskItemProps {
  task: Task; // The task object to display.
  onEdit: (task: Task) => void; // Function to handle editing a task.
  onDelete: (taskId: number) => void; // Function to handle deleting a task.
  onDone: (taskId: number) => void; // Function to handle marking a task as done.
}

// Define the structure for a new task object (used when creating a task).
export interface New_Task {
  title: string;
  description: string;
}
