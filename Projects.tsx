import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import ProjectCard from '../components/projects/ProjectCard';
import { Plus, Search, Filter, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Projects: React.FC = () => {
  const { projects } = useProject();
  const { isDarkMode } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category || 'General')))];
  
  const filteredProjects = projects.filter(project => {
    // Search filter
    const matchesSearch = !searchQuery || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter || 
      (!project.category && categoryFilter === 'General');
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const handleProjectClick = (id: string) => {
    // In a real app, this would navigate to the project details page
    console.log('Clicked project:', id);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        
        <button
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-150"
        >
          <Plus size={16} className="mr-1" />
          New Project
        </button>
      </div>
      
      {/* Filters */}
      <div className={`p-4 mb-6 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' 
                  : 'bg-gray-50 border border-gray-200 focus:border-indigo-500'
              } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border border-gray-200'
                } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border border-gray-200'
              } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Projects list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={handleProjectClick}
          />
        ))}
        
        {filteredProjects.length === 0 && (
          <div className={`col-span-full p-8 rounded-lg text-center ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No projects match your criteria
            </p>
            <button className="flex items-center mx-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-150">
              Create a Project <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;