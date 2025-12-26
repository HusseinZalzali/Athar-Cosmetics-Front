import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <a routerLink="/" class="logo" aria-label="Athar Cosmetics Home">
            <img src="assets/logo.png" alt="Athar Cosmetics" class="logo-image" (error)="showLogoText()" />
            <span class="logo-text" #logoText style="display: none;">Athar</span>
          </a>
          
          <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" [attr.aria-expanded]="mobileMenuOpen" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav class="nav" [class.mobile-open]="mobileMenuOpen">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">Home</a>
            <a routerLink="/shop" routerLinkActive="active" (click)="closeMobileMenu()">Shop</a>
            <a routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">About</a>
            <a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">Contact</a>
          </nav>

          <div class="header-actions">
            <a routerLink="/cart" class="cart-link" aria-label="Shopping cart">
              <span class="cart-icon">🛒</span>
              <span class="cart-count" *ngIf="cartCount > 0" [attr.aria-label]="cartCount + ' items in cart'">{{ cartCount }}</span>
            </a>

            <div class="auth-section" *ngIf="!isAuthenticated">
              <a routerLink="/login" class="btn btn-secondary btn-small">Login</a>
            </div>

            <div class="user-menu" *ngIf="isAuthenticated && !isAdmin">
              <a routerLink="/account" class="btn btn-secondary btn-small">Account</a>
              <button (click)="logout()" class="btn btn-secondary btn-small">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: var(--bg-primary);
      border-bottom: 2px solid var(--primary);
      box-shadow: 0 2px 10px rgba(44, 95, 95, 0.1);
      z-index: 1000;
      padding: 1rem 0;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--accent);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 50px;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      .logo-image {
        height: 100%;
        width: auto;
        max-width: 180px;
        object-fit: contain;
        display: block;
        filter: drop-shadow(0 2px 8px rgba(199, 161, 90, 0.2));
      }

      .logo-text {
        display: none;
        font-family: serif;
        letter-spacing: 2px;
      }

      .logo-image:not([src]),
      .logo-image[src=""],
      .logo-image[src="assets/logo.png"]:not([src*="logo.png"]) {
        display: none;
        
        & + .logo-text {
          display: block;
        }
      }
    }

    .nav {
      display: flex;
      gap: 2rem;
      flex: 1;
      justify-content: center;

      a {
        color: var(--text-primary);
        text-decoration: none;
        transition: color 0.3s ease;
        font-weight: 500;
        padding: 0.5rem 0;
        position: relative;

        &:hover, &.active {
          color: var(--accent);
        }

        &.active {
          font-weight: 600;
        }

        &.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--accent);
        }
      }
    }

    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      z-index: 1001;

      span {
        width: 25px;
        height: 3px;
        background-color: var(--text-primary);
        border-radius: 2px;
        transition: all 0.3s ease;
      }

      &:hover span {
        background-color: var(--accent);
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }


    .cart-link {
      position: relative;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 1.5rem;
      display: flex;
      align-items: center;

      .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: linear-gradient(135deg, var(--accent) 0%, var(--accent-gold) 100%);
        color: var(--bg-primary);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: bold;
        box-shadow: 0 2px 6px rgba(199, 161, 90, 0.4);
      }
    }

    .user-menu {
      display: flex;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .mobile-menu-toggle {
        display: flex;
      }

      .nav {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background-color: var(--bg-primary);
        flex-direction: column;
        padding: 2rem;
        box-shadow: var(--shadow);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1000;
        gap: 0;

        &.mobile-open {
          transform: translateX(0);
        }

        a {
          padding: 1rem;
          border-bottom: 1px solid var(--neutral-medium);
          width: 100%;
          display: block;

          &:last-child {
            border-bottom: none;
          }

          &.active::after {
            display: none;
          }
        }
      }

      .header-actions {
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .user-menu {
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;

        .btn {
          width: 100%;
        }
      }
    }

    @media (max-width: 480px) {
      .header {
        padding: 0.75rem 0;
      }

      .header-content {
        flex-wrap: wrap;
        gap: 1rem;
      }

      .logo {
        font-size: 1.25rem;
        height: 45px;

        .logo-image {
          max-width: 140px;
        }
      }

      .mobile-menu-toggle {
        padding: 6px;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
        margin-top: 0.5rem;
        order: 3;
      }

      .nav {
        top: 60px;
      }
    }

    @media (max-width: 360px) {
      .header {
        padding: 0.625rem 0;
      }

      .logo {
        height: 40px;
        font-size: 1.1rem;

        .logo-image {
          max-width: 120px;
        }
      }

      .mobile-menu-toggle {
        padding: 5px;

        span {
          width: 22px;
          height: 2.5px;
        }
      }

      .cart-link {
        font-size: 1.25rem;
      }

      .header-actions {
        gap: 0.5rem;
      }

      .nav {
        top: 55px;
        padding: 1.5rem;
      }
    }

    /* Landscape phone orientation */
    @media (max-width: 896px) and (orientation: landscape) and (max-height: 500px) {
      .header {
        padding: 0.5rem 0;
      }

      .logo {
        height: 40px;

        .logo-image {
          max-width: 120px;
        }
      }

      .nav {
        top: 50px;
        padding: 1rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  @ViewChild('logoText') logoText!: ElementRef<HTMLSpanElement>;
  isAuthenticated = false;
  isAdmin = false;
  cartCount = 0;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.isAdmin = user?.role === 'admin';
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartCount = this.cartService.getCartItemCount();
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  showLogoText(): void {
    if (this.logoText?.nativeElement) {
      this.logoText.nativeElement.style.display = 'block';
    }
  }
}

