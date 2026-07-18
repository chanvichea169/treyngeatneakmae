export type Product = {
  id: number;
  name: {
    en: string;
    km: string;
  };
  category: {
    en: string;
    km: string;
  };
  price: number;
  image: string;
  description?: {
    en?: string;
    km?: string;
  };
};
