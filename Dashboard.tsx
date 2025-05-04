import React from 'react';
import { useTask } from '../context/TaskContext';
import { useProject } from '../context/ProjectContext';
import { Calendar, CheckSquare, Users, ArrowUpRight, Clock } from 'lucide-react';
import { formatDate, getDaysRemaining, isPastDate } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';

const Dashboard: React.FC = () => {
  const { tasks } = useTask();
  const { projects } = useProject();
  const { isDarkMode } = useTheme();
  
  // Task stats
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  
  // Get tasks due today
  const today = new Date().toISOString().split('T')[0];
  const tasksToday = tasks.filter(task => 
    new Date(task.dueDate).toISOString().split('T')[0] === today && 
    task.status !== 'completed'
  );
  
  // Get overdue tasks
  const overdueTasks = tasks.filter(task => 
    isPastDate(task.dueDate) && task.status !== 'completed'
  );
  
  // Get recent projects
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-6 rounded-lg shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
              <h3 className="text-2xl font-bold mt-1">{tasks.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
              <CheckSquare size={20} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-1 rounded bg-green-100 dark:bg-green-900 dark:bg-opacity-20 text-green-600 dark:text-green-300">
              {completedTasks} Completed
            </div>
            <div className="text-center p-1 rounded bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20 text-blue-600 dark:text-blue-300">
              {inProgressTasks} In Progress
            </div>
            <div className="text-center p-1 rounded bg-amber-100 dark:bg-amber-900 dark:bg-opacity-20 text-amber-600 dark:text-amber-300">
              {pendingTasks} Pending
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-lg shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Projects</p>
              <h3 className="text-2xl font-bold mt-1">{projects.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-1 rounded bg-indigo-100 dark:bg-indigo-900 dark:bg-opacity-20 text-indigo-600 dark:text-indigo-300">
              {projects.filter(p => p.status === 'active').length} Active
            </div>
            <div className="text-center p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {projects.filter(p => p.status === 'completed').length} Completed
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-lg shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Due Today</p>
              <h3 className="text-2xl font-bold mt-1">{tasksToday.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4">
            {tasksToday.length > 0 ? (
              <div className="text-sm">
                Next: <span className="font-medium">{tasksToday[0].title}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No tasks due today
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-6 rounded-lg shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
              <h3 className="text-2xl font-bold mt-1 text-red-500">{overdueTasks.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4">
            {overdueTasks.length > 0 ? (
              <div className="text-sm text-red-500">
                Oldest: <span className="font-medium">{overdueTasks[0].title}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No overdue tasks
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Projects & Due Soon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-lg shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="font-semibold">Recent Projects</h2>
            <a 
              href="/projects" 
              className="text-sm text-indigo-500 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              View all <ArrowUpRight size={14} className="ml-1" />
            </a>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentProjects.map(project => (
              <div key={project.id} className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {project.description?.substring(0, 80)}
                      {project.description && project.description.length > 80 ? '...' : ''}
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-900 dark:bg-opacity-20 text-green-600 dark:text-green-300' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {project.status === 'active' ? 'Active' : 'Completed'}
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  <span>Due {formatDate(project.dueDate)}</span>
                  <span className="mx-2">•</span>
                  <Users size={14} className="mr-1" />
                  <span>{project.members?.length || 0} members</span>
                </div>
              </div>
            ))}
            
            {recentProjects.length === 0 && (
              <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No projects available
              </div>
            )}
          </div>
        </div>
        
        <div className={`rounded-lg shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="font-semibold">Tasks Due Soon</h2>
            <a 
              href="/tasks" 
              className="text-sm text-indigo-500 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              View all <ArrowUpRight size={14} className="ml-1" />
            </a>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {tasks
              .filter(task => 
                task.status !== 'completed' && 
                !isPastDate(task.dueDate) &&
                getDaysRemaining(task.dueDate) <= 7
              )
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 5)
              .map(task => (
                <div key={task.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {task.description?.substring(0, 60)}
                        {task.description && task.description.length > 60 ? '...' : ''}
                      </p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' 
                        ? 'bg-red-100 dark:bg-red-900 dark:bg-opacity-20 text-red-600 dark:text-red-300' 
                        : task.priority === 'medium'
                          ? 'bg-amber-100 dark:bg-amber-900 dark:bg-opacity-20 text-amber-600 dark:text-amber-300'
                          : 'bg-green-100 dark:bg-green-900 dark:bg-opacity-20 text-green-600 dark:text-green-300'
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Clock size={14} className="mr-1 text-amber-500" />
                    <span className="text-amber-500">
                      Due {formatDate(task.dueDate)}
                      {getDaysRemaining(task.dueDate) === 0 && ' (Today)'}
                      {getDaysRemaining(task.dueDate) === 1 && ' (Tomorrow)'}
                    </span>
                  </div>
                </div>
              ))
            }
            
            {tasks.filter(task => 
              task.status !== 'completed' && 
              !isPastDate(task.dueDate) &&
              getDaysRemaining(task.dueDate) <= 7
            ).length === 0 && (
              <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No upcoming due dates in the next 7 days
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;