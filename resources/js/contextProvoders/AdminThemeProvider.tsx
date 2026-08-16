import React, { useReducer, useEffect, useState } from "react";
import { AdminThemeContext, AdminThemeType, AdminThemeAction } from "@/context/AdminThemeContext";
import { currentThemeExample } from "@/data/currentTheme";
import { router, usePage } from "@inertiajs/react";
import { ThemeMode, ThemeStyle } from "@/types/ThemeTypes";
import { route } from "ziggy-js";

const reducer = (state: AdminThemeType, action: AdminThemeAction): AdminThemeType => {
  let newState: AdminThemeType;
  switch (action.type) {
    case "SET_THEME_STYLE":
      newState = {
        ...state,
        currentThemeStyle: action.payload,
        currentTheme: currentThemeExample[action.payload as ThemeStyle][state.currentThemeMode as ThemeMode]
      };
      saveSetting("admin_theme_style", action.payload);
      return newState;
    case "SET_THEME_MODE":
      newState = {
        ...state,
        currentThemeMode: action.payload,
        currentTheme: currentThemeExample[state.currentThemeStyle as ThemeStyle][action.payload as ThemeMode]
      };
      saveSetting("admin_theme_mode", action.payload);
      return newState;
    default:
      return state;
  }
};

const saveSetting = (key: string, value: any) => {
  router.put(route("store.update"), { key, value }, {
    preserveScroll: true,
    onSuccess: () => console.log(`${key} updated`),
  });
};

export const AdminThemeProvider = ({ children, initialStoreConfigs }: { children: React.ReactNode, initialStoreConfigs?: any }) => {
  
  const [storeConfigs] = useState(() => {
        if(initialStoreConfigs){
           localStorage.setItem('store_config' , JSON.stringify(initialStoreConfigs)) ;
           return initialStoreConfigs;
        }
         const cached = localStorage.getItem('store_config')  ;
         if(cached){
             try{
                  return JSON.parse(cached) ;
             }catch(e){
                console.log(e)
                 return null; 
             }
         }
     });

    const getInitialThemeMode = () => {
      const saved = localStorage.getItem("admin_theme_mode");
      if (saved === "light" || saved === "dark") return saved;
      return "light";
   };


  const initialStyle = (storeConfigs?.admin_theme_style || "luxuryNoir") as ThemeStyle;
  const initialMode = getInitialThemeMode() as ThemeMode;

  const initialState: AdminThemeType = {
    currentThemeStyle: initialStyle,
    currentThemeMode: initialMode,
    currentTheme: currentThemeExample[initialStyle][initialMode],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AdminThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminThemeContext.Provider>
  );
};
