import type { Product } from "../types/product";
import productImage from "../assets/products/image.png";
import productImage1 from "../assets/products/image1.png";

export const products: Product[] = [
  {
    id: 1,
    name: { en: "Cheese Burger", km: "ប៊ឺហ្គ័រឈីស" },
    category: { en: "Burger", km: "ប៊ឺហ្គ័រ" },
    price: 5.99,
    image: productImage,
  },
  {
    id: 2,
    name: { en: "Pepperoni Pizza", km: "ភីហ្សាផេបភឺរ៉ូនី" },
    category: { en: "Pizza", km: "ភីហ្សា" },
    price: 12.5,
    image: productImage1,
  },
  {
    id: 3,
    name: { en: "Fried Chicken", km: "មាន់បំពង" },
    category: { en: "Chicken", km: "សាច់មាន់" },
    price: 8.25,
    image: productImage,
  },
  {
    id: 4,
    name: { en: "Iced Coffee", km: "កាហ្វេទឹកកក" },
    category: { en: "Drink", km: "ភេសជ្ជៈ" },
    price: 3.5,
    image: productImage1,
  },
  {
    id: 5,
    name: { en: "French Fries", km: "ដំឡូងបំពង" },
    category: { en: "Snack", km: "អាហារសម្រន់" },
    price: 4.25,
    image: productImage,
  },
  {
    id: 6,
    name: { en: "Chocolate Cake", km: "នំខេកសូកូឡា" },
    category: { en: "Dessert", km: "បង្អែម" },
    price: 6.75,
    image: productImage1,
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
