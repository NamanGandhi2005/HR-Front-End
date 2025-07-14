import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Cta from '../components/Cta';
import Footer from '../components/Footer';
// import { calsans } from "@/fonts/calsans";
 
// import { twMerge } from "tailwind-merge";
import { TracingBeam } from "../components/ui/tracing-beam";

function App() {
  return (
    <TracingBeam className="px-1">

    <div className="bg-slate-900 text-white">
      
      <Hero />
      <Features />
      <Testimonials />
      <Cta />
      {/* <Footer /> */}
    </div>
    </TracingBeam>
  );
}

export default App;