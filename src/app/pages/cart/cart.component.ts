import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page container">
      <h1 class="page-title">Shopping Cart</h1>

      <div class="cart-content" *ngIf="cartItems.length > 0">
        <div class="cart-items">
          <div *ngFor="let item of cartItems" class="cart-item card">
            <div class="item-image">
              <img [src]="getProductImage(item.product)" [alt]="item.product.name" loading="lazy" (error)="handleImageError($event)" />
            </div>
            <div class="item-details">
              <h3 class="item-name">{{ item.product.name }}</h3>
              <p class="item-price">{{ '$' + (item.product.price | number:'1.2-2') }}</p>
            </div>
            <div class="item-quantity">
              <button (click)="updateQuantity(item.product.id, item.quantity - 1)" class="qty-btn">-</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button (click)="updateQuantity(item.product.id, item.quantity + 1)" class="qty-btn">+</button>
            </div>
            <div class="item-total">
              <p class="total-price">{{ '$' + ((item.product.price * item.quantity) | number:'1.2-2') }}</p>
            </div>
            <button (click)="removeItem(item.product.id)" class="remove-btn">×</button>
          </div>
        </div>

        <div class="cart-summary card">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal:</span>
            <span class="summary-value">{{ '$' + (subtotal | number:'1.2-2') }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span class="summary-value">Calculated at checkout</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span class="summary-value">{{ '$' + (subtotal | number:'1.2-2') }}</span>
          </div>
          <a routerLink="/checkout" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">
            Proceed to Checkout
          </a>
        </div>
      </div>

      <div class="empty-cart" *ngIf="cartItems.length === 0">
        <p>Your cart is empty</p>
        <a routerLink="/shop" class="btn btn-primary">Shop Now</a>
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      padding: 2rem 0;
    }

    .page-title {
      margin-bottom: 2rem;
      color: var(--accent);
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 120px 1fr 150px 120px 40px;
      gap: 1.5rem;
      align-items: center;
      padding: 1.5rem;
    }

    .item-image {
      width: 120px;
      height: 120px;
      overflow: hidden;
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .item-details {
      .item-name {
        font-size: 1.25rem;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }

      .item-price {
        color: var(--accent);
        font-size: 1.1rem;
      }
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;

      .qty-btn {
        width: 35px;
        height: 35px;
        border: 1px solid var(--neutral-medium);
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 1.25rem;
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
      }

      .qty-value {
        min-width: 30px;
        text-align: center;
        color: var(--text-primary);
      }
    }

    .item-total {
      text-align: center;

      .total-price {
        font-size: 1.25rem;
        color: var(--accent);
        font-weight: 600;
      }
    }

    .remove-btn {
      width: 35px;
      height: 35px;
      border: none;
      background-color: transparent;
      color: var(--text-secondary);
      font-size: 2rem;
      cursor: pointer;
      transition: color 0.3s ease;
      line-height: 1;

      &:hover {
        color: #e74c3c;
      }
    }

    .cart-summary {
      height: fit-content;
      position: sticky;
      top: 100px;

      h2 {
        margin-bottom: 1.5rem;
        color: var(--accent);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0;
        border-bottom: 1px solid var(--neutral-medium);

        &.total {
          border-bottom: none;
          border-top: 2px solid var(--accent);
          margin-top: 1rem;
          padding-top: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .summary-value {
          color: var(--accent);
        }
      }
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;

      p {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        color: var(--text-secondary);
      }
    }

    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .cart-summary {
        position: static;
        order: -1;
        margin-bottom: 2rem;
      }

      .cart-item {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
      }

      .item-image {
        width: 100%;
        height: 200px;
        margin: 0 auto;
      }

      .item-details {
        text-align: center;
      }

      .item-quantity {
        justify-content: center;
      }

      .item-total {
        text-align: center;
      }

      .remove-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
      }
    }

    @media (max-width: 480px) {
      .cart-item {
        padding: 1rem 0.5rem;
      }

      .item-quantity .qty-btn {
        width: 30px;
        height: 30px;
        font-size: 1rem;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.subtotal = this.cartService.getCartTotal();
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  getProductImage(product: any): string {
    if (product.images && product.images.length > 0 && product.images[0].url) {
      const imageUrl = product.images[0].url;
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      // Construct absolute URL using backend API base URL
      const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      const baseUrl = environment.apiUrl.replace('/api', ''); // Remove /api to get base URL
      return `${baseUrl}${cleanUrl}`;
    }
    return 'https://via.placeholder.com/300x300?text=No+Image';
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x300?text=No+Image';
  }
}

