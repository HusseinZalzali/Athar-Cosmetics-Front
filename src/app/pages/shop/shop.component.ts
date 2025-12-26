import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Category } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="shop-page container">
      <h1 class="page-title">Shop</h1>

      <div class="shop-content">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar">
          <div class="filter-section">
            <h3>Search</h3>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="applyFilters()"
              placeholder="Search products..."
              class="search-input"
            />
          </div>

          <div class="filter-section">
            <h3>Category</h3>
            <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="filter-select">
              <option [value]="null">All</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="filter-section">
            <h3>Price</h3>
            <div class="price-range">
              <input 
                type="number" 
                [(ngModel)]="minPrice" 
                (input)="applyFilters()"
                placeholder="Min"
                class="price-input"
              />
              <span>-</span>
              <input 
                type="number" 
                [(ngModel)]="maxPrice" 
                (input)="applyFilters()"
                placeholder="Max"
                class="price-input"
              />
            </div>
          </div>

          <div class="filter-section">
            <h3>Sort</h3>
            <select [(ngModel)]="sortBy" (change)="applyFilters()" class="filter-select">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="products-main">
          <div class="products-grid" *ngIf="products.length > 0">
            <div 
              *ngFor="let product of products" 
              class="product-card card" 
              [routerLink]="['/product', product.id]"
              (mouseenter)="startImageCarousel(product.id)"
              (mouseleave)="stopImageCarousel(product.id)"
            >
            <div class="product-image">
              <img 
                [src]="getProductImage(product, getCurrentImageIndex(product.id))" 
                [alt]="product.name" 
                loading="lazy" 
                (error)="handleImageError($event)" 
                (load)="handleImageLoad($event)"
                class="product-img"
              />
            </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-price">{{ '$' + (product.price | number:'1.2-2') }}</p>
                <button 
                  (click)="addToCart(product, $event)" 
                  class="btn btn-primary btn-small"
                  [disabled]="product.stock === 0"
                >
                  {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                </button>
              </div>
            </div>
          </div>

        <div class="loading" *ngIf="loading">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>

          <div class="no-products" *ngIf="!loading && products.length === 0">
            No products found
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shop-page {
      padding: 2rem 0;
    }

    .page-title {
      margin-bottom: 2rem;
      color: var(--accent);
    }

    .shop-content {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 2rem;
    }

    .filters-sidebar {
      background-color: var(--surface-light);
      padding: 1.5rem;
      border-radius: var(--border-radius);
      height: fit-content;
      position: sticky;
      top: 100px;
    }

    .filter-section {
      margin-bottom: 2rem;

      h3 {
        font-size: 1rem;
        margin-bottom: 1rem;
        color: var(--accent);
      }
    }

    .search-input,
    .filter-select,
    .price-input {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--neutral-medium);
      border-radius: var(--border-radius);
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }

    .price-range {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .price-input {
        flex: 1;
      }
    }

    .products-main {
      min-height: 400px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    .product-card {
      cursor: pointer;
      overflow: hidden;
    }

      .product-image {
        width: 100%;
        height: 300px;
        overflow: hidden;
        background-color: var(--bg-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s ease-in-out;
        }
      }

    .product-info {
      text-align: center;
    }

    .product-name {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .product-price {
      font-size: 1.5rem;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .no-products {
      text-align: center;
      padding: 3rem;
      color: var(--neutral-medium);
    }

    @media (max-width: 768px) {
      .shop-content {
        grid-template-columns: 1fr;
      }

      .filters-sidebar {
        position: static;
        margin-bottom: 2rem;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }

      .product-image {
        height: 200px;
      }
    }

    @media (max-width: 480px) {
      .filters-sidebar {
        padding: 1rem;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }

      .product-card {
        max-width: 100%;
      }
    }
  `]
})
export class ShopComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  productImageIndices: Map<number, number> = new Map();
  carouselIntervals: Map<number, any> = new Map();

  searchQuery = '';
  selectedCategory: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = 'newest';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = +params['category'];
      }
      this.loadData();
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      }
    });
  }

  loadData(): void {
    this.loading = true;
    const params: any = {
      sort: this.sortBy
    };

    if (this.searchQuery) params.search = this.searchQuery;
    if (this.selectedCategory) params.category = this.selectedCategory;
    if (this.minPrice) params.minPrice = this.minPrice;
    if (this.maxPrice) params.maxPrice = this.maxPrice;

    this.productService.getProducts(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadData();
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(product, 1);
  }

  getProductImage(product: Product, imageIndex: number = 0): string {
    if (product.images && product.images.length > 0) {
      const index = Math.min(imageIndex, product.images.length - 1);
      const image = product.images[index];
      if (image && image.url) {
        const imageUrl = image.url;
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          return imageUrl;
        }
        // Construct absolute URL using backend API base URL
        const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        const baseUrl = environment.apiUrl.replace('/api', ''); // Remove /api to get base URL
        return `${baseUrl}${cleanUrl}`;
      }
    }
    return 'https://via.placeholder.com/300x300?text=No+Image';
  }

  getCurrentImageIndex(productId: number): number {
    return this.productImageIndices.get(productId) || 0;
  }

  startImageCarousel(productId: number): void {
    const product = this.products.find(p => p.id === productId);
    if (!product || !product.images || product.images.length <= 1) {
      return;
    }

    // Stop any existing carousel for this product
    this.stopImageCarousel(productId);

    // Start cycling through images
    const interval = setInterval(() => {
      const currentIndex = this.getCurrentImageIndex(productId);
      const nextIndex = (currentIndex + 1) % product.images.length;
      this.productImageIndices.set(productId, nextIndex);
    }, 800); // Change image every 0.8 seconds

    this.carouselIntervals.set(productId, interval);
  }

  stopImageCarousel(productId: number): void {
    const interval = this.carouselIntervals.get(productId);
    if (interval) {
      clearInterval(interval);
      this.carouselIntervals.delete(productId);
    }
    // Reset to first image when mouse leaves
    this.productImageIndices.set(productId, 0);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x300?text=No+Image';
  }

  handleImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
  }

  ngOnDestroy(): void {
    // Clean up all intervals when component is destroyed
    this.carouselIntervals.forEach(interval => clearInterval(interval));
    this.carouselIntervals.clear();
    this.productImageIndices.clear();
  }
}

