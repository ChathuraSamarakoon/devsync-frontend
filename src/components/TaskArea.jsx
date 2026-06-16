import { useState, useContext, useEffect } from 'react';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { FiPlus, FiCheckCircle, FiClock, FiList, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const TaskArea = () => {
  const { activeWorkspace } = useContext(WorkspaceContext);
  
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    const fetchTasks = async () => {
      if (!activeWorkspace) return;
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`/api/tasks/${activeWorkspace._id}`, config);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [activeWorkspace]);

  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeWorkspace) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.post(
        '/api/tasks', 
        { title: newTaskTitle, description: newTaskDesc, workspaceId: activeWorkspace._id }, 
        config
      );
      
      setTasks([...tasks, data]);
      setIsModalOpen(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/tasks/${taskId}`, config);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- Drag and Drop Functions ---
  
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = async (e, newStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    
    const updatedTasks = tasks.map(t => 
      t._id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus }, config);
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please refresh.");
    }
  };

  if (!activeWorkspace) return null;

  
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="h-16 border-b border-outline/20 flex items-center justify-between px-6 bg-surface-container/50 backdrop-blur-sm shrink-0">
        <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
          <FiCheckCircle className="text-secondary" /> {activeWorkspace.name} - Tasks
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <FiPlus /> New Task
        </button>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-max">
          
          {/* Column 1: To Do */}
          <div 
            className="w-80 flex flex-col bg-surface-container-lowest rounded-xl border border-outline/10 h-full max-h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <div className="p-4 border-b border-outline/10 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <FiList className="text-outline" /> To Do
              </h3>
              <span className="text-xs font-bold bg-surface-container py-1 px-2 rounded-full">{todoTasks.length}</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
              {todoTasks.map(task => (
                <TaskCard key={task._id} task={task} onDragStart={handleDragStart} onDelete={handleDeleteTask} />
              ))}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div 
            className="w-80 flex flex-col bg-surface-container-lowest rounded-xl border border-outline/10 h-full max-h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in-progress')}
          >
            <div className="p-4 border-b border-outline/10 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-secondary flex items-center gap-2">
                <FiClock /> In Progress
              </h3>
              <span className="text-xs font-bold bg-secondary-container text-on-secondary-container py-1 px-2 rounded-full">{inProgressTasks.length}</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
              {inProgressTasks.map(task => (
                <TaskCard key={task._id} task={task} onDragStart={handleDragStart} onDelete={handleDeleteTask} />
              ))}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div 
            className="w-80 flex flex-col bg-surface-container-lowest rounded-xl border border-outline/10 h-full max-h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'completed')}
          >
            <div className="p-4 border-b border-outline/10 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-green-500 flex items-center gap-2">
                <FiCheckCircle /> Completed
              </h3>
              <span className="text-xs font-bold bg-green-500/20 text-green-400 py-1 px-2 rounded-full">{completedTasks.length}</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
              {completedTasks.map(task => (
                <TaskCard key={task._id} task={task} onDragStart={handleDragStart} onDelete={handleDeleteTask} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container w-full max-w-md p-6 rounded-2xl border border-outline/20 shadow-2xl">
            <h3 className="text-xl font-bold text-on-surface mb-6">Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-on-surface mb-1">Task Title</label>
                <input 
                  type="text" required value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-background border border-outline/30 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary"
                  placeholder="e.g. Design Login Page"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-on-surface mb-1">Description (Optional)</label>
                <textarea 
                  value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-background border border-outline/30 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary resize-none"
                  rows="3" placeholder="Add more details..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-outline hover:text-on-surface">Cancel</button>
                <button type="submit" disabled={isLoading || !newTaskTitle.trim()} className="px-5 py-2 bg-primary text-on-primary rounded-lg text-sm">
                  {isLoading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


const TaskCard = ({ task, onDragStart, onDelete }) => {
  return (
    <div 
      draggable 
      onDragStart={(e) => onDragStart(e, task._id)}
      className="bg-surface-container p-4 rounded-lg border border-outline/10 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group relative"
    >
      <h4 className="font-semibold text-on-surface mb-1 pr-6">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-outline line-clamp-2 mb-3">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-outline font-mono">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {/* Delete Button  */}
      <button 
        onClick={() => onDelete(task._id)}
        className="absolute top-3 right-3 text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete Task"
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  );
};

export default TaskArea;