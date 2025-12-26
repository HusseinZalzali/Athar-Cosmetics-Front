import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Category } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-background"></div>
        <div class="hero-content">
          <div class="hero-brand">
            <img src="assets/logo.png" alt="Athar Cosmetics" class="hero-logo" />
            <h1 class="hero-title">Athar Cosmetics</h1>
          </div>
          <p class="hero-subtitle">
            Discover our luxurious collection of carefully crafted body care products
          </p>
          <a routerLink="/shop" class="btn btn-primary hero-cta">Shop Now</a>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="featured-section container">
        <h2 class="section-title">Featured Products</h2>
        <div class="products-grid" *ngIf="featuredProducts.length > 0">
          <div 
            *ngFor="let product of featuredProducts" 
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
            </div>
          </div>
        </div>
        <div class="loading" *ngIf="loading">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </section>

      <!-- Shop by Category -->
      <section class="categories-section container">
        <h2 class="section-title">Shop by Category</h2>
        <div class="categories-grid">
          <div *ngFor="let category of categories" class="category-card card" [routerLink]="['/shop']" [queryParams]="{category: category.id}">
            <h3 class="category-name">{{ category.name }}</h3>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: calc(100vh - 200px);
    }

    .hero {
      position: relative;
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4rem;
      overflow: hidden;
      padding: 4rem 2rem;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg-gradient);
      z-index: 0;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 30%, rgba(199, 161, 90, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(44, 95, 95, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(61, 122, 122, 0.1) 0%, transparent 60%);
        pointer-events: none;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg, rgba(26, 74, 74, 0.1) 0%, transparent 50%, rgba(26, 74, 74, 0.1) 100%);
        pointer-events: none;
      }
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 900px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .hero-brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
      position: relative;
    }

    .hero-logo {
      max-width: 280px;
      width: 100%;
      height: auto;
      filter: drop-shadow(0 8px 32px rgba(199, 161, 90, 0.5));
      animation: logoFadeIn 1s ease-out;
      mix-blend-mode: normal;
      position: relative;
      z-index: 2;
    }

    @keyframes logoFadeIn {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .hero-title {
      font-size: 3.5rem;
      color: var(--accent);
      font-weight: 600;
      text-shadow: 
        0 2px 10px rgba(199, 161, 90, 0.4),
        0 4px 20px rgba(26, 74, 74, 0.3);
      position: relative;
      z-index: 2;
      margin: 0;
      animation: titleFadeIn 1s ease-out 0.2s both;
      letter-spacing: -0.02em;
    }

    @keyframes titleFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--text-light);
      font-weight: 300;
      line-height: 1.6;
      max-width: 600px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 2;
      margin: 0;
      animation: subtitleFadeIn 1s ease-out 0.4s both;
    }

    @keyframes subtitleFadeIn {
      from {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-cta {
      margin-top: 0.5rem;
      animation: ctaFadeIn 1s ease-out 0.6s both;
      position: relative;
      z-index: 2;
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
      box-shadow: 0 4px 20px rgba(199, 161, 90, 0.4);
    }

    @keyframes ctaFadeIn {
      from {
        opacity: 0;
        transform: translateY(15px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .featured-section,
    .categories-section {
      padding: 4rem 0;
    }

    .section-title {
      text-align: center;
      margin-bottom: 3rem;
      color: var(--accent);
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
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .category-card {
      text-align: center;
      padding: 3rem 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
      color: var(--text-light);

      &:hover {
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
        transform: translateY(-4px);
        box-shadow: var(--shadow-hover);
        
        .category-name {
          color: var(--accent);
        }
      }
    }

    .category-name {
      color: var(--text-light);
      font-size: 1.5rem;
      transition: color 0.3s ease;
    }

    @media (max-width: 768px) {
      .hero {
        min-height: 60vh;
        padding: 3rem 1.5rem;
      }

      .hero-logo {
        max-width: 220px;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .hero-cta {
        padding: 0.875rem 2rem;
        font-size: 1rem;
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
      .hero {
        min-height: 55vh;
        padding: 2.5rem 1rem;
      }

      .hero-logo {
        max-width: 180px;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .hero-brand {
        gap: 0.75rem;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }

      .categories-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  productImageIndices: Map<number, number> = new Map();
  carouselIntervals: Map<number, any> = new Map();

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Load featured products
    this.productService.getProducts({ featured: true }).subscribe({
      next: (response) => {
        if (response.success) {
          this.featuredProducts = response.data.slice(0, 8);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    // Load categories
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      }
    });
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
        // Ensure URL starts with / if it doesn't
        const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        return cleanUrl;
      }
    }
    return 'https://via.placeholder.com/300x300?text=No+Image';
  }

  getCurrentImageIndex(productId: number): number {
    return this.productImageIndices.get(productId) || 0;
  }

  startImageCarousel(productId: number): void {
    const product = this.featuredProducts.find(p => p.id === productId);
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

