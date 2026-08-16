// Main page component for attribute management

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { AttributeSwitcher } from './AttributeSwitcher';
import { AttributeWorkspace } from './AttributeWorkspace';
import type { Attribute, AttributeValue } from './types';
import { AddAttributeModal } from './AddAttributeModal';
import { AddValueModal } from './AddValueModal';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useTheme } from '@/contextHooks/useTheme';
import {Provider, useDispatch, useSelector} from 'react-redux' ;
import store from '@/store/store';
import { attributesActions } from '@/store/actions/attributesActions';



function AttributePage({attributes = []} : {attributes : Attribute[]}) {
    return (
      <Provider store={store}>
           <AttribueContent {...{attributes}} />
      </Provider>
    )
}
export default AttributePage ;

AttributePage.layout = (page : any) => <AdminLayout  children={page} />

function AttribueContent({attributes } : {attributes : Attribute[]} ) {
  const [isAddAttributeOpen, setIsAddAttributeOpen] = useState(false);
  const [isAddValueOpen, setIsAddValueOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [editingValue, setEditingValue] = useState<AttributeValue | null>(null);
  const { theme: currentTheme } = useTheme(); // color all the page using this theme
  const dispatch = useDispatch() ; 
  
  const { onAddAttribute,
        onRemoveAttribute,
        onAddValue,
        onRemoveValue,
        onReset,
        OnRemoveBulk,
        setActiveAttributeId,
        onUpdateAttributes ,
        resetActiveAttributeId , 
        onUpdateValues ,
        dataInitializer} = attributesActions() ;
 
  useEffect(() => {
      dispatch({type : dataInitializer() , payload : {data : {attributes , activeAttributeId : attributes?.[0]?.id}}  })
  }, [attributes  , dispatch]);

 
  const {
    activeAttributeId , 
    attributes : stateAttributes ,
  } = useSelector((selector : any) => selector.attributes)


  const activeAttribute = (stateAttributes as Attribute[]).find((a) => a.id === activeAttributeId);
  const handleAddAttribute = (attribute: Omit<Attribute, 'id'>) => {
    const newAttribute: Attribute = {
      ...attribute,
      id: Math.random().toString(36).substr(2, 9),
    };

    dispatch({type : onAddAttribute() , payload : newAttribute})
    dispatch({type : setActiveAttributeId() , paylaod : newAttribute.id})
    setIsAddAttributeOpen(false);
    setEditingAttribute(null);
  };

  const handleUpdateAttribute = (id: string, updates: Partial<Attribute>) => {
    dispatch({type :onUpdateAttributes() , payload : (stateAttributes as Attribute[]).map((a) => (a.id === id ? { ...a, ...updates } : a))})
    setIsAddAttributeOpen(false);
    setEditingAttribute(null);
  };

  const handleAddValue = (value: Omit<AttributeValue, 'id'>) => {
    const newValue: AttributeValue = {
      ...value,
      id: Math.random().toString(36).substr(2, 9),
    };
    dispatch({type : onAddValue() , payload : newValue})
    setIsAddValueOpen(false);
    setEditingValue(null);
  };

  const handleUpdateValue = (id: string, updates: Partial<AttributeValue>) => {
    // dispatch({type :onUpdateValues() , payload : (stateValues as AttributeValue[]).map((v) => (v.id === id ? { ...v, ...updates } : v))})
    setIsAddValueOpen(false);
    setEditingValue(null);
  };

  const handleDeleteValue = (id: string) => {
      dispatch({type : onRemoveValue() , payload : {id}})
  };

  const handleBulkDeleteValues = (ids: string[]) => {
      dispatch({type : OnRemoveBulk() , payload : ids})
  };

  const handleEditAttribute = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setIsAddAttributeOpen(true);
  };

  const handleEditValue = (value: AttributeValue) => {
    setEditingValue(value);
    setIsAddValueOpen(true);
  };


  return (
    <div className="min-h-screen p-6" style={{ background: currentTheme.bg, color: currentTheme.text }}>
      <Card className="mx-auto max-w-7xl" style={{ background: currentTheme.card, borderColor: currentTheme.border, color: currentTheme.text }}>
        <AttributeSwitcher
          attributes={stateAttributes}
          activeAttributeId={activeAttributeId}
          onAttributeSelect={(id) => dispatch({type : setActiveAttributeId() , payload : {id}})}
          onAddAttribute={() => setIsAddAttributeOpen(true)}
          onEditAttribute={handleEditAttribute}
        />
        {activeAttribute && (
          <AttributeWorkspace
            attribute={activeAttribute}
            onAddValue={() => setIsAddValueOpen(true)}
            onEditValue={handleEditValue}
            onDeleteValue={handleDeleteValue}
            onBulkDeleteValues={handleBulkDeleteValues}
            onEditAttribute={() => handleEditAttribute(activeAttribute)}
          />
        )}
      </Card>

  <AddAttributeModal
        open={isAddAttributeOpen}
        onOpenChange={setIsAddAttributeOpen}
        onSubmit={(data) => {
          if (editingAttribute) {
            handleUpdateAttribute(editingAttribute.id, data);
          } else {
            handleAddAttribute(data);
          }
        }}
        initialData={editingAttribute || undefined}
      />

  {activeAttribute && (
        <AddValueModal
          open={isAddValueOpen}
          onOpenChange={setIsAddValueOpen}
          attribute={activeAttribute}
          onSubmit={(data) => {
            if (editingValue) {
              handleUpdateValue(editingValue.id, data);
            } else {
              handleAddValue(data);
            }
          }}
          initialData={editingValue || undefined}
        />

      )}
    </div>
  );
}

