import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineDone, MdModeEditOutline } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { API_URL } from './api.js';

function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find(todo => todo.todo_id === id);
      await axios.put(`${API_URL}/todos/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      setTodos(todos.map(todo => todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo));
    } catch (err) {
      console.error(err.message);
    }
  }

  const deleteTodo = async (id) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
      setError("Failed to delete todo");
    }
  }

  const saveEdit = async (id) => {
    try {
      setError(null);
      const currentTodo = todos.find(todo => todo.todo_id === id);
      const trimmedText = editedText.trim()
      if (currentTodo.description === trimmedText) {
        setEditingTodo(null);
        setEditText("");
        return;
      }
      await axios.put(`${API_URL}/todos/${id}`, {
        description: editedText,
        completed: currentTodo.completed,
      });
      setEditingTodo(null);
      setEditText("");
      setTodos(todos.map((todo) => todo.todo_id === id ? { ...todo, description: editedText } : todo));
    } catch (err) {
      console.error(err.message);
      setError("Failed to update todo");
    }
  }
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/todos`, {
        description, completed: false
      });
      setTodos([...todos, res.data]);
      setDescription("");
    } catch (error) {
      console.error(error);
      setError("Failed to add todo");
    }
  }

  const getTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error.message);
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-950 flex justify-center items-center p-4">
      <div className="bg-emerald-50 rounded-2xl shadow-xl w-full
      max-w-lg p-8">
        <h1 className="text-4xl font-bold text-emerald-900 mb-8">TODO APP</h1>
        {error && (
          <div className="bg-amber-100 text-amber-800 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={onSubmitForm}
          className="flex items-center gap-2 shadow-sm border border-emerald-200 p-2 rounded-lg mb-6">
          <input
            className="flex-1 outline-none px-3 py-2 text-emerald-900 placeholder-emerald-400"
            type="text"
            value={description} onChange={(e) =>
              setDescription(e.target.value)} placeholder="What needs to be done?"
          />
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg rounded-md font-md cursor-pointer transition-colors">
            Add task
          </button>
        </form>
        <div>
          {loading ? (
            <div>
              <p className="text-emerald-600">Loading...</p>
            </div>
          ) : todos.length == 0 ? (
            <p className="text-emerald-600">No tasks available</p>
          ) : (
            <div className="flex flex-col gap-y-4">
              {todos.map((todo) => (
                <div key={todo.todo_id} className="pb-4">
                  {editingTodo === todo.todo_id ? (
                    <div className="flex item-center gap-x-3" >
                      <input
                        className="flex-1 p-3 border rounded-lg border-emerald-200 outline-none focus:ring-2
                      focus:ring-teal-300 text-emerald-900 shadow-inner"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div>
                        <button onClick={() => saveEdit(todo.todo_id)}
                          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg mr-2 mt-2 transition-colors"><MdOutlineDone /></button>
                        <button
                          onClick={() => setEditingTodo(null)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg mt-2 transition-colors"><IoClose /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex item-center gap-x-4 overflow-hidden">
                        <button
                          onClick={() => toggleComplete(todo.todo_id)}
                          className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center
                    ${todo.completed ? "bg-teal-500 border-teal-500 text-white" : "border-emerald-300 hover:border-emerald-400"}`}
                        >
                          {todo.completed && <MdOutlineDone size={16} />}
                        </button>
                        <span className="text-emerald-900">{todo.description}</span>

                      </div>
                      <div
                        className="flex gap-2">
                        <button onClick={() => {
                          setEditingTodo(todo.todo_id);
                          setEditText(todo.description);
                        }}
                          className="p-2 text-teal-500 
                      hover:text-teal-700 rounded-lg 
                      hover:bg-teal-50
                      transition-colors"><MdModeEditOutline /></button>
                        <button onClick={() =>
                          deleteTodo(todo.todo_id)}
                          className="p-2 text-rose-500 
                      hover:text-rose-700 rounded-lg hover:bg-rose-50
                      transition-colors"><FaTrash /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
