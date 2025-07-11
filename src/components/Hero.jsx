import React from 'react';
// You can create a mockup image like this or use an actual screenshot
// import heroMockup from '../assets/hero-mockup.png'; // Make sure to add a placeholder image here
import { BackgroundLines } from "./ui/background-lines";

const Hero = () => {
  return (
    <section className="py-20 md:py-32 bg-slate-900">
      <div className="container mx-auto px-6 text-center">
        <BackgroundLines className="flex relative -mt-30 items-center justify-center w-full flex-col px-4">
        <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          Supercharge Your Hiring with AI
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
          Automate tasks, engage top candidates 24/7, and build winning teams faster. Our intelligent platform streamlines everything from JDs to interviews.
        </p>
        </BackgroundLines>
        <div className="flex justify-center space-x-4">
          <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-xl transition duration-300 transform hover:scale-105">
            Get Started for Free
          </a>
          <a href="#features" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg shadow-xl transition duration-300">
            Explore Features
          </a>
        </div>
        <div className="mt-16">
          {/* Mockup image of your app's dashboard or chat interface */}
          <div className="relative mx-auto border-slate-700 bg-slate-800 border-[8px] rounded-t-xl w-full max-w-4xl h-auto shadow-2xl">
            <div className="rounded-lg overflow-hidden">
               {/* Replace with your actual product image */}
              <img src="https://placehold.co/1200x650/1e293b/ffffff?text=Product+Dashboard+Mockup" alt="AI Recruiter Dashboard" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;