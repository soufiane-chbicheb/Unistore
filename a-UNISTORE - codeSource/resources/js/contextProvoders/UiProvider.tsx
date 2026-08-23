import { UIContext } from "@/context/UIContext";
import { ReactNode, useState } from "react";


interface UIProviderProps {
    children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
    const [isFlashing, setIsFlashing] = useState(false);

    return (
        <UIContext.Provider value={{ isFlashing, setIsFlashing }}>
            {children}
        </UIContext.Provider>
    );
};
