"use client";
import React, { useEffect } from "react"; // Import React
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "../../lib/utils";

export const TextGenerateEffect = ({
  textBlocks = [], // Added default empty array to prevent map error
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(
              "span",
              {
                opacity: 1,
                filter: filter ? "blur(0px)" : "none",
              },
              {
                duration: duration,
                delay: stagger(0.1), // Adjusted stagger for a smoother effect across lines
              }
            );
          } else {
            animate(
              "span",
              {
                opacity: 0,
                filter: filter ? "blur(10px)" : "none",
              },
              { duration: 0 }
            );
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentScope = scope.current;
    if (currentScope) {
      observer.observe(currentScope);
    }

    return () => {
      if (currentScope) {
        observer.unobserve(currentScope);
      }
    };
  }, [scope, animate, filter, duration]);

  const renderTextBlocks = () => {
    return (
      <motion.div ref={scope}>
        {/* Map over the array of text blocks */}
        {textBlocks.map((block, blockIdx) => (
          // Each block gets its own container with specific styling
          <div
            key={blockIdx}
            className={cn(
              "dark:text-white text-black leading-snug tracking-wide",
              block.className // Apply custom classes here
            )}
          >
            {block.text.split(" ").map((word, wordIdx) => (
              // Use a React.Fragment to correctly render spaces between words
              <React.Fragment key={`${word}-${wordIdx}`}>
                <motion.span
                  className="opacity-0" // Base opacity
                  style={{
                    filter: filter ? "blur(10px)" : "none",
                    display: "inline-block",
                  }}
                >
                  {word}
                </motion.span>
                {/* Render the space outside the motion span */}
                {" "}
              </React.Fragment>
            ))}
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    // Removed font-bold from the main container
    <div className={cn("max-w-4xl mx-auto", className)}>
      <div className="mt-4">{renderTextBlocks()}</div>
    </div>
  );
};
