import React, { useState } from 'react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { CardOption } from '@/types/StoreConfigTypes';
import ProductCardInspector from './ProductCardInspector';
import TogglableCard from '@/components/partials/TooglableCard'; // existing component (with typo in path as per codebase)
import SkeletonProductCard from '@/components/partials/previewSkeletons/SkeletonProductCard';
import { Layout, Smartphone, ArrowRight, Settings } from 'lucide-react';
import Card1 from '../cardsPrototypes/Card1';
import Card2 from '../cardsPrototypes/Card2';
import Card3 from '../cardsPrototypes/Card3';
import Card4 from '../cardsPrototypes/Card4';
import { Card5 } from '../cardsPrototypes/Card5';
import { Card6 } from '../cardsPrototypes/Card6';

export const DEFAULT_PRODUCT: any = {
  id: 'p1',
  name: 'Ergonomic Chair',
  price: 299.99,
  rating: 4.8,
  image: 'https://picsum.photos/600/600',
  description: 'Premium mesh ergonomic chair with lumbar support and adjustable headrest.',
};

const templates = [
  { style: 'card-1', label: 'Classic Grid', image: '/images/cards/card1.png' },
  { style: 'card-2', label: 'Horizontal List', image: '/images/cards/card2.png' },
  { style: 'card-3', label: 'Premium Gradient', image: '/images/cards/card3.png' },
  { style: 'card-4', label: 'Dark Overlay', image: '/images/cards/card4.png' },
  { style: 'card-5', label: 'Minimalist', image: '/images/cards/card5.png' },
  { style: 'card-6', label: 'Compact', image: '/images/cards/card6.png' },
];

const componentMap: Record<string, React.FC<any>> = {
  'card-1': Card1,
  'card-2': Card2,
  'card-3': Card3,
  'card-4': Card4,
  'card-5': Card5,
  'card-6': Card6,
};

const CardsConfig: React.FC = () => {
  const { state: { currentTheme, currentCardConf }, dispatch } = useStoreConfigCtx();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [previewCardStyle, setPreviewCardStyle] = useState<CardOption>(currentCardConf.cardId);
  const [selectedElement, setSelectedElement] = useState<string>('container');

  const handleSetSelectedCardId = (id: CardOption) => {
    dispatch({
      type: "SET_CARD",
      payload: { ...currentCardConf, cardId: id }
    });
  };

  const updateConfig = (path: string, value: any) => {
    dispatch({
      type: "SET_CARD",
      payload: { ...currentCardConf, [path]: value }
    });
  };

  const SelectedComponent = componentMap[previewCardStyle] || Card1;

  return (
    <div className="flex h-screen overflow-hidden" 
      style={{ background: currentTheme.bg, color: currentTheme.text }}
    >
      {/* 1. Left Sidebar: Template Selection */}
      <aside 
        style={{ 
          width: leftOpen ? 280 : 0, 
          transition: 'width 0.3s', 
          borderRight: `1px solid ${currentTheme.border}`,
          background: currentTheme.bgSecondary,
          overflowY: 'auto'
        }}
        className="flex-shrink-0 no-scrollbar"
      >
        <div className="p-4">
           <h2 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-6">Templates</h2>
           <div className="flex flex-col gap-4">
              {templates.map((template) => (
                <TogglableCard 
                  key={template.style}
                  option={template}
                  isCurrent={currentCardConf.cardId === template.style}
                  isPreview={previewCardStyle === template.style}
                  handleOptionToggle={(style: any) => handleSetSelectedCardId(style)}
                  changeToggledStyle={(style: any) => setPreviewCardStyle(style)}
                >
                  <div className="scale-75 origin-top">
                    <SkeletonProductCard />
                  </div>
                </TogglableCard>
              ))}
           </div>
        </div>
      </aside>

      {/* 2. Middle: Preview Panel */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden relative">
        {/* Floating Sidebar Toggles */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
          <button 
            onClick={() => setLeftOpen(!leftOpen)}
            className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border hover:scale-110 transition-all active:scale-95"
            style={{ color: currentTheme.text, borderColor: currentTheme.border }}
          >
            <Layout size={20} />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-bold shadow-lg bg-white dark:bg-gray-800"
            style={{ borderColor: currentTheme.border, color: currentTheme.text }}
          >
            <Smartphone size={14} className="text-blue-500" />
            PREVIEW MODE
          </div>
        </div>

        {/* Right Toggle */}
        <button 
          onClick={() => setRightOpen(!rightOpen)}
          className="absolute top-6 right-6 z-20 p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border hover:scale-110 transition-all active:scale-95"
          style={{ color: currentTheme.text, borderColor: currentTheme.border }}
        >
          {rightOpen ? <ArrowRight size={20} /> : <Settings size={20} />}
        </button>

        <div className="flex-1 flex items-center justify-center p-8 md:p-12 h-full overflow-auto">
           {/* Card Viewer Container — no overflow-hidden so outlines and clicks aren't clipped */}
           <div className="relative w-full max-w-[380px] flex items-center justify-center bg-slate-50/50 dark:bg-black/20 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 py-12 px-6">
              {/* 85% constraint: max-w on the card itself, not height clipping */}
              <div
                className="w-full transition-all duration-300"
                style={{ maxHeight: '85vh', overflowY: 'auto' }}
              >
                 <SelectedComponent 
                    product={DEFAULT_PRODUCT} 
                    config={currentCardConf} 
                    selectedElement={selectedElement}
                    onSelectElement={setSelectedElement}
                 />
              </div>
           </div>
        </div>
      </main>

      {/* 3. Right Sidebar: Inspector */}
      <ProductCardInspector 
        open={rightOpen}
        onToggle={() => setRightOpen(!rightOpen)}
        config={currentCardConf}
        onUpdate={updateConfig}
        selectedElement={selectedElement}
        onSelectElement={setSelectedElement}
      />
    </div>
  );
};

export default CardsConfig;
