
import { literal, z } from "zod";




export const shippingSchema = z.object({
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters")
    .regex(/^[A-Za-z0-9À-ÿ\s.,'-]+$/, "Address line 1 contains invalid characters")
    .nullable()
    .optional().
    or(z.literal(""))   ,
    

  payment_method_id: z.string().optional(),

  coupon_code: z
    .string()
    .max(50, "Coupon code must be at most 50 characters")
    .regex(/^[A-Za-z0-9_-]*$/, "Coupon contains invalid characters")
    .nullable()
    .optional(),

  address: z.object({
    first_name: z
      .string()
      .min(2, "First name must have at least 2 characters")
      .max(100, "First name must have at most 100 characters")
      .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "First name contains invalid characters"),

    last_name: z
      .string()
      .min(2, "Last name must have at least 2 characters")
      .max(100, "Last name must have at most 100 characters")
      .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "Last name contains invalid characters"),



    phone: z
      .string()
      .min(8, "Phone must have at least 8 characters")
      .max(20, "Phone must have at most 20 characters")
      .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),

    address_line1: z
      .string()
      .min(5, "Address line 1 must have at least 5 characters")
      .max(255, "Address line 1 must have at most 255 characters")
      .regex(/^[A-Za-z0-9À-ÿ\s.,'-]+$/, "Address line 1 contains invalid characters"),

    address_line2: z
      .string()
      .max(255, "Address line 2 must have at most 255 characters")
      .regex(/^[A-Za-z0-9À-ÿ\s.,'-]*$/, "Address line 2 contains invalid characters")
      .nullable()
      .optional(),

    city: z
      .string()
      .max(100, "City must be at most 100 characters")
      .optional()
    ,

     email: z
      .string()
      .email("Invalid email format")
      .max(150, "Email must be at most 150 characters")
      .optional().
      or(z.literal(""))
      ,

  
    
    }),

   
})



export type ShippingData = z.infer<typeof shippingSchema>;
