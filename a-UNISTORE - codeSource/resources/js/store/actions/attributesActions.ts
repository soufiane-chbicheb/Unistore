

export const attributesActions = () => {
    const onUpdateAttributes = () => 'ON_UPDATE_ATTRIBUTES'
    const onAddAttribute = () => "ON_ADD_ATTRIBUTE";
    const onRemoveAttribute = () => "ON_REMOVE_ATTRIBUTE";
    const onAddValue = () => "ON_ADD_VALUE";
    const onUpdateValues = () => 'ON_UPDATE_VALUES' ;
    const onRemoveValue = () => "ON_REMOVE_VALUE";
    const onReset = () => "ON_RESET";
    const OnRemoveBulk = () => "ON_REMOVE_BULK_VALUES";
    const setActiveAttributeId = () => "SET_ACTIVE_ATTRIBUTE_ID";
    const resetActiveAttributeId = () => "RESET_ACTIVE_ATTRIBUTE_ID";
    const dataInitializer = () => 'INIT_DATA'
    return {
        onUpdateAttributes ,
        dataInitializer , 
        onUpdateValues , 
        onAddAttribute,
        onRemoveAttribute,
        onAddValue,
        onRemoveValue,
        onReset,
        OnRemoveBulk,
        setActiveAttributeId,
        resetActiveAttributeId,
    };
};
