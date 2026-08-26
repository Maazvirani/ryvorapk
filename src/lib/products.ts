import onyx from "@/assets/product-onyx.jpg";
import bone from "@/assets/product-bone.jpg";
import espresso from "@/assets/product-espresso.jpg";
import slate from "@/assets/product-slate.jpg";

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  compareAt?: number;
  image: string;
  colorway: string;
  badge?: string;
  sizes: string[];
  description: string;
  specs: string[];
};

export const products: Product[] = [
  {
    slug: "onyx-heavyweight-hoodie",
    name: "Onyx Heavyweight Hoodie",
    subtitle: "Signature oversized silhouette",
    price: 148,
    compareAt: 180,
    image: onyx,
    colorway: "Onyx Black",
    badge: "Signature",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description:
      "The piece the brand was built on. 500 GSM loopback fleece, garment-dyed for depth, cut with a dropped shoulder and boxy body that holds its shape wash after wash.",
    specs: ["500 GSM loopback fleece", "Garment dyed, pre-shrunk", "Gold-thread emblem at chest", "Made in Portugal"],
  },
  {
    slug: "bone-atelier-hoodie",
    name: "Bone Atelier Hoodie",
    subtitle: "Undyed heavyweight fleece",
    price: 158,
    image: bone,
    colorway: "Bone Cream",
    badge: "Limited",
    sizes: ["S", "M", "L", "XL"],
    description:
      "Undyed organic cotton fleece with a raw, natural hand feel. Double-layer hood, tonal ribbing, and a relaxed body designed to be layered.",
    specs: ["480 GSM organic fleece", "Undyed, low-impact finish", "Double-layer hood", "Made in Portugal"],
  },
  {
    slug: "espresso-zip-hoodie",
    name: "Espresso Full-Zip Hoodie",
    subtitle: "Tailored zip-through",
    price: 172,
    image: espresso,
    colorway: "Deep Espresso",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A zip-through built like outerwear. YKK brass hardware, structured shoulders, and a slightly longer body for a clean line over denim or tailoring.",
    specs: ["520 GSM brushed fleece", "YKK brass two-way zip", "Structured shoulder", "Made in Portugal"],
  },
  {
    slug: "slate-cropped-hoodie",
    name: "Slate Cropped Hoodie",
    subtitle: "Boxy cropped cut",
    price: 132,
    image: slate,
    colorway: "Slate Grey",
    badge: "New",
    sizes: ["XS", "S", "M", "L"],
    description:
      "Cropped at the waist with wide sleeves and a heavy hem. Engineered to sit clean over high-rise trousers without losing the weight of the fabric.",
    specs: ["460 GSM fleece", "Cropped boxy fit", "Reinforced hem", "Made in Portugal"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
