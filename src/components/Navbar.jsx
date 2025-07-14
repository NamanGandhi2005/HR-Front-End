import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  // State to manage whether the mobile menu is open or not
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm shadow-md border-b border-slate-800">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Logo (Always on the left) */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <FaRocket className="text-blue-500 text-2xl" />
              <span className="text-xl font-bold text-white">HireAI</span>
            </Link>
          </div>

          {/* 2. Desktop Center Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-slate-300 hover:text-white transition duration-300">Features</a>
            <a href="#" className="text-slate-300 hover:text-white transition duration-300">Pricing</a>
            <a href="#" className="text-slate-300 hover:text-white transition duration-300">About Us</a>
          </div>

          {/* 3. Desktop Auth Buttons (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/login" className="px-4 py-2 text-slate-300 hover:text-white transition duration-300 font-semibold">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              Try For Free
            </Link>
          </div>

          {/* 4. Mobile Menu Button (Hamburger - Only shown on mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. Mobile Menu Dropdown (Shown when isOpen is true) */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#features" onClick={() => setIsOpen(false)} className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</a>
          <a href="#" onClick={() => setIsOpen(false)} className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
          <a href="#" onClick={() => setIsOpen(false)} className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About Us</a>
          <Link to="/login" onClick={() => setIsOpen(false)} className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
          <Link to="/signup" onClick={() => setIsOpen(false)} className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;