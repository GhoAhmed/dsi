import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItem } from '../../core/interfaces/cart-item';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  private destroy$ = new Subject<void>();
  private previousItemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart() {
    // Subscribe to cart changes and unsubscribe on destroy
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      // Check if new items were added
      const newItemCount = items.length;
      const itemAdded = newItemCount > this.previousItemCount;

      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();

      // Trigger animation for newly added items
      if (itemAdded && this.previousItemCount > 0) {
        setTimeout(() => {
          const newItem = items[items.length - 1];
          this.triggerItemAddedAnimation(newItem.id);
        }, 50);
      }

      this.previousItemCount = newItemCount;
    });
  }

  // Track items by ID for better performance
  trackByItemId(index: number, item: CartItem): number {
    return item.id;
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  increaseQuantity(productId: number) {
    const item = this.cartItems.find((i) => i.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
      this.triggerQuantityAnimation(productId);
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cartItems.find((i) => i.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
      this.triggerQuantityAnimation(productId);
    } else if (item && item.quantity === 1) {
      // If quantity is 1, remove the item with animation
      this.removeItem(productId);
    }
  }

  removeItem(productId: number) {
    const itemElement = document.querySelector(`[data-item-id="${productId}"]`);

    if (itemElement) {
      // Add removing animation
      itemElement.classList.add('item-removing');

      // Remove item after animation completes
      setTimeout(() => {
        this.cartService.removeFromCart(productId);
        this.showNotification('Item removed from cart');
      }, 400);
    } else {
      this.cartService.removeFromCart(productId);
      this.showNotification('Item removed from cart');
    }
  }

  clearCart() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove all items from your cart!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Animate all items out
        const allItems = document.querySelectorAll('.cart-item');

        allItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('item-removing');
          }, index * 100);
        });

        // Clear cart after all animations complete
        setTimeout(() => {
          this.cartService.clearCart();
          Swal.fire({
            title: 'Cleared!',
            text: 'Your cart has been emptied.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            confirmButtonColor: '#667eea',
          });
        }, allItems.length * 100 + 400);
      }
    });
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  // ============================================
  // ANIMATION TRIGGERS
  // ============================================

  /**
   * Trigger animation when item is added to cart
   */
  private triggerItemAddedAnimation(itemId: number): void {
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemElement) {
      itemElement.classList.add('item-added');
      setTimeout(() => {
        itemElement.classList.remove('item-added');
      }, 1300);
    }
  }

  /**
   * Trigger animations when quantity changes
   */
  private triggerQuantityAnimation(itemId: number): void {
    // Animate the cart item container
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemElement) {
      itemElement.classList.add('quantity-changed');
      setTimeout(() => {
        itemElement.classList.remove('quantity-changed');
      }, 400);
    }

    // Animate the quantity value
    const quantityElement = document.querySelector(
      `[data-quantity-id="${itemId}"]`
    );
    if (quantityElement) {
      quantityElement.classList.add('value-changed');
      setTimeout(() => {
        quantityElement.classList.remove('value-changed');
      }, 400);
    }

    // Animate the item price
    const priceElement = document.querySelector(`[data-price-id="${itemId}"]`);
    if (priceElement) {
      priceElement.classList.add('price-changed');
      setTimeout(() => {
        priceElement.classList.remove('price-changed');
      }, 500);
    }

    // Animate the total in order summary
    this.triggerTotalAnimation();
  }

  /**
   * Trigger animation for order total update
   */
  private triggerTotalAnimation(): void {
    const totalElements = document.querySelectorAll('.summary-total');
    totalElements.forEach((element) => {
      element.classList.add('total-updated');
      setTimeout(() => {
        element.classList.remove('total-updated');
      }, 600);
    });
  }

  /**
   * Show notification toast with animation
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

    // Hide after 2 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 400);
    }, 2000);
  }
}
