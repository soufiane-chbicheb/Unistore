import { useTheme } from "@/contextHooks/useTheme";
import React from "react";

export const SectionHeader = ({title , description , Icon ,  children}:{title:string  , Icon? : React.ElementType; description? : string ; children? : React.ReactNode}) => {
  const { theme } = useTheme();  
  return (
      <>
      
       {/* Header */}
        <div  className="flex flex-wrap items-center justify-between gap-4  p-5"
        style={{background : theme.card }}
        >
           <div>
                <h1 
                  className="text-4xl font-bold mb-2 flex items-center gap-3 "
                  style={{
                    background: `linear-gradient(135deg, ${theme.text} 0%, ${theme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <div 
                    className="p-2 rounded-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.accent}20 0%, ${theme.accentHover}20 100%)`,
                    }}
                  >
                    {Icon && <Icon size={28} style={{ color: theme.accent }} />}
                  </div>
                  {title}
                </h1>
                
           </div>
          {/* right side dev */}
          <section>
              {children}
          </section>
        </div>

      </>
       
    )
}


 
