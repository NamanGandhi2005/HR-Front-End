"use client";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import React from 'react';
import { FaComments, FaTasks, FaFileAlt, FaChartBar, FaCogs, FaShieldAlt , FaUniversity, FaUserCheck } from 'react-icons/fa';
import { HoverEffect } from "./ui/card-hover-effect"; // 1. Import the HoverEffect component

// Original features data with icons
const features = [
  {
    icon: <FaComments className="text-blue-500 text-3xl mb-4" />,
    title: 'Automated AI-led Interviews',
    description: 'Screen candidates at scale with AI-driven interviews that assess skills and cultural fit.',
  },
  {
    icon: <FaTasks className="text-blue-500 text-3xl mb-4" />,
    title: 'From Idea to Project Plan',
    description: 'Our AI guides you in structuring your project and identifying the key roles you need to hire for.',
  },
  {
    icon: <FaFileAlt className="text-blue-500 text-3xl mb-4" />,
    title: 'AI-Powered JD Generator',
    description: 'No more guesswork. Generate clear and effective job descriptions for interns and freshers in seconds.',
  },
  {
    icon: <FaShieldAlt className="text-blue-500 text-3xl mb-4" />,
    title: 'Secure Resume Ingestion',
    description: 'Automate resume intake from any source with secure pipelines and intelligent scoring to find top talent.',
  },
  {
    icon: <FaChartBar className="text-blue-500 text-3xl mb-4" />,
    title: 'Your All-in-One Dashboard',
    description: 'Manage your project plan, hiring pipeline, and candidate communication all in one place.',
  },
  {
        icon: <FaUniversity className="text-blue-500 text-3xl mb-4" />,
        title: 'Direct Access to College Talent',
        description: 'We connect you with a network of college and university placement cells to find eager, fresh talent.',
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
    text: "The Founder's Co-Pilot for Team Building",
    className: "text-2xl font-bold",
  },
  {
    text: "We guide you through every step, from planning your project to hiring your first team members.",
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
