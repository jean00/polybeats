import React from "react";

interface BeatsVisualizerProps {
  activeBeat: number;
  index: number;
}

const BeatsVisualizer = ({ activeBeat, index }: BeatsVisualizerProps) => {
  return (
    <div
      key={index}
      className={`h-8 w-8 rounded-full border-2 transition-all duration-75 ${
        activeBeat === index
          ? "scale-110 border-blue-400 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]"
          : "border-slate-700 bg-transparent"
      }`}
    />
  );
};

export default BeatsVisualizer;
