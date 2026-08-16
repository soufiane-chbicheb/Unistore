


const initialeState = {
    
}


const inventoryReducer = (state ,  action) => {
   
    switch(action.type){
      case 'setData' :
        return {
              ...state , 
              state[action.payload.attr] : 
        }
        break ; 


    }

}