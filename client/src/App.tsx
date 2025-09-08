import React, { useState, useEffect } from "react";
import { useTypedSelector, useAppDispatch } from "./hooks/hooks";
import {
  getTasks,
  updateTask,
  deleteTask,
  addTask,
  doneTask,
} from "./redux/taskSlice";
import NewTask from "./components/NewTask";
import TaskList from "./components/TaskList";
import TopBar from "./components/layout/TopBar";
import Footer from "./components/layout/Footer";
import { Task } from "../types";
import "./App.css";
import { ToastContainer } from "react-toastify";

/**
 * Main application component.
 *
 * This component orchestrates the display and management of tasks,
 * including fetching, adding, updating, deleting, and marking tasks as done.
 */
function App() {
  // #region Redux state and dispatch
  const { loading, error, tasks } = useTypedSelector((state) => state.tasks);
  const dispatch = useAppDispatch();
  // #endregion

  // #region Local state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [taskToUpdate, setTaskToUpdate] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  // #endregion

  // #region Handlers
  /**
   * Handles the addition of a new task.
   * Dispatches the addTask action and clears the input fields.
   */
  const handleAddTask = (): void => {
    if (title.trim().length || description.trim().length) {
      dispatch(addTask({ title, description }));
      setTitle("");
      setDescription("");
      setShowModal(false);
    }
  };

  /**
   * Handles the deletion of a task.
   * @param taskId - The ID of the task to delete.
   */
  const handleDeleteTask = (taskId: number): void => {
    dispatch(deleteTask(taskId));
  };

  /**
   * Handles marking a task as done.
   * @param taskId - The ID of the task to mark as done.
   */
  const handleDoneTask = (taskId: number): void => {
    dispatch(doneTask(taskId));
  };

  /**
   * Handles the update of an existing task.
   * Dispatches the updateTask action and clears the input fields.
   */
  const handleUpdateTask = (): void => {
    if (taskToUpdate) {
      dispatch(
        updateTask({ ...taskToUpdate, title: title, description: description })
      );
      setTaskToUpdate(null);
      setTitle("");
      setDescription("");
      setShowModal(false);
    }
  };

  /**
   * Handles editing a task, populating the form with the task's data.
   * @param task - The task to be edited.
   */
  const handleEditTask = (task: Task): void => {
    setShowModal(true);
    setTitle(task.title);
    setDescription(task.description);
    setTaskToUpdate(task);
  };
  // #endregion

  // #region Modal management
  /**
   * Shows the modal.
   */
  const preShowModal = (): void => {
    setShowModal(true);
  };

  /**
   * Hides the modal.
   */
  const preHideModal = (): void => {
    setShowModal(false);
  };
  // #endregion

  // #region Effects
  /**
   * Fetches tasks from the Redux store on component mount.
   */
  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);
  // #endregion

  return (
    <div className="container bg-gray-600 text-gray-100 h-screen min-w-[500px] min-h-[600px] w-full">
      <ToastContainer />
      <TopBar onModal={preShowModal} />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className="m-7">
          <TaskList
            tasks={tasks.tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDone={handleDoneTask}
          />
        </div>
      )}
      <Footer />
      <NewTask
        isOpen={showModal}
        title={title}
        description={description}
        updateTitle={setTitle}
        updateDescription={setDescription}
        handleAction={taskToUpdate ? handleUpdateTask : handleAddTask}
        isUpdate={!!taskToUpdate}
        onClose={preHideModal}
      />
    </div>
  );
}

export default App;
