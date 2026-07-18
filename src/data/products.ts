import type { Product } from "../types/product";

const API_URL = "https://api.sheety.co/e47dcae5ed33aa21c3b1cad5e3644552/productDb/sheet1";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    
    return (data.sheet1 || []).map((item: any, index: number) => ({
      id: Number(item.id) || index + 1,
      name: {
        en: item.nameEn || item.nameen || item.name || "",
        km: item.nameKm || item.namekm || ""
      },
      category: {
        en: item.categoryEn || item.categoryen || item.category || "Fish",
        km: item.categoryKm || item.categorykm || "ត្រី"
      },
      description: {
        en: item.descriptionEn || item.descriptionen || item.description || "",
        km: item.descriptionKm || item.descriptionkm || ""
      },
      price: Number(item.price) || 0,
      imageName: item.imageName || item.image || `product${index + 1}.png`,
    }));
  } catch (error) {
    console.error("Error fetching live inventory:", error);
    return [];
  }
};

// Categories based on your actual products
export const categories = [
  { en: "All", km: "ទាំងអស់" },
  { en: "Fish", km: "ត្រីងៀត" },
  { en: "Shrimp", km: "ត្រីឆ្អើរ" },
];