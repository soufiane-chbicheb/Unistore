import { StoreConfigAction, StoreConfigType } from "@/types/StoreConfigTypes";
import { createContext} from "react";

interface StoreConfigContextType {
  state : StoreConfigType
  dispatch : React.Dispatch<StoreConfigAction>
}

export const StoreConfigContext = createContext<StoreConfigContextType | null>(null);
