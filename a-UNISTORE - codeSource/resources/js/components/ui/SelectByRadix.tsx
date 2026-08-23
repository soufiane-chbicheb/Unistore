
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
interface props {
    elements : string[]
    value : string ; 
    onChange : (value : any) => void
    extraLabel? : string
}

const  SelectByRadix = ({elements = ['none'] , value , onChange , extraLabel}:props) => {
    return <>
    
    <Select.Root  value={value} defaultValue='all'
    onValueChange={(value) => onChange(value)}
    
    >
              <Select.Trigger className="inline-flex items-center justify-between gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-40">
                <Select.Value placeholder="All Types" />
                <Select.Icon>
                  <ChevronDown size={16} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <Select.Viewport className="p-1">
              
                    {
                        elements.map(el => {
                            return  (
                                <>
                               <Select.Item value={el} className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-700 cursor-pointer outline-none">
                                    <Select.ItemText>{el}{extraLabel ?? ''}</Select.ItemText>
                               </Select.Item>
                                </>
                            )
                        })
                    }
                    
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

    </>

}


export default SelectByRadix ; 
