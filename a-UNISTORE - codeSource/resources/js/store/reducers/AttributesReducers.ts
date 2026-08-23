
import { Attribute, AttributeValue } from "@/Pages/admin/pages/variants/types";
import { attributesActions } from "../actions/attributesActions" 

const {  
        onUpdateAttributes ,
        onAddAttribute,
        onRemoveAttribute,
        onUpdateValues ,
        onAddValue,
        onRemoveValue,
        onReset,
        OnRemoveBulk,
        setActiveAttributeId,
        resetActiveAttributeId , 
        dataInitializer
    
    } = attributesActions() ;
    const ON_UPDATE_ATTRIBUTES =  'ON_UPDATE_ATTRIBUTES'
    const ON_ADD_ATTRIBUTE =  "ON_ADD_ATTRIBUTE";
    const ON_REMOVE_ATTRIBUTE =  "ON_REMOVE_ATTRIBUTE";
    const ON_ADD_VALUE =  "ON_ADD_VALUE";
    const ON_UPDATE_VALUES =  'ON_UPDATE_VALUES' ;
    const ON_REMOVE_VALUE =  "ON_REMOVE_VALUE";
    const ON_REMOVE_BULK_VALUES =  "ON_REMOVE_BULK_VALUES";
    const SET_ACTIVE_ATTRIBUTE_ID =  "SET_ACTIVE_ATTRIBUTE_ID";
    const INIT_DATA =  'INIT_DATA'

export const initialState : {attributes : Attribute[] , values :AttributeValue[] , activeAttributeId : string | null} = {
    attributes: [],
    values: [],
    activeAttributeId: null,
};

export type AttributesActions =
  | { type: ReturnType<typeof onAddAttribute>; payload: Attribute }
  | { type: ReturnType<typeof onRemoveAttribute>; payload: string } // attributeId
  | { type: ReturnType<typeof onAddValue>; payload: AttributeValue }
  | { type: ReturnType<typeof onRemoveValue>; payload: string } // valueId
  | { type: ReturnType<typeof onReset> ;  payload? : any }
  | { type: ReturnType<typeof OnRemoveBulk>; payload: string[] } // valueIds
  | { type: ReturnType<typeof setActiveAttributeId>; payload: string } // attributeId
  | { type: ReturnType<typeof resetActiveAttributeId> ;  payload? : any}
  | { type: ReturnType<typeof dataInitializer>  ; payload : any}
  | { type: ReturnType<typeof onUpdateAttributes>  ; payload : Attribute[]}
  | { type: ReturnType<typeof onUpdateValues>  ; payload : AttributeValue[]}




export const attributesReducer  = (state = initialState , action : AttributesActions) => {
      switch(action.type){
        case  INIT_DATA : return action.payload.data
        case  ON_UPDATE_VALUES : return {
           ...state , 
           values : action.payload
        } 
        case  ON_UPDATE_ATTRIBUTES : return {
           ...state , 
           attributes : action.payload
        }

        case  ON_ADD_ATTRIBUTE : return {
           ...state , 
           attributes : [...state.attributes , action.payload]
        }
      
        case  ON_ADD_VALUE: return {
           ...state , 
           values : [...state.values , action.payload]
        }
        case  ON_REMOVE_VALUE : return {
           ...state , 
           values : state.values.filter(v => v.id !== action.payload.id)
        }

        case  ON_REMOVE_BULK_VALUES : return {
           ...state , 
           values : state.values.filter(v => !(action.payload.ids || []).some((vx:string) => vx === v.id))
        }
        case  SET_ACTIVE_ATTRIBUTE_ID : return {
           ...state , 
            activeAttributeId : action.payload.id
        }
        default : return state ;
        
      }
}