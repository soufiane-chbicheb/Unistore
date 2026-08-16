// Pages/Checkout/ShippingPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import StepIndicator from "../shared/StepIndicator";
import PageHeader from "../shared/PageHeader";
import OrderSummaryCard from "../shared/OrderSummary";
import MiniCartPreview from "../shared/MiniCardPreview";
import { ShippingData } from "@/types/cart/shipping";
import { shippingSchema } from "@/shemas/checkout";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";
import ShippingForm from "./ShippingForm";
import { useEffect, useRef, useState } from "react";
import { effect } from "zod/v3";
import { route } from "ziggy-js";
import axios from "axios";

interface ShippingPageProps {
    items: any[];
    tax: number;
    shippingData : ShippingData ,
    onStepChange : (action : 'prev' | 'next' ) => void,
    setShippingData : React.Dispatch<React.SetStateAction<ShippingData>>
    onChangeBackendErrors : (errors : any) => void
    backendErrors : any 
    zone : any
    setZone : (zone : any) => void
}



export default function ShippingPage({items = [], tax  , shippingData, setShippingData , onStepChange , backendErrors , onChangeBackendErrors, zone, setZone }: ShippingPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();
    const {register  , control, handleSubmit , formState : {errors : ZodErrors , isDirty}} = useForm<any>(
        {resolver : zodResolver(shippingSchema) , mode : "onChange" , defaultValues : shippingData}
    ) ; 

    const [shippingCities , setShippingCities] =  useState([]); 
 

   
    useEffect(()=> {
        const ctrl = new AbortController() ; 
          const getCities = async () => {

                 const res = await axios({
                    method : 'GET' , 
                    url : route("shipping.cities.get") , 
                    signal : ctrl.signal
                 })
                 if(res.status === 200) {
                    console.log(Array.isArray(res.data))
                         console.log(res.data)
                       setShippingCities(res.data.cities)
                 }
          }
          getCities();

          return () => ctrl.abort()
    },[])

    const cartItems = Array.isArray(items) ? items : (items as any)?.data || [];

    const subtotal = cartItems.reduce(
        (sum: number, item: any) => sum + (Number(item.price_snapshot) || 0) * (Number(item.quantity) || 0),
        0
    );
   

    const shippingCost = Number(zone?.price ?? 0);
    const total = subtotal + shippingCost;
    
    const onValid: any = (data : any) => {
        onChangeBackendErrors({});
        setShippingData(data);
        onStepChange('next');
    };
    const onInvalid = (errors : any) => {
    console.log("❌ Form has errors:", errors);
    };
    
    const handleContinueToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onValid , onInvalid)() ; // somethin wrong in here never calls on valid afetr i added a proper company 
    };


    const onCityChange = async (cityName :string) => {
        try{
          const res = await axios.post(route('shipping.calculate' , {name: cityName}), {
              items: cartItems
          })

          console.log(res)

          if(res.status === 200){
              // We merge the calculated cost into the zone object so the UI remains consistent
              setZone({ 
                  ...res.data.zone, 
                  price: res.data.cost 
              });
          }
  
        } catch(error : any){
            console.error("Shipping calculation failed:", error);
            setZone(null);
        }       
    }

    return (
      
            <div
                style={{ backgroundColor: theme.bg }}
                className="min-h-screen py-8"
            >
                <div className="container mx-auto px-4 max-w-7xl">

                    <form onSubmit={handleContinueToPayment}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Shipping Form */}
                            <div className="lg:col-span-2">
                                <div
                                    style={{
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                    }}
                                    className="rounded-lg border p-6"
                                >
                                    <PageHeader
                                        title="Shipping Information"
                                        backLink={() => onStepChange('prev')}
                                        backLabel="Back to Cart"
                                        theme={theme}
                                    />

                                    <ShippingForm
                                        {...{
                                            shippingCities , 
                                            control , 
                                            ZodErrors , 
                                            backendErrors , 
                                            register , 
                                            theme , 
                                            onChange:setShippingData , 
                                            onCityChange
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Right: Mini Cart + Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-4 space-y-4">
                                    <MiniCartPreview
                                        items={cartItems}
                                        theme={theme}
                                    />

                                    <OrderSummaryCard
                                        zone={zone}
                                        subtotal={subtotal}
                                        tax={tax}
                                        total={total}
                                        theme={theme}
                                        itemCount={cartItems.length}
                                        ctaButton={
                                            <button
                                                type="submit"
                                                style={{
                                                    backgroundColor: theme.primary,
                                                    color: theme.textInverse,
                                                    borderRadius: theme.borderRadius,
                                                }}
                                                className="w-full py-3 font-bold hover:opacity-90 transition-all"
                                            >
                                                Continue to Payment
                                            </button>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    );
}
