import React from 'react';
import Card1 from '../cardsPrototypes/Card1';
import Card2 from '../cardsPrototypes/Card2';
import Card3 from '../cardsPrototypes/Card3';
import Card4 from '../cardsPrototypes/Card4';
import { Card5 } from '../cardsPrototypes/Card5';
import { Card6 } from '../cardsPrototypes/Card6';

interface CardGridProps extends Omit<any, 'className'> {
  selectedId: any;
  onSelect: (id: any) => void;
}

const templates: { id: any; Component: React.FC<any> }[] = [
  { id: 'card-1', Component: Card1 },
  { id: 'card-2', Component: Card2 },
  { id: 'card-3', Component: Card3 },
  { id: 'card-4', Component: Card4 },
  { id: 'card-5', Component: Card5 },
  { id: 'card-6', Component: Card6 },

];

export const CardGrid: React.FC<CardGridProps> = ({ selectedId, onSelect, product, config }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-6 pb-20">
        {templates.map(({ id, Component }) => (
          <div
            key={id}
            onClick={() => onSelect(id)}
            className={`
              relative cursor-pointer transition-all duration-300 rounded-xl group
              ${selectedId === id
                ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-slate-50 z-10 shadow-2xl'
                : 'hover:ring-2 hover:ring-slate-300 hover:shadow-lg opacity-90 hover:opacity-100'
              }
            `}
          >
            {/* Checkbox Overlay - Only on Selected Card */}
            {selectedId === id && (
              <div className="absolute top-3 left-3 z-30">
                <div className="w-6 h-6 bg-green-500 rounded border-2 border-green-400 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}

            {/* Label Badge */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm transition-colors z-20 ${
                selectedId === id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-800 group-hover:text-white'
            }`}>
              {id.replace('-', ' ')}
            </div>

            <div className="w-full overflow-hidden rounded-xl bg-white isolate">
               <Component product={product} config={config} />
            </div>
          </div>
        ))}
      </div>

      {/* No More Cards Footer */}
      <div className="flex flex-col items-center justify-center gap-3 py-12 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-slate-600/20 rounded-full blur-xl"></div>
          <svg className="w-12 h-12 text-slate-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm font-medium">No more cards to show</p>
      </div>
    </div>
  );
};
