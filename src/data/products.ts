import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: 1,
    name: { en: "Cheese Burger", km: "ប៊ឺហ្គ័រឈីស" },
    category: { en: "Burger", km: "ប៊ឺហ្គ័រ" },
    price: 5.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: { en: "Pepperoni Pizza", km: "ភីហ្សាផេបភឺរ៉ូនី" },
    category: { en: "Pizza", km: "ភីហ្សា" },
    price: 12.5,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: { en: "Fried Chicken", km: "មាន់បំពង" },
    category: { en: "Chicken", km: "សាច់មាន់" },
    price: 8.25,
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: { en: "Iced Coffee", km: "កាហ្វេទឹកកក" },
    category: { en: "Drink", km: "ភេសជ្ជៈ" },
    price: 3.5,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: { en: "French Fries", km: "ដំឡូងបំពង" },
    category: { en: "Snack", km: "អាហារសម្រន់" },
    price: 4.25,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: { en: "Chocolate Cake", km: "នំខេកសូកូឡា" },
    category: { en: "Dessert", km: "បង្អែម" },
    price: 6.75,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
  },
];

export const categories = [
  { en: "All", km: "ទាំងអស់" },
  { en: "Burger", km: "ប៊ឺហ្គ័រ" },
  { en: "Pizza", km: "ភីហ្សា" },
  { en: "Chicken", km: "សាច់មាន់" },
  { en: "Drink", km: "ភេសជ្ជៈ" },
  { en: "Snack", km: "អាហារសម្រន់" },
  { en: "Dessert", km: "បង្អែម" },
];
