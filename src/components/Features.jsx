"use client";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import React from 'react';
import { FaComments, FaTasks, FaFileAlt, FaChartBar, FaCogs, FaShieldAlt } from 'react-icons/fa';

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
const words = `The All-in-One Recruitment Platform`;

const Features = () => {
  return (
    <section id="features" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          {/* <h2 className="text-3xl md:text-4xl font-bold text-white">The All-in-One Recruitment Platform</h2> */}
          <TextGenerateEffect words={words}/>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">From first contact to final offer, we provide the tools you need to hire efficiently and effectively.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-900 p-8 rounded-lg shadow-lg hover:shadow-blue-500/20 transition duration-300 transform hover:-translate-y-2">
              {feature.icon}
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;