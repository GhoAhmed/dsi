import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'fake_auth_token';
  private readonly STORAGE_USER = 'fake_auth_user';

  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor() {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  login(email: string, password: string): Promise<boolean> {
    // fake async behaviour: resolve if matches
    return new Promise((resolve) => {
      setTimeout(() => {
        const validEmail = 'user@gmail.com';
        const validPassword = '123456';

        if (email === validEmail && password === validPassword) {
          // set fake token and user info
          localStorage.setItem(this.STORAGE_KEY, 'fake-jwt-token');
          localStorage.setItem(this.STORAGE_USER, JSON.stringify({ email }));
          this._isLoggedIn$.next(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500); // small delay to simulate network
    });
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_USER);
    this._isLoggedIn$.next(false);
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.STORAGE_USER);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }
}
