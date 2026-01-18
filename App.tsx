import React, { useState } from 'react';
import { ArrowLeftRight, User, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublishRequest from './views/Client/PublishRequest';
import RequestDetails from './views/Client/RequestDetails';
import OrderHall from './views/Provider/OrderHall';
import { Role } from './types';

export default function App() {
  const [role, setRole] = useState<Role>('CLIENT');
  // Client View State: 'PUBLISH' | 'DETAILS'
  const [clientView, setClientView] = useState<'PUBLISH' | 'DETAILS'>('PUBLISH');

  const toggleRole = () => {
    setRole(prev => prev === 'CLIENT' ? 'PROVIDER' : 'CLIENT');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative overflow-hidden shadow-2xl">
      {/* Content Area */}
      <AnimatePresence mode="wait">
        {role === 'CLIENT' ? (
          <motion.div
            key="client"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {clientView === 'PUBLISH' ? (
              <PublishRequest onPublish={() => setClientView('DETAILS')} />
            ) : (
              <RequestDetails onBack={() => setClientView('PUBLISH')} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="provider"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full"
          >
            <OrderHall />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Role Switcher FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleRole}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-black text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
           <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
           <ArrowLeftRight size={24} />
           
           {/* Tooltip Label */}
           <div className="absolute right-full mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm">
             切换为 {role === 'CLIENT' ? '服务者' : '客户'}
           </div>
        </button>
      </div>
      
      {/* Role Indicator (Top Left Overlay) */}
      <div className="fixed top-20 left-4 z-0 pointer-events-none opacity-50 mix-blend-multiply">
         <div className="flex flex-col gap-1">
             <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Current View</span>
             <div className="flex items-center gap-1 text-gray-800 font-bold text-xl">
                {role === 'CLIENT' ? <User size={20} /> : <Briefcase size={20} />}
                {role === 'CLIENT' ? 'CLIENT' : 'PROVIDER'}
             </div>
         </div>
      </div>
    </div>
  );
}
