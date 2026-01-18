import React from 'react';
import { motion } from 'framer-motion';

export const Radar: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Central Dot */}
      <div className="w-3 h-3 bg-blue-500 rounded-full z-10 shadow-lg shadow-blue-500/50" />
      
      {/* Ripple 1 */}
      <motion.div
        className="absolute w-full h-full border border-blue-400/30 rounded-full bg-blue-400/10"
        animate={{ scale: [0.5, 1.5], opacity: [0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      
      {/* Ripple 2 */}
      <motion.div
        className="absolute w-full h-full border border-blue-400/20 rounded-full"
        animate={{ scale: [0.5, 1.5], opacity: [0.6, 0] }}
        transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: "easeOut" }}
      />
      
      {/* Rotating Scan Line (Optional, keeping it simple for now as requested by style) */}
    </div>
  );
};
