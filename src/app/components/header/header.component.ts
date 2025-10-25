import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  brand = 'ShopSmart';
  cartCount = 0;
  isLoggedIn$!: Observable<boolean>; // initialize later
  userEmail: string | null = null;

  private subscription = new Subscription();
  isNavbarCollapsed = true;

  constructor(private cartService: CartService, private auth: AuthService) {
    // Initialize isLoggedIn$ here, after auth is available
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  ngOnInit() {
    // Subscribe to cart count updates
    this.subscription.add(
      this.cartService.cartCount$.subscribe((count) => {
        this.cartCount = count;
      })
    );

    // Subscribe to auth changes
    this.subscription.add(
      this.isLoggedIn$.subscribe((logged) => {
        this.userEmail = logged ? this.auth.getUser()?.email ?? null : null;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  logout() {
    this.auth.logout();
  }
}
