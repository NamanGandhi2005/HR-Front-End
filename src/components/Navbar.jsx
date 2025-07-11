import React from 'react';
import { FaRocket } from 'react-icons/fa';
import {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaRocket className="text-blue-500 text-2xl" />
          <a href="/" className="text-xl font-bold text-white" >HireAI</a>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-slate-300 hover:text-white transition duration-300">Features</a>
          <a href="#" className="text-slate-300 hover:text-white transition duration-300">Pricing</a>
          <a href="#" className="text-slate-300 hover:text-white transition duration-300">About Us</a>
        </div>
        <div>
            <Link to="/login" className="px-6 text-slate-300 hover:text-white transition duration-300 font-semibold">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;