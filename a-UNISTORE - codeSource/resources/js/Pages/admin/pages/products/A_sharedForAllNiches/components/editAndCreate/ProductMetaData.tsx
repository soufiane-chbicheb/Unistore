import TagSection from "@/components/TagSection"
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx"
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";

import { generateSKU } from "@/functions/product/generateSku";

import { v4 } from "uuid";




export default function ProductMetaData(){
    const {basicInfoForm , setBasicInfoForm} = useProductDataCtx()
         const {state :{currentTheme}} = useAdminThemeCtx()

    
    return (<>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Tags */}
                <div>
                  <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    Tags <span className="text-xs font-normal">(optional)</span>
                  </label>
                  <TagSection
                    tags={(basicInfoForm.tags || []).map(t => t.name)}
                    onTagsChange={(tags) => setBasicInfoForm({ ...basicInfoForm, tags: tags.map(name => ({ id: v4(), name })) })}
                  />
                </div>
                {/* <div className="block">
                  <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    SKU
                  </label>
                  <input
                    type="text"
                    value={basicInfoForm.sku || generateSKU(basicInfoForm.name || '' , basicInfoForm.brand || ''  , basicInfoForm.releaseDate|| '' )}
                    onChange={(e) => setBasicInfoForm({ ...basicInfoForm, sku: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                    style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
                  />
                </div> */}
                
              </div>
              
              </>)
}

