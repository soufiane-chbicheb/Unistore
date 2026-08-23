import React, { useState } from 'react';
import { Settings2, CheckCircle2, Circle, X } from "lucide-react";
import Card1 from '../cardsPrototypes/Card1';
import Card2 from '../cardsPrototypes/Card2';
import Card3 from '../cardsPrototypes/Card3';
import Card4 from '../cardsPrototypes/Card4';
import { Card5 } from '../cardsPrototypes/Card5';
import { Card6 } from '../cardsPrototypes/Card6';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

export const TEMPLATE_NAMES: Record<string, string> = {
  'card-1': 'Classic Grid',
  'card-2': 'Horizontal List',
  'card-3': 'Premium Gradient',
  'card-4': 'Dark Overlay',
  'card-5': 'Minimalist',
  'card-6': 'Compact',
  'card-7': 'Featured',
  'card-8': 'Gallery',
  'card-9': 'Ecommerce',
};

const componentMap: Record<any, React.FC<any>> = {
  'card-1': Card1,
  'card-2': Card2,
  'card-3': Card3,
  'card-4': Card4,
  'card-5': Card5,
  'card-6': Card6,
};

export const ConfigPanel: React.FC<any> = ({ selectedCardId, config, setConfig, product }) => {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const SelectedComponent = componentMap[selectedCardId];
  const [customButtonHover, setCustomButtonHover] = useState(false);
  const { state: { currentTheme } } = useStoreConfigCtx();

  const toggleOption = (key: string) => {
    setConfig((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" 
      style={{ color: currentTheme.text, background: currentTheme.bgSecondary }}
    >
      {/* Header with Customize Button */}
      <div className="flex-none p-6 border-b flex justify-between items-center z-20 shadow-sm"
        style={{ color: currentTheme.text, background: currentTheme.bg, borderColor: currentTheme.border }}
      >
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest opacity-50">Preview</h2>
          <h3 className="font-bold text-lg leading-tight">{TEMPLATE_NAMES[selectedCardId]}</h3>
        </div>
     
        <button 
          onClick={() => setIsCustomizeOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          style={{
            color: customButtonHover ? currentTheme.textInverse : currentTheme.text, 
            background: customButtonHover ? currentTheme.primaryHover : currentTheme.bgSecondary 
          }}
          onMouseEnter={() => setCustomButtonHover(true)}
          onMouseLeave={() => setCustomButtonHover(false)}
        >
          <Settings2 className="w-4 h-4" />
          Customize
        </button>
      </div>

      {/* Main Preview Area */}
      <div className="relative flex justify-center overflow-hidden p-6 bg-transparent">
        {SelectedComponent ? (
            <div className="w-full min-h-[400px] flex justify-center p-4">
               <SelectedComponent product={product} config={config} className="" />
            </div>
        ) : (
            <div className="w-full h-64 flex items-center justify-center rounded-xl"
              style={{ color: currentTheme.text, background: currentTheme.bgSecondary }}
            >
                Select a card
            </div>
        )}
      </div>

      {/* Customization Modal Overlay */}
      {isCustomizeOpen && (
        <div className="absolute inset-0 z-50 backdrop-blur-md flex flex-col animate-in fade-in duration-200"
          style={{ background: `${currentTheme.bg}cc` }}
        >
           {/* Modal Header */}
           <div className="flex items-center justify-between p-6 border-b"
             style={{ background: currentTheme.bg, borderColor: currentTheme.border }}
           >
              <div>
                <h2 className="text-xl font-bold">Card Options</h2>
                <p className="text-sm opacity-60">Configure visible elements</p>
              </div>
              <button 
                onClick={() => setIsCustomizeOpen(false)}
                className="p-2 rounded-full transition-colors opacity-50 hover:opacity-100"
                style={{ hover: { background: currentTheme.bgSecondary } } as any}
              >
                <X className="w-6 h-6" />
              </button>
           </div>

           {/* Modal Content */}
           <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <ToggleItem 
                label="Show Price" 
                description="Display product price"
                active={config.showPrice} 
                onClick={() => toggleOption('showPrice')} 
                theme={currentTheme}
              />
              <ToggleItem 
                label="Show Rating" 
                description="Include star rating & count"
                active={config.showRating} 
                onClick={() => toggleOption('showRating')} 
                theme={currentTheme}
              />
              <ToggleItem 
                label="Show Border" 
                description="Add structural outline"
                active={config.showBorder} 
                onClick={() => toggleOption('showBorder')} 
                theme={currentTheme}
              />

              <div className="mt-8 pt-6 border-t" style={{ borderColor: currentTheme.border }}>
                 <button 
                  onClick={() => setIsCustomizeOpen(false)}
                  className="w-full py-3 font-bold rounded-xl transition-all shadow-lg"
                  style={{ background: currentTheme.primary, color: currentTheme.textInverse }}
                 >
                   Done
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ToggleItem = ({ label, description, active, onClick, theme }: { label: string, description: string, active: boolean, onClick: () => void, theme: any }) => (
    <div 
        onClick={onClick}
        className={`group flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200`}
        style={{
            borderColor: active ? theme.primary : theme.border,
            background: active ? theme.bg : theme.bgSecondary
        }}
    >
        <div className={`mr-4 transition-colors`} style={{ color: active ? theme.primary : theme.textSecondary }}>
            {active ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </div>
        <div>
            <span className={`font-bold block`} style={{ color: active ? theme.text : theme.textSecondary }}>{label}</span>
            <span className="text-xs opacity-50">{description}</span>
        </div>
    </div>
);
