import { Product } from '../interfaces/product';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description:
      'Premium noise-cancelling headphones with superior sound quality',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Electronics',
    rating: 4.5,
    stock: 25,
  },
  {
    id: 2,
    name: 'Smart Watch',
    description:
      'Track your fitness and stay connected with this elegant smartwatch',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'Electronics',
    rating: 4.8,
    stock: 15,
  },
  {
    id: 3,
    name: 'Leather Backpack',
    description: 'Stylish and durable backpack perfect for work or travel',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    category: 'Fashion',
    rating: 4.3,
    stock: 30,
  },
  {
    id: 4,
    name: 'Running Shoes',
    description: 'Lightweight and comfortable shoes for your daily runs',
    price: 119.99,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'Sports',
    rating: 4.7,
    stock: 40,
  },
  {
    id: 5,
    name: 'Coffee Maker',
    description: 'Brew the perfect cup of coffee every morning',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop',
    category: 'Home & Living',
    rating: 4.4,
    stock: 20,
  },
  {
    id: 6,
    name: 'Sunglasses',
    description: 'UV protection with classic style',
    price: 149.99,
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    category: 'Fashion',
    rating: 4.6,
    stock: 35,
  },
  {
    id: 7,
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for your daily practice',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
    category: 'Sports',
    rating: 4.5,
    stock: 50,
  },
  {
    id: 8,
    name: 'Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness',
    price: 49.99,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
    category: 'Home & Living',
    rating: 4.2,
    stock: 18,
  },
];

export const CATEGORIES: string[] = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports',
];
