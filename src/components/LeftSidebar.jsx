import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, ChevronsLeft, ChevronsRight } from 'lucide-react';
// Import the necessary components from Clerk
import { UserButton, useUser } from '@clerk/clerk-react';

const LeftSidebar = ({ onNewChat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(280);
  // Get the user object from Clerk's hook
  const { user } = useUser();

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newWidth = e.clientX;
    if (newWidth > 240 && newWidth < 500) { // Set min and max resize width
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const sidebarVariants = {
    collapsed: { width: '80px', transition: { duration: 0.3, ease: 'easeInOut' } },
    expanded: { width: `${width}px`, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      className="bg-slate-800 text-white flex flex-col h-full relative shrink-0"
    >
      {/* Collapse/Expand Button */}
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-blue-600 p-1 rounded-full z-20 text-white">
        {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
      </button>

      <div className="p-4 flex-grow overflow-y-auto overflow-x-hidden">
        <button onClick={onNewChat} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center mb-6 transition-colors">
          <Plus size={20} className={!isCollapsed ? "mr-2" : ""} />
          {!isCollapsed && 'New Chat'}
        </button>

        <h2 className={`text-lg font-semibold mb-4 px-2 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? 'History' : '...'}
        </h2>
        <ul>
          <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
            <MessageSquare size={20} className="shrink-0" />
            {!isCollapsed && <span className="ml-3 truncate">Frontend Developer Search</span>}
          </li>
           <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
            <MessageSquare size={20} className="shrink-0" />
            {!isCollapsed && <span className="ml-3 truncate">Data Scientist Candidates</span>}
          </li>
        </ul>
      </div>

      {/* User Info Section */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center">
          {/* Clerk's UserButton will display the avatar and manage profile/logout */}
          <UserButton afterSignOutUrl="/" />
          {/* Show user's full name and email when expanded and user is available */}
          {!isCollapsed && user && (
            <div className="ml-3 overflow-hidden">
              <p className="font-semibold truncate">{user.fullName}</p>
              <p className="text-sm text-gray-400 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Resize Handle */}
      {!isCollapsed && (
         <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize bg-gray-600 opacity-0 hover:opacity-100 transition-opacity z-10"
         />
      )}
    </motion.div>
  );
};

export default LeftSidebar;