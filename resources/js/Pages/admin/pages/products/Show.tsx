import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { useEffect, useState } from "react";
import { isEmpty, set } from "lodash";
import { router, useForm, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { ArrowLeft } from "lucide-react";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { route } from "ziggy-js";
import StepIndicator from "@/Pages/cart/shared/StepIndicator";
import ProductDetails from "./A_sharedForAllNiches/components/showProductPage/ProductDetails";
import ShippingPage from "@/Pages/cart/shipping/ShippingPage";
import CheckoutPage from "@/Pages/cart/checkout/CheckoutPage";
// Pages/Cart/CartPage.tsx
interface ShowPageMasterProps {
   tax : number
}

export default function Show({tax =  2}: ShowPageMasterProps) {
    const { product } = usePage<any>().props;
    const [step , setStep] = useState(0);
    const [backendErrors , setBackendErrors] = useState<any>({}) ;
    const [items , setItems]= useState<any[]>([]) ; 
    const [zone , setZone] = useState<any>(null) ; 
 
    const [shippingData, setShippingData] = useState({
        address: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address_line1: "",
            address_line2: "",
            city: "",
        },
        notes: "",
    });

    const [productUrl] = useState(() => window.location.pathname);
    
    const onChangeBackendErrors = (errors : any) => {
        setBackendErrors(errors) ;
    }


    const {
        state: { currentTheme: theme },
    } = useAdminThemeCtx();
    

    const stepUrls: Record<number, string> = {
             0: `${productUrl}`,
             1: `/checkout?step=shipping`,
             2: `/checkout?step=payment`,
        };

    const urlSteps: Record<string, number> = {
        '':          0,
        'shipping': 1,
        'payment':  2,
    };


    useEffect(() => {
        const syncStepFromUrl = () => {
                const params = new URLSearchParams(window.location.search);
                const step = params.get('step') ?? '';
                setStep(urlSteps[step] ?? 0);
        };

        // sync on mount
        syncStepFromUrl();

        // sync on browser back/forward
        window.addEventListener('popstate', syncStepFromUrl);
        return () => window.removeEventListener('popstate', syncStepFromUrl);
    }, []);


    const onStepChange = (action: 'prev' | 'next', buyNowItems?: any[]) => {
            const newStep = action === 'next' ? step + 1 : step - 1;
            
            if (buyNowItems) {
                setItems(buyNowItems);
            } else if (newStep === 1 && items.length === 0) {
                // Default to first variant if no items provided and moving to shipping
                const defaultVariant = product?.variants?.[0];
                if (defaultVariant) {
                    setItems([{
                        ...defaultVariant,
                        name: product.name,
                        thumbnail: product.thumbnail,
                        quantity: 1,
                        price_snapshot: defaultVariant.price
                    }]);
                }
            }

            setStep(newStep);
            window.history.pushState({}, '', stepUrls[newStep]);
        };
    const onResetShippingData = () => {
      setShippingData({
        address: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            postal_code: "",
            company : ""
        },
        notes: "",
    })
    } 

    const stepsCompos : Record<string , React.ReactElement> = {
        '0' : <ProductDetails  {...{ onStepChange }} /> , 
        '1' : <ShippingPage {...{items ,tax , shippingData, setShippingData , onStepChange , backendErrors  , onChangeBackendErrors, zone, setZone }} /> , 
        '2' : <CheckoutPage {...{ postUrl : "order.buynow" , items , shippingData , tax , onStepChange , onChangeBackendErrors ,onResetShippingData, zone}} /> , 
    };


   
   const stepName = step === 0 ? "cart" : step === 1 ? "shipping" : "checkout" ;
    
    return (
         <Layout 
            seo={{ 
             title : '' , 
             description : ''
          }}
          currentPage={stepName} >

            <div>
                    {/* Free Shipping Banner */}
                <div
                    style={{
                        backgroundColor: theme.success,
                        color: theme.textInverse,
                        borderRadius: theme.borderRadius,
                    }}
                    className="py-3 text-center font-semibold"
                >
                    FREE SHIPPING UNLOCKED!
                </div>
                {   
                    step > 0 && <StepIndicator currentStep={step} errors={backendErrors} />
                }

            </div> 
                {stepsCompos[step]}
        </Layout>
       
    );
}

Show.layout = (page : any) => <StoreConfigProvider >{page}</StoreConfigProvider>

