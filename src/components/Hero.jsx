// src/components/Hero.jsx

"use client";
import { Button } from "./ui/moving-border";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundLines } from "./ui/background-lines";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const heroParagraph = [
  {
    text: "Automate tasks, engage freshers , and build winning teams faster. Our intelligent platform streamlines everything from Project Plans to interviews.",
    className: "text-lg md:text-xl text-slate-300 font-normal",
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const placeholders = [
    "How do I start planning my project?",
    "Generate a job description for a junior React developer.",
    "Find top engineering colleges in my city.",
    "How many interns should I hire for a 3-month project?",
    "What are the first steps to building a team?",
  ];

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/chatbot', { state: { initialPrompt: prompt } });
    }
  };

  return (
    <section className="py-20 md:py-32 bg-slate-900">
      <div className="container mx-auto px-6 text-center">
        <BackgroundLines className="flex relative -mt-45 items-center justify-center w-full flex-col px-4">
          <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-6xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            Turn Your Idea Into a Team
          </h1>
          <Highlight className="text-black dark:text-white text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto">
            With AI
          </Highlight>

          <div className="w-full max-w-xl mx-auto mt-8">
            <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
                value={prompt}
              />
          </div>

          <div className="max-w-3xl mx-auto mb-8 mt-10">
            <TextGenerateEffect textBlocks={heroParagraph} />
          </div>
        </BackgroundLines>
        <div className="flex justify-center space-x-4">
          <Button
            borderRadius="1.75rem"
            className="bg-white dark:bg-blue-600 text-black font-bold py-3 px-6 rounded-lg shadow-xl transition duration-300 transform hover:scale-105 hover:bg-blue-700 dark:text-white border-neutral-200 dark:border-slate-900">
            Get Started for Free
          </Button>
          <a href="#features" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-5 px-6 rounded-lg shadow-xl transition duration-300">
            Explore Features
          </a>
        </div>
        <div className="mt-16">
          <div className="relative mx-auto border-slate-700 bg-slate-800 border-[8px] rounded-t-xl w-full max-w-4xl h-auto shadow-2xl">
            <div className="rounded-lg overflow-hidden">
              <img src="https://placehold.co/1200x650/1e293b/ffffff?text=Product+Dashboard+Mockup" alt="AI Recruiter Dashboard" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;