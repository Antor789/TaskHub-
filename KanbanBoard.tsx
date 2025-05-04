import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useTask } from '../context/TaskContext';
import KanbanColumn from '../components/kanban/KanbanColumn';
import TaskForm from '../components/tasks/TaskForm';
import { Plus } from 'lucide-react';
import { Task } from '../types';

const KanbanBoard: React.FC = () => {
  const { tasks, getTasksByStatus, updateTaskStatus, addTask } = useTask();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [newTaskStatus, setNewTaskStatus] = useState<string>('pending');
  
  const pendingTasks = getTasksByStatus('pending');
  const inProgressTasks = getTasksByStatus('in_progress');
  const completedTasks = getTasksByStatus('completed');
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Update task status if moved to a different column
    if (destination.droppableId !== source.droppableId) {
      updateTaskStatus(draggableId, destination.droppableId);
    }
  };
  
  const handleAddTask = (status: string) => {
    setNewTaskStatus(status);
    setIsFormOpen(true);
  };
  
  const handleSubmitTask = (taskData: Omit<Task, 'id'>) => {
    addTask({
      ...taskData,
      status: newTaskStatus as any
    });
    setIsFormOpen(false);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        
        <button
          onClick={() => handleAddTask('pending')}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-150"
        >
          <Plus size={16} className="mr-1" />
          Add Task
        </button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <KanbanColumn
            id="pending"
            title="To Do"
            tasks={pendingTasks}
            onAddTask={handleAddTask}
          />
          
          <KanbanColumn
            id="in_progress"
            title="In Progress"
            tasks={inProgressTasks}
            onAddTask={handleAddTask}
          />
          
          <KanbanColumn
            id="completed"
            title="Completed"
            tasks={completedTasks}
            onAddTask={handleAddTask}
          />
        </div>
      </DragDropContext>
      
      {isFormOpen && (
        <TaskForm
          onSubmit={handleSubmitTask}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;