import React, { useState, useMemo } from 'react';
import { MapPin, Power, MessageSquare, Briefcase, CheckCircle2, Clock, Navigation, Zap, Coffee, Bell, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_ORDERS } from '../../constants';
import { Order } from '../../types';

// Helper to parse distance strings (e.g., "500m", "1.2km") into meters for sorting
const parseDistance = (dist: string): number => {
    if (!dist) return 999999;
    const value = parseFloat(dist.replace(/[^\d.]/g, ''));
    if (dist.includes('km')) return value * 1000;
    return value;
};

// Helper to mask address
const maskAddress = (address: string) => {
    if (!address) return "地址信息保护中";
    const parts = address.split(' ');
    if (parts.length > 2) {
        return `${parts[0]} ${parts[1]} ***`;
    }
    return `${address.substring(0, address.length - 3)}***`;
};

const OrderHall: React.FC = () => {
  // Renamed from isListening to isActive (On Duty state)
  const [isActive, setIsActive] = useState(false);
  
  // Main Tab State
  const [activeTab, setActiveTab] = useState<'PENDING' | 'MATCHED'>('PENDING');
  
  // Filter States
  const [pendingFilter, setPendingFilter] = useState<'ALL' | 'NEAREST'>('ALL');
  const [matchedFilter, setMatchedFilter] = useState<'ALL' | 'WAITING' | 'ACCEPTED'>('ALL');

  // Data Sources
  const [pendingOrders, setPendingOrders] = useState<Order[]>(MOCK_ORDERS.filter(o => o.status === 'PENDING'));
  const [matchedOrders, setMatchedOrders] = useState<Order[]>(MOCK_ORDERS.filter(o => o.status === 'MATCHED' || o.status === 'WAITING_CONFIRMATION'));
  
  // Stats
  const [stats, setStats] = useState({ pushed: 12, matched: 5, taken: 2 });

  // Compute Filtered Lists
  const displayPendingOrders = useMemo(() => {
      let orders = [...pendingOrders];
      if (pendingFilter === 'NEAREST') {
          orders.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
      }
      return orders;
  }, [pendingOrders, pendingFilter]);

  const displayMatchedOrders = useMemo(() => {
      return matchedOrders.filter(order => {
          if (matchedFilter === 'ALL') return true;
          if (matchedFilter === 'WAITING') return order.status === 'WAITING_CONFIRMATION';
          if (matchedFilter === 'ACCEPTED') return order.status === 'MATCHED';
          return true;
      });
  }, [matchedOrders, matchedFilter]);

  const handleTakeOrder = (order: Order) => {
    setPendingOrders(prev => prev.filter(o => o.id !== order.id));
    const newOrder: Order = { ...order, status: 'WAITING_CONFIRMATION' };
    setMatchedOrders(prev => [newOrder, ...prev]);
    setStats(prev => ({ ...prev, matched: prev.matched + 1 }));
  };

  const handleIgnoreOrder = (id: string) => {
    setPendingOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-20">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-center text-gray-900 pt-3 pb-1">接单大厅</h1>
        
        {/* Sub Header (Location only) */}
        <div className="px-4 pb-3 pt-2 flex items-center justify-center relative">
             {/* Centered Location */}
            <div className="flex items-center text-gray-900 bg-gray-100/50 py-1.5 px-3 rounded-full">
                <MapPin size={14} className="text-blue-500 mr-1.5" />
                <span className="font-medium text-xs">阳光花园 3期</span>
            </div>
        </div>
      </div>

      {/* Dashboard / Check-in Area */}
      <div className="p-4">
        <AnimatePresence mode="wait">
            {!isActive ? (
                /* Offline State: Check-in Card */
                <motion.div
                    key="offline"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                        <Zap size={32} strokeWidth={2} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">开启今日接单推送</h2>
                    <p className="text-sm text-gray-500 mb-6">打卡上线，系统将为您匹配附近的优质需求</p>
                    <button
                        onClick={() => setIsActive(true)}
                        className="w-full bg-[#007AFF] text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Power size={18} />
                        立即开启接单
                    </button>
                </motion.div>
            ) : (
                /* Online State: Data Dashboard */
                <motion.div
                    key="online"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl p-4 shadow-sm relative"
                >
                    {/* Status Indicator */}
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-bold text-gray-700">接单中</span>
                        </div>
                        <button 
                            onClick={() => setIsActive(false)}
                            className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 hover:bg-gray-100"
                        >
                            <Coffee size={12} />
                            休息一下
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.pushed}</div>
                            <div className="text-xs text-gray-400 mt-1">今日推送</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{stats.matched}</div>
                            <div className="text-xs text-gray-400 mt-1">今日匹配</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">{stats.taken}</div>
                            <div className="text-xs text-gray-400 mt-1">今日接单</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="bg-gray-200/50 p-1 rounded-xl flex">
            <button
                onClick={() => setActiveTab('PENDING')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'PENDING' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
            >
                系统推荐需求
            </button>
            <button
                onClick={() => setActiveTab('MATCHED')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'MATCHED' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
            >
                我的接单
            </button>
        </div>
      </div>

      {/* Filter Row (Contextual) */}
      <div className="px-4 mb-3 flex gap-2 overflow-x-auto no-scrollbar">
         {activeTab === 'PENDING' ? (
             isActive ? (
                <>
                    <button 
                        onClick={() => setPendingFilter('ALL')}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            pendingFilter === 'ALL' 
                            ? 'bg-white border-blue-200 text-blue-600' 
                            : 'bg-transparent border-gray-300 text-gray-500'
                        }`}
                    >
                        全部 (最新)
                    </button>
                    <button 
                        onClick={() => setPendingFilter('NEAREST')}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            pendingFilter === 'NEAREST' 
                            ? 'bg-white border-blue-200 text-blue-600' 
                            : 'bg-transparent border-gray-300 text-gray-500'
                        }`}
                    >
                        距离最近
                    </button>
                </>
             ) : null // Hide filters if offline for Pending tab
         ) : (
            <>
                <button 
                    onClick={() => setMatchedFilter('ALL')}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        matchedFilter === 'ALL' 
                        ? 'bg-white border-blue-200 text-blue-600' 
                        : 'bg-transparent border-gray-300 text-gray-500'
                    }`}
                >
                    全部
                </button>
                <button 
                    onClick={() => setMatchedFilter('WAITING')}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        matchedFilter === 'WAITING' 
                        ? 'bg-white border-blue-200 text-blue-600' 
                        : 'bg-transparent border-gray-300 text-gray-500'
                    }`}
                >
                    待确认
                </button>
                <button 
                    onClick={() => setMatchedFilter('ACCEPTED')}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        matchedFilter === 'ACCEPTED' 
                        ? 'bg-white border-blue-200 text-blue-600' 
                        : 'bg-transparent border-gray-300 text-gray-500'
                    }`}
                >
                    已接单
                </button>
            </>
         )}
      </div>

      {/* Order List */}
      <div className="px-4 space-y-4">
        <AnimatePresence mode="popLayout">
            {activeTab === 'PENDING' ? (
                isActive ? (
                    // ONLINE: Show List
                    displayPendingOrders.map((order) => (
                        <motion.div
                            key={order.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                        >
                             {/* ... (Existing Pending Order Card Structure) ... */}
                             {/* 1. Header: Service Type & Time */}
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-900">{order.serviceType}</h3>
                                <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                    <Clock size={12} className="mr-1" />
                                    <span className="text-xs font-bold">{order.time.split(' ')[0]}</span>
                                </div>
                            </div>

                            {/* 2. User Info Group */}
                            <div className="flex items-center gap-3 mb-4">
                                <img src={order.clientAvatar} className="w-10 h-10 rounded-full object-cover bg-gray-200" alt="avatar" />
                                <div className="flex flex-col">
                                    <span className="text-gray-900 font-medium text-sm">{order.clientName}</span>
                                    {/* UPDATED TAGS HERE */}
                                    <div className="flex gap-1 mt-0.5">
                                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">取消少</span>
                                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">支付快</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Info Block (Address & Details) */}
                            <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
                                 {/* Address (Masked) */}
                                 <div className="flex items-start text-sm">
                                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="ml-2 flex-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 font-medium">{maskAddress(order.address)}</span>
                                            <span className="text-blue-500 font-bold text-xs bg-white px-1.5 rounded border border-blue-100 shadow-sm">{order.distance}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">接单后可见详细门牌号</p>
                                    </div>
                                 </div>
                                 
                                 <div className="w-full h-px bg-gray-200/50 my-1" />
                                 
                                 {/* Summary */}
                                 <div className="flex items-start text-sm">
                                    <MessageSquare size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <p className="ml-2 text-gray-600 line-clamp-2 leading-relaxed">{order.summary}</p>
                                 </div>
                            </div>

                            {/* 4. Actions */}
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => handleIgnoreOrder(order.id)}
                                    className="col-span-1 py-2.5 rounded-xl border border-gray-200 text-gray-400 text-sm font-medium active:bg-gray-50 transition-colors"
                                >
                                    不能接
                                </button>
                                <button
                                    onClick={() => alert('进入模拟聊天')}
                                    className="col-span-1 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium active:bg-blue-100 transition-colors relative"
                                >
                                    聊需求
                                    {order.unreadMessages && order.unreadMessages > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border border-white shadow-sm z-10">
                                            {order.unreadMessages}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleTakeOrder(order)}
                                    className="col-span-1 py-2.5 rounded-xl bg-[#007AFF] text-white text-sm font-medium shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all"
                                >
                                    我能接
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    // OFFLINE: Empty State
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="flex flex-col items-center justify-center py-16 px-6 text-center"
                    >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                             <Bell size={32} />
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg mb-2">待开启接单</h3>
                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                            开启接单状态，系统将为您匹配附近的优质需求，不错过任何赚钱机会。
                        </p>
                    </motion.div>
                )
            ) : (
                // MATCHED TAB: Always Visible regardless of status
                displayMatchedOrders.map((order) => (
                    <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${
                            order.status === 'MATCHED' ? 'border-green-200' : 'border-orange-200'
                        }`}
                    >
                         {/* ... (Existing Matched Order Card Structure) ... */}
                         {/* Status Header */}
                         <div className={`px-4 py-2 flex justify-between items-center ${
                             order.status === 'MATCHED' ? 'bg-green-50' : 'bg-orange-50'
                         }`}>
                             <div className="flex items-center gap-2">
                                <Briefcase size={16} className={order.status === 'MATCHED' ? 'text-green-600' : 'text-orange-600'}/>
                                <span className={`font-bold text-sm ${
                                    order.status === 'MATCHED' ? 'text-green-800' : 'text-orange-800'
                                }`}>
                                    {order.serviceType}
                                </span>
                             </div>
                             <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 bg-white/60 ${
                                    order.status === 'MATCHED' 
                                    ? 'text-green-700' 
                                    : 'text-orange-700'
                                }`}
                             >
                                {order.status === 'MATCHED' ? (
                                    <><CheckCircle2 size={12} /> 进行中</>
                                ) : (
                                    <><Clock size={12} /> 等待确认</>
                                )}
                             </span>
                         </div>

                         <div className="p-4">
                            {/* Client Info Row */}
                             <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={order.clientAvatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                                    <div>
                                        <p className="text-gray-900 font-bold text-sm">{order.clientName}</p>
                                        <div className="flex gap-1 mt-0.5">
                                            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">取消少</span>
                                            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">支付快</span>
                                            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">验收快</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="relative p-2 rounded-full bg-gray-100 text-gray-600 active:bg-gray-200">
                                    <MessageSquare size={18} />
                                    {order.unreadMessages && order.unreadMessages > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border border-white shadow-sm z-10">
                                            {order.unreadMessages}
                                        </span>
                                    )}
                                </button>
                             </div>

                             {/* Full Details Block */}
                             <div className="space-y-3 mb-4">
                                <div className="flex items-start gap-2.5">
                                    <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 mb-0.5">服务时间</p>
                                        <p className="text-sm text-gray-800 font-medium">{order.time}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-2.5">
                                    <Navigation size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 mb-0.5">服务地址 (导航)</p>
                                        <p className="text-sm text-gray-800 font-medium break-words">
                                            {/* Show Full Address if Matched/Accepted */}
                                            {order.status === 'MATCHED' ? order.address : maskAddress(order.address)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <MessageSquare size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 mb-0.5">需求详情</p>
                                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-2 rounded-lg">{order.summary}</p>
                                    </div>
                                </div>
                             </div>

                             {/* Actions */}
                             <div className="flex justify-end pt-2 border-t border-gray-100">
                                {order.status !== 'WAITING_CONFIRMATION' && (
                                    <button className="flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold active:bg-blue-100 transition-colors">
                                        查看订单 <ChevronRight size={14} />
                                    </button>
                                )}
                                {order.status === 'WAITING_CONFIRMATION' && (
                                    <span className="text-xs text-orange-400 py-2">
                                        等待客户确认您的接单申请...
                                    </span>
                                )}
                             </div>
                         </div>
                    </motion.div>
                ))
            )}
            
            {/* Empty States for Online Mode */}
            {activeTab === 'PENDING' && isActive && displayPendingOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <CheckCircle2 size={48} className="mb-2 opacity-20" />
                    <p>暂无新需求</p>
                </div>
            )}
            
            {activeTab === 'MATCHED' && displayMatchedOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Briefcase size={48} className="mb-2 opacity-20" />
                    <p>暂无相关订单</p>
                </div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderHall;