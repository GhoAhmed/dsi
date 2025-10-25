import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  brand: string = 'ShopSmart';
  cartCount = 0;

  isLoggedIn$: Observable<boolean>;
  userEmail: string | null = null;

  constructor(private auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
    // keep user email updated from localStorage (simple approach)
    this.userEmail = this.auth.getUser()?.email ?? null;
    // subscribe to update email on state change
    this.isLoggedIn$.subscribe((logged) => {
      this.userEmail = logged ? this.auth.getUser()?.email ?? null : null;
    });
  }

  isNavbarCollapsed = true;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  logout() {
    this.auth.logout();
  }
}
