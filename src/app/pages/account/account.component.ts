import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="account-page container">
      <h1 class="page-title">{{ currentLang === 'ar' ? 'حسابي' : 'My Account' }}</h1>

      <div class="orders-section">
        <h2>{{ currentLang === 'ar' ? 'طلباتي' : 'My Orders' }}</h2>

        <div class="orders-list" *ngIf="orders.length > 0">
          <div *ngFor="let order of orders" class="order-card card">
            <div class="order-header">
              <div>
                <h3>{{ currentLang === 'ar' ? 'طلب رقم' : 'Order' }} #{{ order.id }}</h3>
                <p class="order-date">{{ order.created_at | date:'medium' }}</p>
              </div>
              <div class="order-status" [class]="'status-' + order.status">
                {{ getStatusText(order.status) }}
              </div>
            </div>

            <div class="order-items">
              <div *ngFor="let item of order.items" class="order-item">
                <span>{{ item.product?.name || 'Product' }} × {{ item.quantity }}</span>
                <span>{{ '$' + (item.line_total | number:'1.2-2') }}</span>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                <strong>{{ currentLang === 'ar' ? 'الإجمالي:' : 'Total:' }}</strong>
                <strong>{{ '$' + (order.total | number:'1.2-2') }}</strong>
              </div>
              <div class="order-shipping">
                <p><strong>{{ currentLang === 'ar' ? 'الشحن إلى:' : 'Shipping to:' }}</strong> {{ order.shipping_name }}, {{ order.shipping_city }}</p>
                <p><strong>{{ currentLang === 'ar' ? 'طريقة الدفع:' : 'Payment:' }}</strong> {{ getPaymentMethodText(order.payment_method) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="no-orders" *ngIf="!loading && orders.length === 0">
          <p>{{ currentLang === 'ar' ? 'لا توجد طلبات' : 'No orders yet' }}</p>
          <a routerLink="/shop" class="btn btn-primary">{{ currentLang === 'ar' ? 'تسوق الآن' : 'Shop Now' }}</a>
        </div>

        <div class="loading" *ngIf="loading">
          {{ currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...' }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-page {
      padding: 2rem 0;
    }

    .page-title {
      margin-bottom: 2rem;
      color: var(--accent);
    }

    .orders-section {
      h2 {
        margin-bottom: 2rem;
        color: var(--text-primary);
      }
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .order-card {
      padding: 2rem;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--neutral-medium);

      h3 {
        color: var(--accent);
        margin-bottom: 0.5rem;
      }

      .order-date {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
    }

    .order-status {
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;

      &.status-pending {
        background-color: rgba(255, 193, 7, 0.2);
        color: #ffc107;
      }

      &.status-paid {
        background-color: rgba(40, 167, 69, 0.2);
        color: #28a745;
      }

      &.status-shipped {
        background-color: rgba(0, 123, 255, 0.2);
        color: #007bff;
      }

      &.status-delivered {
        background-color: rgba(40, 167, 69, 0.2);
        color: #28a745;
      }

      &.status-cancelled {
        background-color: rgba(220, 53, 69, 0.2);
        color: #dc3545;
      }
    }

    .order-items {
      margin-bottom: 1.5rem;

      .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        color: var(--text-secondary);
      }
    }

    .order-footer {
      padding-top: 1.5rem;
      border-top: 1px solid var(--neutral-medium);

      .order-total {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-size: 1.25rem;
        color: var(--accent);
      }

      .order-shipping {
        p {
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      }
    }

    .no-orders {
      text-align: center;
      padding: 4rem 2rem;

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        color: var(--text-secondary);
      }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .account-page {
        padding: 1.5rem 0;
      }

      .order-card {
        padding: 1.5rem;
      }

      .order-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .order-footer {
        .order-total {
          font-size: 1.1rem;
        }
      }
    }

    @media (max-width: 480px) {
      .order-card {
        padding: 1rem;
      }

      .order-items {
        .order-item {
          font-size: 0.9rem;
        }
      }

      .order-footer {
        .order-total {
          font-size: 1rem;
        }
      }
    }
  `]
})
export class AccountComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  currentLang = 'en';

  constructor(
    private orderService: OrderService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });

    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: { en: string; ar: string } } = {
      pending: { en: 'Pending', ar: 'قيد الانتظار' },
      paid: { en: 'Paid', ar: 'مدفوع' },
      shipped: { en: 'Shipped', ar: 'تم الشحن' },
      delivered: { en: 'Delivered', ar: 'تم التسليم' },
      cancelled: { en: 'Cancelled', ar: 'ملغي' }
    };
    const statusEntry = statusMap[status];
    if (statusEntry) {
      return statusEntry[this.currentLang as 'en' | 'ar'] || status;
    }
    return status;
  }

  getPaymentMethodText(method: string): string {
    if (method === 'cash_on_delivery') {
      return this.currentLang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery';
    }
    return method;
  }
}

