// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import ChatLayout from './layouts/ChatLayout';

import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ChatbotPage from './pages/ChatbotPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes using the main layout with a footer and page scroll */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Routes using the chat layout with a fixed height and no footer */}
        <Route element={<ChatLayout />}>
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;