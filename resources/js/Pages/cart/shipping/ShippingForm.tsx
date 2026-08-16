
import { Mail, MapPin, Phone, User } from "lucide-react";

import { isEmpty } from "lodash";
import { da } from "zod/v4/locales";
import { RefObject, useEffect, useMemo } from "react";
import { SelectScrollUpButton } from "@/components/ui/select";

import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Controller } from "react-hook-form";
import MultiSelectDropdownForObject from "@/components/ui/MultiSelectDropdownForObject";

interface ShippingFormProps {
    onChange: (data: any) => void;
    theme: any;
    ZodErrors : any ,
    control : any , 
    backendErrors ?: any ,
    register : any , 
    onCityChange : (id : string) => void , 
    shippingCities : {id : string , city : string}[]
}

export default function ShippingForm({
    onChange,
    theme,
    ZodErrors , 
    backendErrors , 
    register , 
    control , 
    onCityChange , 
    shippingCities
}: ShippingFormProps) {
  
 
    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
            }}
            className="border rounded-lg p-6"
        >
            <h2 style={{ color: theme.text }} className="text-xl font-bold mb-4">
                Shipping Information
            </h2>

            <div className="space-y-4">
                {/* full Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            <User size={16} className="inline mr-2" />
                            First Name *
                        </label>
                        <input
                            type="text"
                            {...register("address.first_name")}
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="John Doe"
                        />
                       {(backendErrors['address.first_name'] || ZodErrors.address?.first_name?.message) && (
                            <div className="text-red-500 text-sm mt-1">
                                {backendErrors['address.first_name'] || ZodErrors.address?.first_name?.message}
                            </div>
                        )}
                    </div>
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            <User size={16} className="inline mr-2" />
                            Last Name *
                        </label>
                        <input
                            type="text"
                       
                            {...register("address.last_name")}

                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="John Doe"
                        />
                         {(backendErrors['address.last_name'] || ZodErrors.address?.last_name?.message) && (
                            <div className="text-red-500 text-sm mt-1">
                                {backendErrors['address.last_name'] || ZodErrors.address?.last_name?.message}
                            </div>
                        )}
                    </div>
                </div>
                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            <Mail size={16} className="inline mr-2" />
                            Email (optional)
                        </label>
                        <input
                            type="email"
                            
                            {...register("address.email")}

                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="john@example.com"
                        />
                          {(backendErrors['address.email'] || ZodErrors.address?.email?.message) && (
                            <div className="text-red-500 text-sm mt-1">
                                {backendErrors['address.email'] || ZodErrors.address?.email?.message}
                            </div>
                        )}
                    </div>

            {/* phone */}
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            <Phone size={16} className="inline mr-2" />
                            Phone *
                        </label>
                        <input
                            type="tel"
                            
                             {...register("address.phone")}

                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="+1 (555) 123-4567"
                        />
                        {(backendErrors['address.phone'] || ZodErrors.address?.phone?.message) && (
                            <div className="text-red-500 text-sm mt-1">
                                {backendErrors['address.phone'] || ZodErrors.address?.phone?.message}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">

                    {/* Address 1 */}
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        <MapPin size={16} className="inline mr-2" />
                        Address 1 *
                    </label>
                    <input
                        type="text"
                      
                        {...register("address.address_line1")}

                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="123 Main Street"
                    />
                      {(backendErrors['address.address_line1'] || ZodErrors.address?.address_line1?.message) && (
                            <div className="text-red-500 text-sm mt-1">
                                {backendErrors['address.address_line1'] || ZodErrors.address?.address_line1?.message}
                            </div>
                        )}
                </div>

                {/* address 2 */}
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        <MapPin size={16} className="inline mr-2" />
                         Address 2 (optional)
                    </label>
                    <input
                        type="text"
                        
                        {...register("address.address_line2")}

                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="123 Main Street"
                    />
                    {(backendErrors['address.address_line2'] || ZodErrors.address?.address_line2?.message) && (
                            <div className="text-red-500 text-sm mt-1">
                                {backendErrors['address.address_line2'] || ZodErrors.address?.address_line2?.message}
                            </div>
                        )}
                </div>
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label
                            style={{ color: theme.textSecondary }}
                            className="block text-sm mb-2"
                        >
                            City *
                        </label>
                
                        
                        <Controller
                            name="address.city"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <MultiSelectDropdownForObject
                                    multiple={false}
                                    label="Select City"
                                    options={shippingCities.map((city) => ({
                                        label: city.city,
                                        value: String(city.city),
                                    }))}
                                    selectedValues={field.value ? [{ label: String(field.value), value: String(field.value) }] : []}
                                    onChange={(selected) => {
                                        if (selected && selected.length > 0) {
                                            field.onChange(selected[0].value);
                                            onCityChange(String(selected[0].value));
                                        } else {
                                            field.onChange("");
                                        }
                                    }}
                                />
                            )}
                        />

                        {(backendErrors['address.city'] || ZodErrors.address?.city?.message) && (
                            <div className="text-red-500 text-sm mt-1">
                                {backendErrors['address.city'] || ZodErrors.address?.city?.message}
                            </div>
                        )}

                
                    </div>
                </div>
                
                {/* notes */}
                <div>
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-sm mb-2"
                    >
                        Notes (for the delivery)
                    </label>
                    <textarea
                        {...register("notes")}
                        
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2"
                        placeholder="any notes for the delivery ?"
                    />
                   {(backendErrors['notes'] || ZodErrors?.notes?.message) && (
                            <div className="text-red-500 text-sm mt-1">
                                {backendErrors['notes'] || ZodErrors?.notes?.message}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
} 
