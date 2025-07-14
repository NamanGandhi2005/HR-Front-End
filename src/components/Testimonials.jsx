import React from 'react';
import { TextGenerateEffect } from "./ui/text-generate-effect";

const testimonials = [
  {
    quote: "HireAI cut our time-to-hire by 40%. The automated screening and candidate engagement are game-changers.",
    name: "Sarah Johnson",
    title: "Head of Talent, TechCorp",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // Placeholder avatar
  },
  {
    quote: "The dashboard and analytics provide insights we never had before. We're making smarter hiring decisions, backed by data.",
    name: "Michael Chen",
    title: "Recruiting Manager, Innovate Inc.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026702d", // Placeholder avatar
  },
];
const recruiterHeading = [
  {
    text: "Loved by Leading Recruiters",
    className: "text-3xl md:text-4xl font-bold text-white",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <TextGenerateEffect textBlocks={recruiterHeading} />
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-800 p-8 rounded-lg shadow-lg">
              <p className="text-slate-300 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;