import React, { useState } from 'react';
import { ArrowLeft, Edit2, XCircle, CheckCircle, MessageCircle, Star, ShieldCheck, ShoppingBag, Send, Zap, Clock, Signal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar } from '../../components/Shared/Radar';
import { MOCK_WORKERS, MOCK_RECOMMENDED } from '../../constants';

interface RequestDetailsProps {
  onBack: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ onBack }) => {
  const [status, setStatus] = useState<'ONGOING' | 'COMPLETED'>('ONGOING');
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [recommended, setRecommended] = useState(MOCK_RECOMMENDED);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  
  // Batch Message State
  const [batchMessage, setBatchMessage] = useState('');
  const [isSendingBatch, setIsSendingBatch] = useState(false);

  // Mock Request Data (Simulating what was passed from previous screen)
  const myRequest = {
      type: '家政保洁',
      summary: '家里大扫除，需要擦玻璃。大概3个小时工作量，需要带工具。',
      time: '明天上午 (8:00-12:00)',
      address: '阳光花园 3期',
      waitingTime: '约12小时'
  };

  const handleRemoveWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  const handleRemoveRecommended = (id: string) => {
    setRecommended(prev => prev.filter(w => w.id !== id));
  };

  const handleCancel = () => {
    setShowConfirmCancel(true);
  };

  const confirmCancelAction = () => {
    setShowConfirmCancel(false);
    onBack();
  };

  const handleBatchSend = () => {
      if (!batchMessage) return;
      setIsSendingBatch(true);
      // Simulate API call
      setTimeout(() => {
          setIsSendingBatch(false);
          setBatchMessage('');
          alert(`已成功发送给 ${workers.length} 位服务者！`);
      }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] relative">
      {/* Navbar */}
      <div className="bg-white sticky top-0 z-20 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <span className="font-semibold text-lg">
            {status === 'ONGOING' ? '进行中' : '已完成'}
        </span>
        <div className="w-8" />
      </div>

      <div className="p-4 space-y-4 pb-24">
        
        {/* My Request Summary Card (With Actions) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold text-gray-900">{myRequest.type}</h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{myRequest.time}</span>
            </div>
            
            {/* Waiting Time Indicator */}
            {status === 'ONGOING' && (
                <div className="flex items-center text-xs font-medium text-orange-500 mb-3 bg-orange-50 self-start px-2 py-0.5 rounded-md w-fit">
                    <Clock size={12} className="mr-1" />
                    已等待 {myRequest.waitingTime}
                </div>
            )}

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {myRequest.summary}
            </p>
            
            {/* Actions Row within the card */}
            {status === 'ONGOING' && (
                <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium active:bg-gray-50">
                        <Edit2 size={12} /> 修改
                    </button>
                    <button onClick={handleCancel} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium active:bg-red-50 active:text-red-600 active:border-red-200">
                        <XCircle size={12} /> 取消
                    </button>
                    <button onClick={() => setStatus('COMPLETED')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-medium active:bg-green-100">
                        <CheckCircle size={12} /> 完成
                    </button>
                </div>
            )}
        </div>

        {/* Batch Message Input Section */}
        {status === 'ONGOING' && workers.length > 0 && (
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-4 shadow-sm border border-blue-100/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
                            <MessageCircle size={16} fill="currentColor" className="opacity-20" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">向大家提问</span>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Zap size={10} fill="currentColor" />
                        {workers.length} 位服务者在线
                    </span>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={batchMessage}
                        onChange={(e) => setBatchMessage(e.target.value)}
                        placeholder="我想问：请问自带清洁工具吗？"
                        className="w-full bg-white text-sm text-gray-900 rounded-xl pl-4 pr-24 py-3 outline-none border border-gray-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleBatchSend}
                        disabled={!batchMessage || isSendingBatch}
                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#007AFF] text-white px-3 rounded-lg text-xs font-bold disabled:opacity-50 disabled:bg-gray-300 transition-all flex items-center gap-1 shadow-md shadow-blue-500/20"
                    >
                        {isSendingBatch ? '发送中...' : (
                            <>
                                <Send size={12} /> 一键发送
                            </>
                        )}
                    </button>
                </div>
            </div>
        )}

        {/* Workers List */}
        <div>
            <div className="flex items-center justify-between mb-3 px-1">
                 <h4 className="text-sm font-semibold text-gray-600">可接单服务者</h4>
                 {/* Live Status Badge */}
                 <div className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] text-green-700 font-medium">实时更新中</span>
                 </div>
            </div>

            {/* Redesigned Status / Radar Module */}
            <div className="bg-white rounded-xl p-3 shadow-sm border border-blue-100 mb-4 flex items-center gap-4 relative overflow-hidden">
                 {/* Background Decoration */}
                 <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-blue-50 via-blue-50/50 to-transparent opacity-80 pointer-events-none" />
                 
                 {/* Radar */}
                 <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-50 border border-blue-100 z-10">
                     <div className="scale-[0.65]">
                        <Radar />
                     </div>
                 </div>
                 
                 {/* Text Info */}
                 <div className="flex-1 z-10">
                     <div className="flex items-center justify-between mb-0.5">
                         <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
                            <Signal size={12} />
                            系统智能调度
                         </span>
                         <span className="text-[10px] text-gray-400">附近的 3km 范围</span>
                     </div>
                     <p className="text-sm text-gray-600 leading-tight">
                        已通知 <span className="font-bold text-gray-900 mx-0.5">12</span> 位，已有 <span className="font-bold text-blue-600 text-lg mx-0.5">{workers.length}</span> 位接单
                     </p>
                 </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {workers.map((worker) => (
                        <motion.div
                            key={worker.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ x: -100, opacity: 0 }}
                            className="bg-white rounded-2xl p-4 shadow-sm overflow-hidden"
                        >
                            {/* Header: Info */}
                            <div className="flex items-start gap-4 mb-3">
                                <div className="relative flex-shrink-0">
                                    <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-[10px] font-bold px-1 py-0.5 rounded text-yellow-900 border border-white flex items-center">
                                        {worker.rating} <Star size={8} fill="currentColor" className="ml-0.5"/>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-gray-900 text-base">{worker.name}</h3>
                                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">{worker.title}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                        <span>{worker.age}岁</span>
                                        <span className="w-px h-3 bg-gray-300"/>
                                        <span>{worker.experience}年经验</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {worker.tags.map(tag => (
                                            <span key={tag} className="flex items-center text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                <ShieldCheck size={10} className="mr-1 text-green-500" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Product Box */}
                            <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <ShoppingBag size={14} className="text-orange-500" />
                                        <span className="text-sm font-semibold text-gray-800">{worker.productName}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-red-500 font-bold text-base">¥{worker.price}</span>
                                        <span className="text-gray-400 text-xs">/小时</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pl-5">
                                    {worker.productTags?.map(tag => (
                                        <span key={tag} className="text-[10px] text-gray-400 border border-gray-200 px-1.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Buttons: 3 Columns Layout */}
                            <div className="grid grid-cols-3 gap-2.5">
                                <button
                                    onClick={() => handleRemoveWorker(worker.id)}
                                    className="col-span-1 py-2.5 rounded-xl text-gray-400 bg-white border border-gray-200 text-xs font-medium active:bg-gray-50 transition-all"
                                >
                                    不满意
                                </button>
                                <button
                                    onClick={() => alert(`进入与 ${worker.name} 的聊天界面`)}
                                    className="col-span-1 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold active:bg-blue-100 transition-all flex items-center justify-center gap-1 relative"
                                >
                                    <MessageCircle size={14} />
                                    聊需求
                                    {worker.unreadMessages && worker.unreadMessages > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border border-white shadow-sm z-10">
                                            {worker.unreadMessages}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => alert(`已向 ${worker.name} 发起预约！`)}
                                    className="col-span-1 py-2.5 rounded-xl text-white bg-[#007AFF] text-xs font-bold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
                                >
                                    预约下单
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {workers.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-xs bg-white rounded-xl border border-dashed border-gray-200">
                        暂无更多接单者
                    </div>
                )}
            </div>
        </div>

        {/* System Recommended List */}
        <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">系统推荐</h4>
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {recommended.map((person) => (
                         <motion.div
                            key={person.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full object-cover grayscale opacity-80" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-gray-700 text-sm">{person.name}</h3>
                                        <div className="flex items-center text-xs text-orange-400 font-medium">
                                            <Star size={10} fill="currentColor" className="mr-0.5"/>
                                            {person.rating}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">{person.title} · {person.age}岁 · {person.experience}年经验</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {person.tags.map(tag => (
                                            <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Buttons matching Acceptable Workers style */}
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleRemoveRecommended(person.id)}
                                    className="py-2.5 rounded-xl text-gray-500 bg-white border border-gray-200 text-sm font-medium active:bg-gray-50 transition-all"
                                >
                                    不满意
                                </button>
                                <button className="relative flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium active:bg-blue-100 transition-all">
                                    <MessageCircle size={14} />
                                    和Ta沟通
                                    {person.unreadMessages && person.unreadMessages > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border border-white shadow-sm z-10">
                                            {person.unreadMessages}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {recommended.length === 0 && (
                     <div className="text-center py-4 text-gray-300 text-xs">
                        暂无推荐
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showConfirmCancel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowConfirmCancel(false)}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl w-full max-w-xs p-6 z-10 text-center shadow-xl"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">确认取消需求?</h3>
                    <p className="text-gray-500 text-sm mb-6">取消后将不再通知附近的服务者。</p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowConfirmCancel(false)}
                            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium"
                        >
                            暂不
                        </button>
                        <button
                            onClick={confirmCancelAction}
                            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium"
                        >
                            确认取消
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestDetails;