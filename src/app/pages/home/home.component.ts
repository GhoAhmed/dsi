import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/interfaces/product';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CATEGORIES, PRODUCTS } from '../../core/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  featuredProducts: Product[] = [];
  categories = CATEGORIES;
  selectedCategory = 'All';

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadFeaturedProducts();
  }

  loadProducts() {
    this.products = PRODUCTS;
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

  /**
   * Enhanced add to cart with flying animation
   */
  addToCart(product: Product, event?: MouseEvent) {
    // Add to cart service
    this.cartService.addToCart(product);

    // Get the clicked button element
    const button = event?.currentTarget as HTMLElement;
    const productCard = button?.closest('.product-card') as HTMLElement;
    const productImage = productCard?.querySelector(
      '.product-image'
    ) as HTMLImageElement;

    if (button && productCard && productImage) {
      // Trigger animations
      this.triggerButtonAnimation(button);
      this.triggerCardAnimation(productCard);
      this.triggerImageAnimation(productImage);
      this.createFlyingImage(productImage, event!);
      this.createSuccessParticles(event!);
      this.animateCartIcon();
    }

    // Show notification
    this.showNotification(`${product.name} added to cart!`);
  }

  /**
   * Trigger button pulse animation
   */
  private triggerButtonAnimation(button: HTMLElement): void {
    button.classList.add('adding');

    // Add success checkmark temporarily
    const checkmark = document.createElement('i');
    checkmark.className = 'fas fa-check success-icon';
    button.appendChild(checkmark);

    setTimeout(() => {
      button.classList.remove('adding');
      checkmark.remove();
    }, 600);
  }

  /**
   * Trigger product card success animation
   */
  private triggerCardAnimation(card: HTMLElement): void {
    card.classList.add('item-added');
    setTimeout(() => {
      card.classList.remove('item-added');
    }, 600);
  }

  /**
   * Trigger product image pulse animation
   */
  private triggerImageAnimation(image: HTMLImageElement): void {
    image.classList.add('adding');
    setTimeout(() => {
      image.classList.remove('adding');
    }, 500);
  }

  /**
   * Create flying product image animation to cart
   */
  private createFlyingImage(
    sourceImage: HTMLImageElement,
    event: MouseEvent
  ): void {
    // Get cart icon position (adjust selector to match your navbar cart icon)
    const cartIcon =
      document.querySelector('.navbar .fa-shopping-cart') ||
      document.querySelector('[routerLink="/cart"]') ||
      document.querySelector('.cart-icon');

    if (!cartIcon) return;

    const cartRect = cartIcon.getBoundingClientRect();
    const sourceRect = sourceImage.getBoundingClientRect();

    // Create flying image element
    const flyingImg = document.createElement('img');
    flyingImg.src = sourceImage.src;
    flyingImg.className = 'flying-image';

    // Set initial position and size
    flyingImg.style.width = `${sourceRect.width}px`;
    flyingImg.style.height = `${sourceRect.height}px`;
    flyingImg.style.left = `${sourceRect.left}px`;
    flyingImg.style.top = `${sourceRect.top}px`;

    // Calculate translation distances
    const deltaX = cartRect.left - sourceRect.left + cartRect.width / 2;
    const deltaY = cartRect.top - sourceRect.top + cartRect.height / 2;

    // Set CSS custom properties for animation
    flyingImg.style.setProperty('--tx', `${deltaX}px`);
    flyingImg.style.setProperty('--ty', `${deltaY}px`);

    // Add to document
    document.body.appendChild(flyingImg);

    // Remove after animation completes
    setTimeout(() => {
      flyingImg.remove();
    }, 900);
  }

  /**
   * Create success particles effect
   */
  private createSuccessParticles(event: MouseEvent): void {
    const colors = ['#667eea', '#764ba2', '#10b981', '#fbbf24', '#f093fb'];
    const icons = [
      'fas fa-star',
      'fas fa-heart',
      'fas fa-check',
      'fas fa-sparkles',
    ];
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('i');
      const iconClass = icons[Math.floor(Math.random() * icons.length)];
      particle.className = `${iconClass} success-particle`;
      particle.style.color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.fontSize = `${15 + Math.random() * 15}px`;
      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;

      // Random direction for each particle
      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 50 + Math.random() * 50;
      const px = Math.cos(angle) * distance;
      const py = Math.sin(angle) * distance;

      particle.style.setProperty('--px', `${px}px`);
      particle.style.setProperty('--py', `${py}px`);

      document.body.appendChild(particle);

      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  }

  /**
   * Animate cart icon in navbar
   */
  private animateCartIcon(): void {
    const cartIcon =
      document.querySelector('.navbar .fa-shopping-cart') ||
      document.querySelector('[routerLink="/cart"]') ||
      document.querySelector('.cart-icon');

    if (cartIcon) {
      cartIcon.classList.add('cart-icon-bounce');
      setTimeout(() => {
        cartIcon.classList.remove('cart-icon-bounce');
      }, 600);
    }

    // Animate cart badge if it exists
    const cartBadge =
      document.querySelector('.cart-badge') || document.querySelector('.badge');

    if (cartBadge) {
      cartBadge.classList.add('cart-badge-pulse');
      setTimeout(() => {
        cartBadge.classList.remove('cart-badge-pulse');
      }, 600);
    }
  }

  /**
   * Show notification with enhanced animation
   */
  showNotification(message: string) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle me-2"></i>
      ${message}
    `;
    document.body.appendChild(notification);

    // Trigger show animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Auto hide after 2.5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 2500);
  }

  /**
   * Get star rating array for display
   */
  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));
  }

  /**
   * Track products by ID for better performance
   */
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
