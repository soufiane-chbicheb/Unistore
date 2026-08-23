import { UIContextType } from "@/types/UITypes";
import { createContext} from "react";



export const UIContext = createContext<UIContextType | null>(null);
