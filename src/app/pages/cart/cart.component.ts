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
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });
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
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.cartItems.find((i) => i.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.showNotification('Item removed from cart');
  }

  clearCart() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove all items from your cart!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, clear it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        Swal.fire({
          title: 'Cleared!',
          text: 'Your cart has been emptied.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  showNotification(message: string) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle me-2"></i>
      ${message}
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}
