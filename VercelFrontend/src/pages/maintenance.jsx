import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Hammer, Wrench, Bell } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-2xl w-full text-center z-10">
        {/* Animated Icon Set */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-xl"
          >
            <Settings className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-xl mt-4"
          >
            <Hammer className="w-8 h-8 text-purple-400" />
          </motion.div>
        </div>

        {/* Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">System Upgrade in Progress</span>
        </motion.div>

        {/* Main Content */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Refining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Experience.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed max-w-lg mx-auto"
        >
          We're currently performing scheduled maintenance to bring you something better. We'll be back online shortly.
        </motion.p>

        {/* Interactive Elements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >


        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4"
        >
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenancePage;