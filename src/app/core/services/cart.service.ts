import { Injectable } from '@angular/core';
import { CartItem } from '../interfaces/cart-item';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>(
    this.getCartFromStorage()
  );
  public cart$ = this.cartSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(
    this.calculateCartCount()
  );
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor() {}

  private getCartFromStorage(): CartItem[] {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from storage:', error);
      return [];
    }
  }

  private saveCart(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart); // immediately notify subscribers
    this.cartCountSubject.next(this.calculateCartCount(cart));
  }

  private calculateCartCount(
    cart: CartItem[] = this.getCartFromStorage()
  ): number {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  getCartCount(): number {
    return this.cartCountSubject.value;
  }

  addToCart(product: any): void {
    const cart = [...this.cartSubject.value];
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    this.saveCart(cart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = [...this.cartSubject.value];
    const product = cart.find((item) => item.id === productId);
    if (product) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        product.quantity = quantity;
        this.saveCart(cart);
      }
    }
  }

  removeFromCart(productId: number): void {
    const cart = this.cartSubject.value.filter((item) => item.id !== productId);
    this.saveCart(cart);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
