import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="checkout-page container">
      <h1 class="page-title">{{ currentLang === 'ar' ? 'الدفع' : 'Checkout' }}</h1>

      <div class="checkout-content" *ngIf="cartItems.length > 0">
        <form [formGroup]="checkoutForm" (ngSubmit)="placeOrder()" class="checkout-form">
          <!-- Shipping Information -->
          <section class="form-section card">
            <h2>{{ currentLang === 'ar' ? 'معلومات الشحن' : 'Shipping Information' }}</h2>
            
            <div class="form-group">
              <label>{{ currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name' }} *</label>
              <input type="text" formControlName="name" />
              <div class="error" *ngIf="checkoutForm.get('name')?.hasError('required') && checkoutForm.get('name')?.touched">
                {{ currentLang === 'ar' ? 'الاسم مطلوب' : 'Name is required' }}
              </div>
            </div>

            <div class="form-group">
              <label>{{ currentLang === 'ar' ? 'رقم الهاتف' : 'Phone Number' }} *</label>
              <input type="tel" formControlName="phone" />
              <div class="error" *ngIf="checkoutForm.get('phone')?.hasError('required') && checkoutForm.get('phone')?.touched">
                {{ currentLang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone is required' }}
              </div>
            </div>

            <div class="form-group">
              <label>{{ currentLang === 'ar' ? 'المدينة' : 'City' }} *</label>
              <input type="text" formControlName="city" />
              <div class="error" *ngIf="checkoutForm.get('city')?.hasError('required') && checkoutForm.get('city')?.touched">
                {{ currentLang === 'ar' ? 'المدينة مطلوبة' : 'City is required' }}
              </div>
            </div>

            <div class="form-group">
              <label>{{ currentLang === 'ar' ? 'العنوان' : 'Street Address' }} *</label>
              <textarea formControlName="street" rows="3"></textarea>
              <div class="error" *ngIf="checkoutForm.get('street')?.hasError('required') && checkoutForm.get('street')?.touched">
                {{ currentLang === 'ar' ? 'العنوان مطلوب' : 'Address is required' }}
              </div>
            </div>

            <div class="form-group">
              <label>{{ currentLang === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (Optional)' }}</label>
              <textarea formControlName="notes" rows="3"></textarea>
            </div>
          </section>

          <!-- Payment Method -->
          <section class="form-section card">
            <h2>{{ currentLang === 'ar' ? 'طريقة الدفع' : 'Payment Method' }}</h2>
            
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" formControlName="paymentMethod" value="cash_on_delivery" />
                <span>{{ currentLang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery' }}</span>
              </label>
              <label class="payment-option disabled">
                <input type="radio" value="online" disabled />
                <span>{{ currentLang === 'ar' ? 'الدفع الإلكتروني (قريباً)' : 'Online Payment (Coming Soon)' }}</span>
              </label>
            </div>
          </section>

          <!-- Order Summary -->
          <section class="order-summary card">
            <h2>{{ currentLang === 'ar' ? 'ملخص الطلب' : 'Order Summary' }}</h2>
            
            <div class="summary-items">
              <div *ngFor="let item of cartItems" class="summary-item">
                <span>{{ item.product.name }} × {{ item.quantity }}</span>
                <span>{{ '$' + ((item.product.price * item.quantity) | number:'1.2-2') }}</span>
              </div>
            </div>

            <div class="summary-total">
              <span>{{ currentLang === 'ar' ? 'الإجمالي:' : 'Total:' }}</span>
              <span class="total-amount">{{ '$' + (subtotal | number:'1.2-2') }}</span>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="checkoutForm.invalid || processing"
              style="width: 100%; margin-top: 1.5rem;"
            >
              {{ processing 
                ? (currentLang === 'ar' ? 'جاري المعالجة...' : 'Processing...') 
                : (currentLang === 'ar' ? 'تأكيد الطلب' : 'Place Order') }}
            </button>
          </section>
        </form>
      </div>

      <div class="empty-cart" *ngIf="cartItems.length === 0">
        <p>{{ currentLang === 'ar' ? 'السلة فارغة' : 'Your cart is empty' }}</p>
        <a routerLink="/shop" class="btn btn-primary">{{ currentLang === 'ar' ? 'تسوق الآن' : 'Shop Now' }}</a>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page {
      padding: 2rem 0;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .payment-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid var(--neutral-medium);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all 0.3s ease;

      input[type="radio"] {
        width: auto;
      }

      &:has(input:checked) {
        border-color: var(--accent);
        background-color: rgba(199, 161, 90, 0.1);
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .order-summary {
      position: sticky;
      top: 100px;
      height: fit-content;

      h2 {
        margin-bottom: 1.5rem;
        color: var(--accent);
      }

      .summary-items {
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--neutral-medium);

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
      }

      .summary-total {
        display: flex;
        justify-content: space-between;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--accent);
      }
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
    }

    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
        order: -1;
        margin-bottom: 2rem;
      }

      .form-section {
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .form-section {
        padding: 1rem;
      }

      .payment-option {
        padding: 0.75rem;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  subtotal = 0;
  processing = false;
  currentLang = 'en';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private languageService: LanguageService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      notes: [''],
      paymentMethod: ['cash_on_delivery', Validators.required]
    });
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.subtotal = this.cartService.getCartTotal();
    });

    if (this.cartItems.length === 0) {
      this.cartItems = this.cartService.getCartItems();
      this.subtotal = this.cartService.getCartTotal();
    }
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      return;
    }

    this.processing = true;

    const orderData = {
      items: this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      })),
      shipping: {
        name: this.checkoutForm.value.name,
        phone: this.checkoutForm.value.phone,
        city: this.checkoutForm.value.city,
        street: this.checkoutForm.value.street,
        notes: this.checkoutForm.value.notes
      },
      payment_method: this.checkoutForm.value.paymentMethod
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartService.clearCart();
          this.router.navigate(['/account']);
        }
        this.processing = false;
      },
      error: () => {
        this.processing = false;
      }
    });
  }
}

