import React from 'react';
import { TextGenerateEffect } from "./ui/text-generate-effect";

const testimonials = [
  {
    quote: "As a solo founder, I had no idea where to start with hiring. TeamBlueprint guided me through the entire process, from planning to my first hire. It was a lifesaver.",
    name: "Samantha Lee",
    title: "Founder, InnovateApp",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // Placeholder avatar
  },
  {
    quote: "We're a small team, and we couldn't afford a dedicated HR person. TeamBlueprint gave us the tools and confidence to build our team and grow our startup.",
    name: "Alex Martinez",
    title: "Co-Founder, CodeCrafters",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026702d", // Placeholder avatar
  },
];
const recruiterHeading = [
  {
    text: "Trusted by Founders Like You",
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