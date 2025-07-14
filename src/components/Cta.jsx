"use client";
import React from 'react';
import { HeroHighlight, Highlight } from './ui/hero-highlight'; // Adjust the import path as needed

const Cta = () => {
  return (
    // Use HeroHighlight as the main section wrapper
    <HeroHighlight
      // Override the default background and height, and apply padding
      containerClassName="bg-blue-600 h-auto py-16"
      className="text-center"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">
        Ready to <Highlight>Revolutionize Your Recruitment?</Highlight>
      </h2>
      <p className="text-blue-100 mt-4 mb-8 max-w-2xl mx-auto">
        Join hundreds of companies hiring <Highlight>smarter, not harder.</Highlight> Get a personalized demo and see HireAI in action.
      </p>
      <a 
        href="#" 
        className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105"
      >
        Request Your Free Demo
      </a>
    </HeroHighlight>
  );
};

export default Cta;
