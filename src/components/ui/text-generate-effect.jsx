"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "../../lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");

  useEffect(() => {
    // Create a new Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        // Loop through the entries
        entries.forEach((entry) => {
          // If the element is intersecting (in view)
          if (entry.isIntersecting) {
            // Start the animation to reveal the text
            animate("span", {
              opacity: 1,
              filter: filter ? "blur(0px)" : "none",
            }, {
              duration: duration ? duration : 1,
              delay: stagger(0.2),
            });
          } else {
            // If the element is not intersecting (out of view), reset it instantly
            animate("span", { 
              opacity: 0, 
              filter: filter ? "blur(10px)" : "none" 
            }, { duration: 0 });
          }
        });
      },
      // Options for the observer: trigger when 20% of the element is visible
      { threshold: 0.2 }
    );

    const currentScope = scope.current;
    // If the scope (the container div) exists, start observing it
    if (currentScope) {
      observer.observe(currentScope);
    }

    // Cleanup function to unobserve the element when the component unmounts
    return () => {
      if (currentScope) {
        observer.unobserve(currentScope);
      }
    };
  }, [scope, animate, filter, duration]); // The effect depends on the scope being available

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              // The initial state is now handled by the observer
              className="dark:text-white text-black opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}>
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div
          className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
