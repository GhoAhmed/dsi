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
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(
    this.calculateCartCount()
  );
  public cartCount$: Observable<number> = this.cartCountSubject.asObservable();

  constructor() {}

  private getCartFromStorage(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  private saveCartToStorage(cart: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
    this.cartCountSubject.next(this.calculateCartCount());

    // Dispatch event for components not using the service
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }

  private calculateCartCount(): number {
    const cart = this.getCartFromStorage();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  getCartCount(): number {
    return this.cartCountSubject.value;
  }

  addToCart(product: any): void {
    const cart = this.getCartFromStorage();
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    this.saveCartToStorage(cart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCartFromStorage();
    const product = cart.find((item) => item.id === productId);

    if (product) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        product.quantity = quantity;
        this.saveCartToStorage(cart);
      }
    }
  }

  removeFromCart(productId: number): void {
    let cart = this.getCartFromStorage();
    cart = cart.filter((item) => item.id !== productId);
    this.saveCartToStorage(cart);
  }

  clearCart(): void {
    this.saveCartToStorage([]);
  }

  getCartTotal(): number {
    const cart = this.getCartFromStorage();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
