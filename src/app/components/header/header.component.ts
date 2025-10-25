import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  brand: string = 'ShopSmart';
  cartCount = 0;

  isLoggedIn$: Observable<boolean>;
  userEmail: string | null = null;

  private cartUpdateListener: any;

  constructor(private auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
    // keep user email updated from localStorage (simple approach)
    this.userEmail = this.auth.getUser()?.email ?? null;
    // subscribe to update email on state change
    this.isLoggedIn$.subscribe((logged) => {
      this.userEmail = logged ? this.auth.getUser()?.email ?? null : null;
    });
  }

  ngOnInit() {
    // Initialize cart count
    this.updateCartCount();

    // Listen for cart updates
    this.cartUpdateListener = () => {
      this.updateCartCount();
    };
    window.addEventListener('cart-updated', this.cartUpdateListener);
  }

  ngOnDestroy() {
    // Clean up event listener
    if (this.cartUpdateListener) {
      window.removeEventListener('cart-updated', this.cartUpdateListener);
    }
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartCount = cart.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    );
  }

  isNavbarCollapsed = true;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  logout() {
    this.auth.logout();
  }
}
