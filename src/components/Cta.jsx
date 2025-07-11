import React from 'react';


const Cta = () => {
  return (
    <section className="bg-blue-600">
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Revolutionize Your Recruitment?</h2>
        <p className="text-blue-100 mt-4 mb-8 max-w-2xl mx-auto">
          Join hundreds of companies hiring smarter, not harder. Get a personalized demo and see HireAI in action.
        </p>
        <a 
          href="#" 
          className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105"
        >
          Request Your Free Demo
        </a>
      </div>
    </section>
  );
};

export default Cta;