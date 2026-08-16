import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import CartPage from "./cartlisting/CartPage";
import { useEffect, useState } from "react";
import CheckoutPage from "./checkout/CheckoutPage";
import ShippingPage from "./shipping/ShippingPage";
import { isEmpty, set } from "lodash";
import { router, useForm, usePage } from "@inertiajs/react";
import StepIndicator from "./shared/StepIndicator";
import Layout from "@/Layouts/Layout";
import { ArrowLeft } from "lucide-react";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { route } from "ziggy-js";

// Pages/Cart/CartPage.tsx
interface ShoppingCartPageMasterProps {
    items: any[];
    tax : number
}

export default function ShoppingCartMaster({ items = [] , tax = 0 }: ShoppingCartPageMasterProps) {
    const [step , setStep] = useState(0);
    const [backendErrors , setBackendErrors] = useState<any>({}) ;
    const [zone , setZone] = useState<any>(undefined) ; 

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

    
    console.log(items)


    
    const onChangeBackendErrors = (errors : any) => {
        setBackendErrors(errors) ;
    }


    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();
    
        
       const stepUrls: Record<number, string> = {
             0: '/cart',
             1: '/checkout?step=shipping',
             2: '/checkout?step=payment',
        };

        const urlSteps: Record<string, number> = {
            '/cart':    0,
            'shipping': 1,
            'payment':  2,
        };

        // step → update URL
        const onStepChange = (action: 'prev' | 'next') => {
            const newStep = action === 'next' ? step + 1 : step - 1;
            setStep(newStep);
            window.history.pushState({}, '', stepUrls[newStep]);
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
        },
        notes: "",
    })
    }

    const stepsCompos : Record<string , React.ReactElement> = {
        '0' : <CartPage {...{items  , onStepChange}} /> , 
        '1' : <ShippingPage {...{items ,tax , shippingData, setShippingData , onStepChange , backendErrors  , onChangeBackendErrors, zone, setZone }} /> , 
        '2' : <CheckoutPage {...{ postUrl : "order.checkout" , items , shippingData , tax , onStepChange , onChangeBackendErrors ,onResetShippingData, zone}} /> , 
    };


   
   const stepName = step === 0 ? "cart" : step === 1 ? "shipping" : "checkout" ;
    
    return (
         <Layout seo={{ 
             title : '' , 
             description : ''
          }} currentPage={stepName} >

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

ShoppingCartMaster.layout = (page : any) => <StoreConfigProvider >{page}</StoreConfigProvider>
