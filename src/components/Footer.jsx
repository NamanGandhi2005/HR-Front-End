import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub, FaRocket } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <FaRocket className="text-blue-500 text-2xl" />
            <span className="text-xl font-bold text-white">HireAI</span>
          </div>
          <div className="flex space-x-6 text-slate-400 mb-6 md:mb-0">
            <a href="#" className="hover:text-white transition duration-300">About</a>
            <a href="#" className="hover:text-white transition duration-300">Careers</a>
            <a href="#" className="hover:text-white transition duration-300">Contact</a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-slate-400 hover:text-white transition duration-300"><FaTwitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition duration-300"><FaLinkedin size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition duration-300"><FaGithub size={20} /></a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} HireAI. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-white">Privacy Policy</a> · <a href="#" className="hover:text-white">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;