import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, Users, Filter, ChevronsRight, ChevronsLeft } from 'lucide-react';

const RightSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(320); // Default width

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 240 && newWidth < 600) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative flex h-full">
      {/* Clickable Handle for collapsing */}
      <div
        onClick={toggleCollapse}
        className="flex items-center justify-center cursor-pointer bg-slate-800 hover:bg-gray-700 transition-colors h-full"
      >
        <div className="flex flex-col items-center text-white py-4 px-1">
          {isCollapsed ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
          <span
            style={{ writingMode: 'vertical-rl' }}
            className="mt-2 text-sm font-semibold tracking-wider uppercase"
          >
            Status
          </span>
        </div>
      </div>

      {/* Main Resizable and Collapsible Panel */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 0 : width }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="bg-slate-800 text-white h-full relative shrink-0 overflow-hidden"
      >
        {/* Resize Handle (only visible when not collapsed) */}
        {!isCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize bg-gray-600 opacity-0 hover:opacity-100 transition-opacity z-10"
          />
        )}

        {/* Sidebar Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
              className="p-6 h-full"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <BarChart2 className="mr-2 text-blue-400"/> Dashboard
              </h2>
              <div className="bg-slate-900/50 p-4 rounded-lg mb-4 border border-gray-700">
                <h3 className="text-lg font-semibold flex items-center mb-2 text-gray-300">
                  <Users className="mr-2"/> Total Candidates
                </h3>
                <p className="text-4xl font-bold text-blue-400">1,250</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold flex items-center mb-2 text-gray-300">
                  <Filter className="mr-2"/> Advanced to Round 2
                </h3>
                <p className="text-4xl font-bold text-green-400">480</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RightSidebar;