import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/interfaces/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  featuredProducts: Product[] = [];
  categories = ['Electronics', 'Fashion', 'Home & Living', 'Sports'];
  selectedCategory = 'All';

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadFeaturedProducts();
  }

  loadProducts() {
    this.products = [
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
  }

  loadFeaturedProducts() {
    this.featuredProducts = this.products.slice(0, 4);
  }

  getFilteredProducts(): Product[] {
    return this.selectedCategory === 'All'
      ? this.products
      : this.products.filter((p) => p.category === this.selectedCategory);
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product); // ✅ Use service, not localStorage
    this.showNotification(`${product.name} added to cart!`);
  }

  showNotification(message: string) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));
  }
}
