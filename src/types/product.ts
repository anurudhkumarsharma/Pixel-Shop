// src/types/product.ts

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { // FakeStore API includes rating, good to type it
    rate: number;
    count: number;
  };
}