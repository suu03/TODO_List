"use client";

import { useState, useCallback, useEffect } from "react";
import { X, CheckCircle, Plus, Trash2 } from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import type { Task } from "../types";

interface TaskModalProps {
  onClose: () => void;
  isAddingTask: boolean;
}

export default function TaskModal({ onClose, isAddingTask }: TaskModalProps) {
  const {
    selectedTask,
    setSelectedTask,
    toggleTaskComplete,
    addTask,
    categories,
    addCategory,
    deleteTask,
  } = useTaskStore();

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    categoryId: "",
    completed: false,
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due date: 1 week from now
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  });
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    categoryId?: string;
    dueDate?: string;
  }>({});

  useEffect(() => {
    if (isAddingTask) {
      setNewTask({
        title: "",
        description: "",
        categoryId: "",
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }
  }, [isAddingTask]);

  // Get category color based on category name
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.color : "#FF5733"; // Default color if category not found
  };

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      categoryId?: string;
      dueDate?: string;
    } = {};

    if (!newTask.title?.trim()) {
      newErrors.title = "Title is required";
    } else if (newTask.title.length < 1) {
      newErrors.title = "Title must be at least 1 characters";
    }

    if (!newTask.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!newTask.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (!newTask.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(newTask.dueDate) < new Date()) {
      newErrors.dueDate = "Due date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTask = () => {
    if (validateForm()) {
      const categoryColor = getCategoryColor(newTask.categoryId!);
      addTask({
        id: crypto.randomUUID(),
        title: newTask.title!,
        description: newTask.description!,
        categoryId: newTask.categoryId!,
        color: categoryColor,
        completed: false,
        createdAt: new Date(),
        dueDate:
          newTask.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      onClose();
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      addCategory({
        id: crypto.randomUUID(),
        name: newCategory.name,
        color: newCategory.color,
      });
      setNewCategory({
        name: "",
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
      setShowCategoryInput(false);
    }
  };

  const handleCompleteTask = useCallback(() => {
    if (selectedTask && !selectedTask.completed) {
      toggleTaskComplete(selectedTask.id);
      alert("✨ タスク完成した！お疲れ様！✨");
    }
  }, [selectedTask, toggleTaskComplete]);

  const handleDeleteTask = useCallback(() => {
    if (selectedTask) {
      if (confirm("タスク消しますね！")) {
        deleteTask(selectedTask.id);
        onClose();
      }
    }
  }, [selectedTask, deleteTask, onClose]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="m-3 bg-slate-800 rounded-lg p-4 md:p-6 w-full max-w-lg my-4">
        <div className="flex mb-3 justify-between">
          <h2 className="text-xl text-white tracking-widest md:text-2xl font-bold">
            {isAddingTask
              ? "Add New Task"
              : selectedTask
              ? selectedTask.title
              : "Task Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 rounded-lg hover:text-white"
          >
            <X size={12} />
          </button>
        </div>

        {isAddingTask || !selectedTask ? (
          // Add mode
          <div className="w-full m-auto">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-white text-sm font-bold mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className={`shadow appearance-none border ${
                  errors.title ? "border-red-500" : "border-gray-600"
                } rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => {
                  setNewTask({ ...newTask, title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: undefined });
                  }
                }}
              />
              {errors.title && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-white text-sm font-bold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                className={`shadow appearance-none border ${
                  errors.description ? "border-red-500" : "border-gray-600"
                } rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => {
                  setNewTask({ ...newTask, description: e.target.value });
                  if (errors.description) {
                    setErrors({ ...errors, description: undefined });
                  }
                }}
              />
              {errors.description && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="categoryId"
                className="block text-white text-sm font-bold mb-2"
              >
                Category
              </label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <select
                    id="categoryId"
                    className={`shadow appearance-none border ${
                      errors.categoryId ? "border-red-500" : "border-gray-600"
                    } rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline`}
                    value={newTask.categoryId}
                    onChange={(e) => {
                      const categoryName = e.target.value;
                      const categoryColor = getCategoryColor(categoryName);

                      setNewTask({
                        ...newTask,
                        categoryId: categoryName,
                      });

                      if (errors.categoryId) {
                        setErrors({ ...errors, categoryId: undefined });
                      }
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowCategoryInput(true)}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-slate-700"
                      onClick={() => {
                        setNewTask({
                          ...newTask,
                          categoryId: category.name,
                        });
                        if (errors.categoryId) {
                          setErrors({ ...errors, categoryId: undefined });
                        }
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-xs text-slate-300">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {errors.categoryId && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.categoryId}
                </p>
              )}
            </div>

            {showCategoryInput && (
              <div className="mb-4">
                <label
                  htmlFor="newCategory"
                  className="block text-white text-sm font-bold mb-2"
                >
                  New Category
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    id="newCategory"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter new category name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                  <input
                    type="color"
                    id="categoryColor"
                    className="h-10 w-10 cursor-pointer rounded border border-gray-600"
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                  />
                  <button
                    onClick={handleAddCategory}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="dueDate"
                className="block text-white text-sm font-bold mb-2"
              >
                Due Date
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                className={`shadow appearance-none border ${
                  errors.dueDate ? "border-red-500" : "border-gray-600"
                } rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline`}
                value={
                  newTask.dueDate
                    ? new Date(newTask.dueDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  setNewTask({
                    ...newTask,
                    dueDate: new Date(e.target.value),
                  });
                  if (errors.dueDate) {
                    setErrors({ ...errors, dueDate: undefined });
                  }
                }}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.dueDate}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 w-full sm:w-auto"
              >
                Add Task
              </button>
            </div>
          </div>
        ) : (
          // View mode
          <div className="space-y-4">
            <div>
              <p className="text-slate-300">
                Category:{" "}
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getCategoryColor(
                        selectedTask.categoryId
                      ),
                    }}
                  ></span>
                  <span className="text-white">{selectedTask?.categoryId}</span>
                </span>
              </p>
            </div>
            <div>
              <p className="text-slate-300">
                Description:{" "}
                <span className="text-white">{selectedTask?.description}</span>
              </p>
            </div>
            <div>
              <p className="text-slate-300">
                Created At:{" "}
                <span className="text-white">
                  {formatDate(selectedTask?.createdAt)}
                </span>
              </p>
            </div>
            <div>
              <p className="text-slate-300">
                Due Date:{" "}
                <span className="text-white">
                  {formatDate(selectedTask?.dueDate)}
                </span>
              </p>
            </div>
            <button
              onClick={handleCompleteTask}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full"
              disabled={selectedTask?.completed}
            >
              {selectedTask?.completed ? (
                <>Completed</>
              ) : (
                <>
                  Complete Task <CheckCircle className="ml-2" size={16} />
                </>
              )}
            </button>
            <button
              onClick={handleDeleteTask}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full mt-2"
            >
              Delete Task <Trash2 className="ml-2" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
