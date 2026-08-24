import { ProductVariant } from "@/types/productsTypes";
import { Material  , Fit , Color , Size , Cover} from '@/types/inventoryTypes';

export const fakeFashionVariants: ProductVariant[] = [
  { 
    niche : "fashion" ,
    id: "1",
    quantity: 10,
    attributes: {
      color: [{ id: 1, hex: "#FF0000", name: "Red" }] as Color[] , 
      sizes: [
        { id: 1, name: "S" },
        { id: 2, name: "M" },
        { id: 3, name: "L" }
      ] as Size[],
      fits: [{ id: 1, name: "regular" }] as Fit[],
      materials: [{ id: 1, name: "Cotton" }] as Material[],
      fabricType: ["Jersey"],
       covers: [
        { id: 1, path: "/images/red-front.jpg" },
        { id: 2, path: "/images/red-back.jpg" }
      ] as Cover[]
    }
  },
  { 
    niche : "fashion" ,

    id: "2",
    quantity: 5,
    attributes: {
      color:[ { id: 2, hex: "#0000FF", name: "Blue" }] as Color[],
      sizes: [
        { id: 2, name: "M" },
        { id: 3, name: "L" },
        { id: 4, name: "XL" }
      ] as Size[],
      fits: [{ id: 2, name: "slim" }] as Fit[],
      materials: [
        { id: 1, name: "Cotton" },
        { id: 2, name: "Polyester" }
      ] as Material[],
      fabricType: ["Jersey"],
      covers : [{ id: 1, path: "/images/red-front.jpg" },
        { id: 2, path: "/images/red-back.jpg" }] as Cover[]

    }
  },
  { 
    niche : "fashion" ,
    id: "3",
    quantity: 7,
    attributes: {
      color: [{ id: 3, hex: "#00FF00", name: "Green" }] as Color[],
      sizes: [
        { id: 1, name: "S" },
        { id: 2, name: "M" }
      ] as Size[],
      fits: [{ id: 3, name: "oversized" }] as Fit[],
      materials: [{ id: 1, name: "Cotton" }] as Material[],
      fabricType: ["Sweatshirt"],
      covers : [{ id: 1, path: "/images/red-front.jpg" },
        { id: 2, path: "/images/red-back.jpg" }] as Cover[]
    }
  }
];


export const fakeParfumesVariants = [
  {
    id: 1,
    niche: "parfumes",
    quantity: 25,
    attributes: {
      concentration: "EDP",
      volume_ml: 50,
      fragranceFamily: "floral",
      topNotes: ["Bergamot", "Lemon"],
      middleNotes: ["Rose", "Jasmine"],
      baseNotes: ["Vanilla", "Musk"],
      covers: ["/images/perple.jpg", "/images/red.jpg"],
    },
  },
  {
    id: 2,
    niche: "parfumes",
    quantity: 10,
    attributes: {
      concentration: "EDT",
      volume_ml: 100,
      fragranceFamily: "woody",
      topNotes: ["Grapefruit", "Peppermint"],
      middleNotes: ["Cedarwood", "Patchouli"],
      baseNotes: ["Amber", "Sandalwood"],
      covers: ["/images/red.jpg"],
    },
  },
  {
    id: 3,
    niche: "parfumes",
    quantity: 5,
    attributes: {
      concentration: "Parfum",
      volume_ml: 30,
      fragranceFamily: "oriental",
      topNotes: ["Cardamom", "Saffron"],
      middleNotes: ["Rose", "Incense"],
      baseNotes: ["Vanilla", "Musk"],
      covers: [],
    },
  },
  {
    id: 4,
    niche: "parfumes",
    quantity: 12,
    attributes: {
      concentration: "Cologne",
      volume_ml: 200,
      fragranceFamily: "fresh",
      topNotes: ["Lime", "Mint"],
      middleNotes: ["Lavender", "Basil"],
      baseNotes: ["Musk", "Ambergris"],
      covers: ["/images/parfume4.jpg"],
    },
  },
];
