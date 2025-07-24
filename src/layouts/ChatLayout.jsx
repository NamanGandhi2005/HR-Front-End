// src/layouts/ChatLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ChatLayout = () => {
  return (
    <div className="bg-slate-900 text-white h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-grow flex overflow-hidden">
        <Outlet /> {/* The ChatbotPage will render here */}
      </main>
    </div>
  );
};

export default ChatLayout;