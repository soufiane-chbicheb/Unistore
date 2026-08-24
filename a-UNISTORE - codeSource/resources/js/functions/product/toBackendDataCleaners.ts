




import { BaseAttribute } from '@/types/inventoryTypes'
import React from 'react'

export function toBackendDataCleaners() {
  

   function cleanObjectToIids(itemsWithId : any) {
      if(!itemsWithId) return ;
      try{
        if (Array.isArray(itemsWithId)){
             return itemsWithId.map(e =>  {
               if("id" in e) return  e.id 
               else throw new Error("(cleanObjectToIds) : Array>object has no id to clean ")
             })
        }
        else if("id" in itemsWithId) return  itemsWithId.id  
    
        
      }catch(err : any){
         throw new Error(err.message)
      }
   }
  
  return {
    cleanObjectToIids
  }
}
