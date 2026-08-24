import { AdminThemeContext } from "@/context/AdminThemeContext";
import { useContext } from "react"

export const useAdminThemeCtx = () =>{
    const ctx = useContext(AdminThemeContext) 
    if (!ctx) throw new Error("AdminThemeContext must be used within an AdminThemeProvider")
    return ctx ; 
}
