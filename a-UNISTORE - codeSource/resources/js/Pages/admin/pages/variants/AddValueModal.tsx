// Context-aware modal for adding/editing attribute values

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Attribute   , AttributeValue} from './types';
import { useTheme } from '@/contextHooks/useTheme';
import { resolveCreateValuePlaceholder } from '@/functions/attributes/createValuePlaceholder';
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';

interface AddValueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribute: Attribute;
  onSubmit: (data: Omit<AttributeValue, 'id'>) => void;
  initialData?: AttributeValue;
}


export function AddValueModal(props: Readonly<AddValueModalProps>) {
  const { open , onOpenChange, attribute , onSubmit, initialData } = props;
  const [newValue, setNewValue] = useState({
     name  :initialData?.name , 
     value : initialData?.value
  });
  const isColorAttribute = attribute.name.toLocaleLowerCase() == 'color' ; 
  
  const storeValueToDB = (data : any) => {

     try{
        router.post(route('store.attributes') , data, {
         onError : (errors) => console.log(errors),
         onSuccess : () => console.log('sucess')
        })
     }catch(err:any){
       throw new Error(err) ;
     }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data  = {...newValue , attributeId : attribute.id} ;
    try{
      const value  =  await storeValueToDB(data) ;
      // if(value) dispa
    }catch(err : any){
              console.log(err.message)
    }
    
  };
  const { theme: currentTheme } = useTheme();
  


  const placeholder = resolveCreateValuePlaceholder({attributeName : attribute.name , existingValues : attribute.values }) ;
  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => setNewValue({name : '' , value : ''})} style={{ background: currentTheme.modal, color: currentTheme.text }}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add'} {attribute.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="value-name">Label <span className="ml-2 text-xs text-muted-foreground">(optional)</span></Label>
              <Input
                id="value-name"
                placeholder={`example : ${placeholder} `}
                value={newValue.name}
                onChange={(e) => setNewValue(prev => ({...prev , name : e.target.value}))}
                autoFocus
              />
            </div>
            {isColorAttribute ? (
                <div className="space-y-2">
                  <Label htmlFor="color-picker">Value</Label>
                  <div className="flex gap-2">
                    <input
                      id="color-picker"
                      type="color"
                      value={newValue.value}
                      onChange={(e) => setNewValue(prev => ({...prev , value : e.target.value}))}
                      className="h-10 w-20 cursor-pointer rounded border"
                    />
                    <Input
                      placeholder="#000000"
                      value={newValue.value}
                      onChange={(e) => setNewValue(prev => ({...prev , value : e.target.value}))}
                      className="flex-1"
                    />
                  </div>
                </div>
            )
            :
            (
              <div className="space-y-2">
              <Label htmlFor="value-name">Value</Label>
              <Input
                id="value-name"
                placeholder={`example : ${placeholder} `}
                value={newValue.value}
                onChange={(e) => setNewValue(prev => ({...prev , value : e.target.value}))}
                autoFocus
              />
            </div>
            )
          
          }
          </div>
          <DialogFooter style={{ background: currentTheme.bgSecondary }}>
            <Button type="button" variant="outline" onClick={() => {
              setNewValue({name : '' , value : ''}) ; 
              onOpenChange(false);
            }} style={{ borderColor: currentTheme.border, color: currentTheme.text }}>
              Cancel
            </Button>
            <Button type="submit" style={{ background: currentTheme.primary, color: currentTheme.textInverse }}>
              {initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

