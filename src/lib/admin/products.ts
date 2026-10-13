import { products } from "@/content/products";

/** Product tabs used across admin lists (short labels). */
export const productTabs = products.map((p) => ({ key: p.slug, label: p.name.replace(" Insurance", "") }));
