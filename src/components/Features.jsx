"use client";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import React from 'react';
import { FaComments, FaTasks, FaFileAlt, FaChartBar, FaCogs, FaShieldAlt } from 'react-icons/fa';
import { HoverEffect } from "./ui/card-hover-effect"; // 1. Import the HoverEffect component

// Original features data with icons
const features = [
  {
    icon: <FaComments className="text-blue-500 text-3xl mb-4" />,
    title: 'Conversational AI',
    description: 'Engage candidates with intelligent chatbots that handle screening, scheduling, and FAQs 24/7.',
  },
  {
    icon: <FaTasks className="text-blue-500 text-3xl mb-4" />,
    title: 'Dynamic Project Planners',
    description: 'Visualize your hiring pipeline with interactive Gantt charts and task-based project management tools.',
  },
  {
    icon: <FaFileAlt className="text-blue-500 text-3xl mb-4" />,
    title: 'AI-Powered JD Generator',
    description: 'Create compelling, optimized, and unbiased job descriptions in seconds, tailored to your ideal candidate.',
  },
  {
    icon: <FaShieldAlt className="text-blue-500 text-3xl mb-4" />,
    title: 'Secure Resume Ingestion',
    description: 'Automate resume intake from any source with secure pipelines and intelligent scoring to find top talent.',
  },
  {
    icon: <FaChartBar className="text-blue-500 text-3xl mb-4" />,
    title: 'Interactive Dashboards',
    description: 'Access real-time analytics on candidate flow, time-to-hire, and other key metrics to make data-driven decisions.',
  },
  {
    icon: <FaCogs className="text-blue-500 text-3xl mb-4" />,
    title: 'Plug-and-Play Microtools',
    description: 'Customize your workflow with a library of microtools that integrate seamlessly with your existing systems.',
  },
];

// 2. Transform the data to include the icon within the description
// This makes it compatible with the HoverEffect component's structure
const itemsForHoverEffect = features.map(feature => ({
  title: feature.title,
  description: (
    <>
      {feature.icon}
      <p>{feature.description}</p>
    </>
  ),
  // Add a className to each item to control the card's background color
  className: "bg-slate-900",
}));

// Data for the TextGenerateEffect heading
const textForFeatures = [
  {
    text: "The All-in-One Recruitment Platform",
    className: "text-2xl font-bold",
  },
  {
    text: "From first contact to final offer, we provide the tools you need to hire efficiently and effectively.",
    className: "text-base font-normal mt-4",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <TextGenerateEffect textBlocks={textForFeatures} />
        </div>
        
        {/* 3. Use the HoverEffect component with the transformed data */}
        <div className="max-w-5xl mx-auto">
          <HoverEffect items={itemsForHoverEffect} />
        </div>
      </div>
    </section>
  );
};

export default Features;
