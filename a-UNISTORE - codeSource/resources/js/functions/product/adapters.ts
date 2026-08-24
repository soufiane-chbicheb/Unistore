




export default function adapters() {
    const toSelectOptionAdapter = (item : {id : number|string , name : string }) => ({label :item.name , value : item.id })
    const toSetterAdapter = (item : {value : number|string , label : string }) => ({name :item.label , id : item.value })
    const toBackendAttribute =  (item : {id : number|string , name : string })  => item.id

    return {
         toSelectOptionAdapter , 
         toSetterAdapter , 
         toBackendAttribute
    }
}
