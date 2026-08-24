import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import BasicInfoFormMaster from "./A_sharedForAllNiches/RouterAndMasters/ProductFormMaster";
import ProductDataProvider from "@/contextProvoders/product/ProductDataProvider";
import ProductUIProvider from "@/contextProvoders/product/ProductUIProvider";
import { ProductBackendProps } from "@/types/products/ProductTypes";


export default function Create({ product, nich_cats, shipping_class, badges, variants_options }: ProductBackendProps) { 
   
    return (      
                <ProductDataProvider  {...{ product, nich_cats, shipping_class, badges, variants_options }}>
                        <ProductUIProvider>
                                    <CreateContent  />
                        </ProductUIProvider>
            
                </ProductDataProvider>
                
        
    )
}


Create.layout = (page:any) => <AdminLayout  children={page} />

function CreateContent() {

    return (
        <>
            <div className="py-8">
                <div className="min-w-[90%] mx-auto">
                    {/* hehader */}
                    <SectionHeader
                        title="add Product"
                        description="add product details and variants"
                    />
                   <BasicInfoFormMaster />
                    
                </div>
            </div>
        </>
    );
}
