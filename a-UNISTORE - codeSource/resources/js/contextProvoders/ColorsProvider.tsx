
import { ColorsContext } from "@/context/ColorsContext";
import { currentThemeExample } from "@/data/currentTheme";
import { useState } from "react";




const ColorsProvider = ({children}:{children : React.ReactNode})  => {
    const [currentTheme , setCurrentTheme] = useState(currentThemeExample)
    return (
        <ColorsContext.Provider value={{currentTheme , setCurrentTheme}}>
              {children}
        </ColorsContext.Provider>
    )
}

export default ColorsProvider ;
