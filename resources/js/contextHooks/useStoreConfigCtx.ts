import { StoreConfigContext } from "@/context/StoreConfigContext";
import { useContext } from "react"




export const useStoreConfigCtx = () =>{
   
    const ctx = useContext(StoreConfigContext) 
    if (!ctx) throw new Error("configuration contexts should be passed to StoreConfigProvider")

    return ctx ; 
}