import { isMeaningfulValue } from "./isMeaningfulValue";



/**
 * Check if a form is worth saving as a draft.
 * @param formData - The form object to check
 * @param minFilledFields - Minimum number of meaningful fields to consider the form dirty
 * @param skipKeys - Keys to ignore (e.g., category always set)
 * @returns { isWorthSaving: boolean, filledFields: number }
 */
export function isFormWorthSavingAsDraft(
  formData: Record<string, any>,
  minFilledFields = 2,
  skipKeys: string[] = ["category"]
) {
  let filledFields = 0;

  Object.entries(formData)
    .filter(([key]) => !skipKeys.includes(key))
    .forEach(([_, value]) => {
      if (isMeaningfulValue(value)) filledFields++;
    });
    
  return filledFields >= minFilledFields 
   
}



export function isEmptyObject(data : any){
      return !isFormWorthSavingAsDraft(data, 1 , []);
}