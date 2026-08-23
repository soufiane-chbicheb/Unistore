import { useTheme } from "@/contextHooks/useTheme";
import { InfoIcon } from "lucide-react";

const NotifyUser = ({Icon  = InfoIcon  ,  message = "" }) => {
const { theme: currentTheme } = useTheme();
  return (
    <div className="flex items-center gap-2 rounded-xl overflow-hidden shadow-lg mt-3"
    style={{background : `${currentTheme.badge}30`}}
    >
      {/* Left wave SVG */}
       <svg width="16" height="50" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 8 0 
             Q 4 4.8, 8 9.6 
             T 8 19.2 
             Q 4 24, 8 28.8 
             T 8 38.4 
             Q 4 43.2, 8 48 
             T 8 57.6 
             Q 4 62.4, 8 67.2 
             T 8 76.8 
             Q 4 81.6, 8 86.4 
             T 8 96 
             L 0 96 
             L 0 0 
             Z"
          fill={currentTheme.primary}
          stroke={currentTheme.primaryHover}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <Icon color={currentTheme.primary} />

      {/* Content */}
      <div className="mx-2.5 overflow-hidden w-full">
      

        <p className="overflow-hidden leading-5 break-all  max-h-10 whitespace-pre-line" 
         style={{color : currentTheme.primary}}
        
        >
          {message}
        </p>
      </div>

    
    </div>
  );
};

export default NotifyUser;
