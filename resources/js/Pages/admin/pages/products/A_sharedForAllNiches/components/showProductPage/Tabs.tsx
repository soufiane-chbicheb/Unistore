import { Button } from "@/components/ui/Button";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import React, { useState } from "react";


interface Tab {
  id: string;
  label: string | React.ReactNode;
  Icon: React.ElementType;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const {state : {currentTheme}} = useAdminThemeCtx()
  return (
    <div className="shadow-lg  overflow-hidden w-full "
     style={{background : currentTheme.bg , color : currentTheme.text}}
    >
      <div className=" shadow-sm  overflow-x-auto" 
       style={{background : currentTheme.bgSecondary , color : currentTheme.text}}
      >
        <div className="flex  min-w-max  " 
       
        >
          {tabs.map(({Icon , ...tab}) => {
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative `}
                style={{
                  color: activeTab === tab.id ? currentTheme.accentHover : currentTheme.textMuted , 
                  background : activeTab === tab.id ? currentTheme.borderHover : 'transparent',
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background : activeTab === tab.id ? currentTheme.accentHover : 'transparent'}}></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="">
        {tabs.map((tab) => (
          <div 
           style={{background : currentTheme.bgSecondary , color : currentTheme.text}}
            key={tab.id}
            className={`transition-all duration-300 ease-in-out ${
              activeTab === tab.id
                ? "opacity-100 block animate-fadeIn"
                : "opacity-0 hidden"
            }`}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

