import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="product-detail-page container" *ngIf="product">
      <div class="product-detail-content">
        <!-- Product Images -->
        <div class="product-images">
          <div class="main-image">
            <img [src]="getImageUrl(selectedImage)" [alt]="product.name" loading="eager" />
          </div>
          <div class="thumbnail-images" *ngIf="product.images && product.images.length > 1">
            <img 
              *ngFor="let img of product.images" 
              [src]="getImageUrl(img.url)"
              (click)="selectedImage = img.url"
              [class.active]="selectedImage === img.url"
              class="thumbnail"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-price">{{ '$' + (product.price | number:'1.2-2') }}</p>
          
          <div class="product-meta">
            <p><strong>SKU:</strong> {{ product.sku }}</p>
            <p><strong>Stock:</strong> 
              <span [class.in-stock]="product.stock > 0" [class.out-of-stock]="product.stock === 0">
                {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
              </span>
            </p>
          </div>

          <div class="product-description">
            <h3>Description</h3>
            <p>{{ product.description }}</p>
          </div>

          <div class="product-ingredients" *ngIf="product.ingredients">
            <h3>Ingredients</h3>
            <p>{{ product.ingredients }}</p>
          </div>

          <div class="product-usage" *ngIf="product.usage">
            <h3>Usage</h3>
            <p>{{ product.usage }}</p>
          </div>

          <div class="add-to-cart-section">
            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button (click)="decreaseQuantity()" class="qty-btn">-</button>
                <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stock" class="qty-input" />
                <button (click)="increaseQuantity()" class="qty-btn">+</button>
              </div>
            </div>
            <button 
              (click)="addToCart()" 
              class="btn btn-primary"
              [disabled]="product.stock === 0"
            >
              {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section class="related-products" *ngIf="relatedProducts.length > 0">
        <h2>Related Products</h2>
        <div class="products-grid">
          <div *ngFor="let related of relatedProducts" class="product-card card" [routerLink]="['/product', related.id]">
            <div class="product-image">
              <img [src]="getImageUrl(related.images && related.images[0] ? related.images[0].url : '')" [alt]="related.name" loading="lazy" />
            </div>
            <div class="product-info">
              <h3>{{ related.name }}</h3>
              <p class="product-price">{{ '$' + (related.price | number:'1.2-2') }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="loading container" *ngIf="loading">
      <div class="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  `,
  styles: [`
    .product-detail-page {
      padding: 2rem 0;
    }

    .product-detail-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 4rem;
    }

    .product-images {
      .main-image {
        width: 100%;
        height: 500px;
        overflow: hidden;
        background-color: var(--bg-secondary);
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      }

      .thumbnail-images {
        display: flex;
        gap: 1rem;
        overflow-x: auto;

        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--border-radius);
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.3s ease;

          &.active {
            border-color: var(--accent);
          }

          &:hover {
            border-color: var(--neutral-medium);
          }
        }
      }
    }

    .product-info {
      .product-name {
        font-size: 2.5rem;
        color: var(--accent);
        margin-bottom: 1rem;
      }

      .product-price {
        font-size: 2rem;
        color: var(--accent);
        font-weight: 600;
        margin-bottom: 2rem;
      }

      .product-meta {
        margin-bottom: 2rem;
        padding: 1rem;
        background-color: var(--surface-light);
        border-radius: var(--border-radius);

        p {
          margin-bottom: 0.5rem;

          .in-stock {
            color: #27ae60;
          }

          .out-of-stock {
            color: #e74c3c;
          }
        }
      }

      .product-description,
      .product-ingredients,
      .product-usage {
        margin-bottom: 2rem;

        h3 {
          color: var(--accent);
          margin-bottom: 1rem;
        }

        p {
          color: var(--text-secondary);
          line-height: 1.8;
        }
      }
    }

    .add-to-cart-section {
      padding: 2rem;
      background-color: var(--surface-light);
      border-radius: var(--border-radius);
      margin-top: 2rem;
    }

    .quantity-selector {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 1rem;

        .qty-btn {
          width: 40px;
          height: 40px;
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

        .qty-input {
          width: 80px;
          text-align: center;
          padding: 8px;
          border: 1px solid var(--neutral-medium);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border-radius: var(--border-radius);
        }
      }
    }

    .related-products {
      margin-top: 4rem;
      padding-top: 4rem;
      border-top: 1px solid var(--neutral-medium);

      h2 {
        margin-bottom: 2rem;
        color: var(--accent);
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 2rem;
      }

      .product-card {
        cursor: pointer;
      }

      .product-image {
        width: 100%;
        height: 200px;
        overflow: hidden;
        background-color: var(--bg-secondary);
        border-radius: var(--border-radius);
        margin-bottom: 1rem;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    @media (max-width: 768px) {
      .product-detail-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .product-images .main-image {
        height: 300px;
      }

      .product-info .product-name {
        font-size: 2rem;
      }

      .product-info .product-price {
        font-size: 1.5rem;
      }

      .related-products .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .product-images .main-image {
        height: 250px;
      }

      .thumbnail-images {
        gap: 0.5rem;

        .thumbnail {
          width: 60px;
          height: 60px;
        }
      }

      .add-to-cart-section {
        padding: 1.5rem;
      }

      .quantity-controls {
        .qty-input {
          width: 60px;
        }
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  quantity = 1;
  selectedImage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.product = response.data;
          if (this.product.images && this.product.images.length > 0) {
            this.selectedImage = this.product.images[0].url;
          }
          this.loadRelatedProducts();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(): void {
    if (!this.product) return;
    
    this.productService.getProducts({ category: this.product.category_id }).subscribe({
      next: (response) => {
        if (response.success) {
          this.relatedProducts = response.data
            .filter(p => p.id !== this.product!.id)
            .slice(0, 4);
        }
      }
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
    }
  }

  getImageUrl(url: string): string {
    if (!url) return 'https://via.placeholder.com/500x500?text=No+Image';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Construct absolute URL using backend API base URL
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    const baseUrl = environment.apiUrl.replace('/api', ''); // Remove /api to get base URL
    return `${baseUrl}${cleanUrl}`;
  }
}

