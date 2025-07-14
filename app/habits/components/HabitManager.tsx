"use client";
import React, { useState } from "react";
import { useHabits } from "../habitContext";

interface HabitFormData {
  name: string;
  description: string;
}

const HabitManager: React.FC = () => {
  const { habits, addHabit, deleteHabit, editHabit } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [formData, setFormData] = useState<HabitFormData>({ name: "", description: "" });

  const openAddModal = () => {
    setEditingHabit(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (habit: { id: string; name: string; description?: string }) => {
    setEditingHabit(habit.id);
    setFormData({ name: habit.name, description: habit.description || "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    if (editingHabit) {
      editHabit(editingHabit, formData.name.trim(), formData.description.trim() || undefined);
    } else {
      addHabit(formData.name.trim(), formData.description.trim() || undefined);
    }
    
    closeModal();
  };

  const handleDelete = (habitId: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(habitId);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Habit Management</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Habit</span>
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No habits added yet. Click "Add Habit" to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => openEditModal(habit)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Edit habit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete habit"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  Created: {new Date(habit.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingHabit ? "Edit Habit" : "Add New Habit"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habit Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter habit name"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter habit description"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {editingHabit ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitManager; 