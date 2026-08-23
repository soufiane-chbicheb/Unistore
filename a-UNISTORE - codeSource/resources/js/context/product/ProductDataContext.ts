
import { ProductSchemaType } from "@/shemas/productSchema"
import { Category } from "@/types/inventoryTypes"
import { createContext, Dispatch, RefObject, SetStateAction } from "react"

import { Control, FormState, SubmitHandler, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormSetError, UseFormSetValue, UseFormWatch, WatchDefaultValue } from "react-hook-form"



export type ModeForm = "edit" | "create"
interface ProductDataContextProps {
    modeForm : ModeForm
   
    nicheCategory : Category[] ;
    setNicheCategory :Dispatch<Category[]>
    draftId: RefObject<string | undefined>
    register: UseFormRegister<ProductSchemaType>
    control: Control<ProductSchemaType>
    watch: UseFormWatch<ProductSchemaType>
    setValue : UseFormSetValue<ProductSchemaType>
    handleSubmit : UseFormHandleSubmit<ProductSchemaType>
    getValues : UseFormGetValues<ProductSchemaType>
    setError : UseFormSetError<any>
    formState : FormState<ProductSchemaType>
    nich_cats : any, 
    shipping_class : any, 
    badges : any,
     variants_options : any 
    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)