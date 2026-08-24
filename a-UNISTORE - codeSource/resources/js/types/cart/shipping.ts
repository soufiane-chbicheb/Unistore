
// types/checkoutTypes.ts

export interface ShippingAddress {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    company : string
}

export interface ShippingData {
    address: ShippingAddress;
    notes: string;
}