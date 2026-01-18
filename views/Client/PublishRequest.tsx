import React, { useState, useEffect } from 'react';
import { MapPin, Camera, Sparkles, ChevronRight, X, Calendar as CalendarIcon, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../../constants';

interface PublishRequestProps {
  onPublish: () => void;
}

// Generate next 7 days options for the dropdown
const generateTimeOptions = () => {
  const options: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekDay = i === 0 ? '今天' : i === 1 ? '明天' : ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
    const dateStr = `${weekDay} ${month}月${day}日`;
    
    options.push(`${dateStr} 上午 (08:00-12:00)`);
    options.push(`${dateStr} 下午 (13:00-18:00)`);
  }
  return options;
};

const TIME_OPTIONS_LIST = generateTimeOptions();

const PublishRequest: React.FC<PublishRequestProps> = ({ onPublish }) => {
  const [description, setDescription] = useState('');
  
  // Time Selection State
  const [selectedTimeOption, setSelectedTimeOption] = useState('');
  const [showTimeSheet, setShowTimeSheet] = useState(false);
  
  // Category State (Multi-select)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // AI States
  const [showAiToast, setShowAiToast] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Helper function to simulate AI logic
  const performAnalysis = (text: string) => {
    let newSuggestions = ['家政保洁', '收纳整理']; // Default
    
    if (text.includes('修') || text.includes('坏') || text.includes('漏') || text.includes('水') || text.includes('电')) {
         newSuggestions = ['家庭维修', '水电急修'];
    } else if (text.includes('狗') || text.includes('猫') || text.includes('宠') || text.includes('遛')) {
         newSuggestions = ['宠物服务', '家庭寄养'];
    } else if (text.includes('送') || text.includes('取') || text.includes('拿') || text.includes('跑')) {
         newSuggestions = ['跑腿代办', '同城急送'];
    } else if (text.includes('搬') || text.includes('货') || text.includes('运')) {
         newSuggestions = ['搬家拉货', '协助搬运'];
    }
    return newSuggestions;
  };

  // AI Analysis Logic with Debounce
  useEffect(() => {
    // 1. Reset if description is too short
    if (description.length <= 5) {
        setShowAiToast(false);
        setIsAiAnalyzing(false);
        return;
    }
    
    // 2. User is typing or text changed:
    setShowAiToast(false);
    setIsAiAnalyzing(true);

    // 3. Set debounce timer for 3 seconds (3000ms)
    const timer = setTimeout(() => {
        setIsAiAnalyzing(false);
        const results = performAnalysis(description);
        setSuggestedCategories(results);
        setShowAiToast(true);
    }, 3000);

    // Cleanup timer on next keypress (debounce)
    return () => clearTimeout(timer);
  }, [description]);

  // Manual Regenerate Handler
  const handleRegenerate = () => {
    setShowAiToast(false);
    setIsAiAnalyzing(true);
    
    setTimeout(() => {
        setIsAiAnalyzing(false);
        // Simulate a slight variation or just re-run
        const results = performAnalysis(description);
        // For demo purpose, maybe reverse array to show it did "something"
        setSuggestedCategories([...results].reverse()); 
        setShowAiToast(true);
    }, 1500);
  };

  const handleApplyAi = () => {
    setSelectedCategories(suggestedCategories);
    setShowAiToast(false);
  };

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    );
  };

  const handleAddImage = () => {
    if (images.length < 3) {
      setImages([...images, `https://picsum.photos/200/200?random=${images.length + 100}`]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-32">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-4 py-3 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-center text-gray-900">发布需求</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Location */}
        <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm active:scale-95 transition-transform">
          <div className="flex items-center space-x-3 text-gray-900">
            <div className="bg-blue-50 p-2 rounded-full">
              <MapPin size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">当前定位</p>
              <p className="font-medium">阳光花园 3期</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>

        {/* Service Time Selector (Dropdown/Sheet Interaction) */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-3 text-gray-900">
            <CalendarIcon size={18} className="text-gray-500" />
            <span className="font-medium">期望服务时间</span>
          </div>
          
          <button
            onClick={() => setShowTimeSheet(true)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-colors ${
              selectedTimeOption 
                ? 'bg-blue-50 border-blue-500 text-blue-900 font-medium' 
                : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            <span>{selectedTimeOption || "请选择服务时间"}</span>
            <ChevronDown size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Description & AI */}
        <div className="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请输入需求描述... (输入超过5个字自动触发 AI 分析)"
            className="w-full h-32 resize-none outline-none text-gray-900 placeholder-gray-400 bg-transparent text-base"
          />
          
          {/* AI Analyzing Shimmer */}
          <AnimatePresence>
            {isAiAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-2 right-4 flex items-center space-x-2 text-blue-500 text-xs font-medium bg-blue-50/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-100 shadow-sm z-10"
              >
                <Sparkles size={14} className="animate-spin-slow text-blue-600" />
                <span className="text-blue-600">AI 分析中...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Toast */}
          <AnimatePresence>
            {showAiToast && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center space-x-2 flex-1 relative z-10">
                  <div className="bg-white p-1 rounded-full shadow-sm flex-shrink-0">
                     <Sparkles size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-blue-900 leading-tight">
                    AI 识别您需要 <span className="font-bold">【{suggestedCategories.join('、')}】</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2 relative z-10 ml-2">
                    {/* Regenerate Button */}
                    <button 
                        onClick={handleRegenerate}
                        className="p-1.5 rounded-md text-blue-400 hover:text-blue-600 hover:bg-blue-100/50 transition-colors"
                        title="重新生成"
                    >
                        <RefreshCw size={14} />
                    </button>
                    
                    {/* Apply Button */}
                    <button
                    onClick={handleApplyAi}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap"
                    >
                    应用
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category */}
        <div
          onClick={() => setShowCategorySheet(true)}
          className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm active:scale-95 transition-transform"
        >
          <span className="font-medium text-gray-900 flex-shrink-0">需求分类</span>
          <div className="flex items-center space-x-2 overflow-hidden pl-4">
            {selectedCategories.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto no-scrollbar mask-image-linear-to-r">
                    {selectedCategories.map(cat => (
                        <span key={cat} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium whitespace-nowrap">
                            {cat}
                        </span>
                    ))}
                </div>
            ) : (
                <span className="text-gray-400">请选择</span>
            )}
            <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
          </div>
        </div>

        {/* Images */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={img} alt="upload" className="w-full h-full object-cover" />
                    <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">
                        <X size={12} />
                    </button>
                </div>
            ))}
            {images.length < 3 && (
                <button
                    onClick={handleAddImage}
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-white flex-shrink-0 active:bg-gray-50"
                >
                    <Camera size={24} className="mb-1" />
                    <span className="text-xs">添加图片</span>
                </button>
            )}
        </div>
      </div>

      {/* Bottom Button Fixed Area */}
      <div className="fixed bottom-0 w-full max-w-md left-0 right-0 mx-auto bg-white border-t border-gray-100 z-30 pb-safe">
        <div className="p-4">
            <button
            onClick={onPublish}
            disabled={!description}
            className="w-full bg-[#007AFF] text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all"
            >
            立即发布需求
            </button>
        </div>
      </div>

      {/* Time Selection Bottom Sheet */}
      <AnimatePresence>
        {showTimeSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTimeSheet(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl z-50 flex flex-col max-h-[70vh]"
            >
              <div className="p-4 border-b border-gray-100 text-center relative">
                 <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3" />
                 <h3 className="text-lg font-semibold">选择服务时间</h3>
                 <button 
                    onClick={() => setShowTimeSheet(false)}
                    className="absolute right-4 top-5 text-gray-400 hover:text-gray-600"
                 >
                    <X size={20} />
                 </button>
              </div>
              
              <div className="overflow-y-auto p-2 pb-8 no-scrollbar">
                {TIME_OPTIONS_LIST.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setSelectedTimeOption(option);
                            setShowTimeSheet(false);
                        }}
                        className={`w-full text-left px-4 py-3.5 rounded-xl text-sm mb-1 transition-colors ${
                            selectedTimeOption === option
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {option}
                    </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Category Bottom Sheet (Multi-select) */}
      <AnimatePresence>
        {showCategorySheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategorySheet(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl z-50 p-6 pb-6 flex flex-col max-h-[80vh]"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-center mb-1 flex-shrink-0">选择需求分类</h3>
              <p className="text-xs text-gray-400 text-center mb-6 flex-shrink-0">可多选</p>
              
              <div className="grid grid-cols-3 gap-3 overflow-y-auto no-scrollbar pb-4">
                {CATEGORIES.map(cat => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                        key={cat}
                        onClick={() => handleToggleCategory(cat)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all relative ${
                            isSelected 
                            ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500/20' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {cat}
                        {isSelected && (
                            <div className="absolute top-1 right-1 text-blue-500">
                                <Check size={12} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setShowCategorySheet(false)}
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                确认选择 {selectedCategories.length > 0 ? `(${selectedCategories.length})` : ''}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublishRequest;