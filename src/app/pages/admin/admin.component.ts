import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product, Category } from '../../services/product.service';
import { OrderService, Order } from '../../services/order.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmModalComponent],
  template: `
    <div class="admin-page container">
      <h1 class="page-title">Admin Dashboard</h1>

      <div class="admin-tabs">
        <button 
          *ngFor="let tab of tabs" 
          (click)="activeTab = tab.id"
          [class.active]="activeTab === tab.id"
          class="tab-btn"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Products Tab -->
      <div class="tab-content" *ngIf="activeTab === 'products'">
        <div class="section-header">
          <h2>Products</h2>
          <a routerLink="/admin/products/new" class="btn btn-primary">
            Add Product
          </a>
        </div>

        <!-- Filters and Search -->
        <div class="admin-filters card">
          <div class="filter-row">
            <div class="filter-group">
              <label>Search Products</label>
              <input 
                type="text" 
                [(ngModel)]="productSearchQuery" 
                (input)="filterProducts()"
                placeholder="Search by name, SKU..."
                class="search-input"
              />
            </div>
            <div class="filter-group">
              <label>Category</label>
              <select [(ngModel)]="productCategoryFilter" (change)="filterProducts()" class="filter-select">
                <option value="">All Categories</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Stock Status</label>
              <select [(ngModel)]="productStockFilter" (change)="filterProducts()" class="filter-select">
                <option value="">All</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock (< 10)</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Featured</label>
              <select [(ngModel)]="productFeaturedFilter" (change)="filterProducts()" class="filter-select">
                <option value="">All</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </select>
            </div>
            <button (click)="clearFilters()" class="btn btn-secondary btn-small">Clear Filters</button>
          </div>
        </div>

        <div class="products-stats">
          <p>Showing {{ filteredProducts.length }} of {{ products.length }} products</p>
        </div>

        <div class="products-list">
          <div *ngFor="let product of filteredProducts" class="product-item card">
            <div class="product-preview">
              <img *ngIf="getProductImage(product)" [src]="getProductImage(product)" [alt]="product.name" class="product-thumbnail" />
              <div *ngIf="!getProductImage(product)" class="product-thumbnail placeholder">No Image</div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-sku">SKU: {{ product.sku }}</p>
              <p class="product-details">
                <span class="price">{{ '$' + (product.price | number:'1.2-2') }}</span> | 
                <span [class.stock-low]="product.stock < 10" [class.stock-out]="product.stock === 0">
                  Stock: {{ product.stock }}
                </span>
                <span *ngIf="product.is_featured" class="featured-badge">Featured</span>
              </p>
              <p class="product-category" *ngIf="product.category">Category: {{ product.category.name }}</p>
            </div>
            <div class="product-actions">
              <a [routerLink]="['/admin/products', product.id, 'edit']" class="btn btn-secondary btn-small">Edit</a>
              <button (click)="confirmDeleteProduct(product)" class="btn btn-secondary btn-small btn-danger">Delete</button>
            </div>
          </div>
        </div>
        <div *ngIf="filteredProducts.length === 0" class="empty-state">
          <p>No products found matching your filters.</p>
        </div>
      </div>

      <!-- Orders Tab -->
      <div class="tab-content" *ngIf="activeTab === 'orders'">
        <h2>Orders</h2>
        
        <div class="orders-list">
          <div *ngFor="let order of orders" class="order-item card">
            <div class="order-header">
              <div>
                <h3>Order #{{ order.id }}</h3>
                <p>{{ order.shipping_name }} | {{ order.created_at | date:'short' }}</p>
              </div>
              <div class="order-controls">
                <select [(ngModel)]="order.status" (change)="updateOrderStatus(order.id, order.status)" class="status-select">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div class="order-details">
              <p><strong>Total:</strong> {{ '$' + (order.total | number:'1.2-2') }}</p>
              <p><strong>Items:</strong> {{ order.items.length }}</p>
            </div>
          </div>
        </div>
      </div>


      <!-- Delete Product Confirmation Modal -->
      <app-confirm-modal
        *ngIf="showDeleteConfirm"
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        [danger]="true"
        (confirm)="deleteProduct()"
        (cancel)="showDeleteConfirm = false; productToDelete = null"
      ></app-confirm-modal>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 2rem 0;
    }

    .admin-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid var(--neutral-medium);
    }

    .tab-btn {
      padding: 1rem 2rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;

      &.active {
        color: var(--accent);
        border-bottom-color: var(--accent);
      }

      &:hover {
        color: var(--accent);
      }
    }

    .tab-content {
      margin-top: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .products-list,
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      gap: 1.5rem;
    }

    .product-preview {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }

    .product-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--border-radius-small);
      border: 1px solid var(--neutral-medium);
      
      &.placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--neutral-light);
        color: var(--text-muted);
        font-size: 0.75rem;
      }
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
    }

    .product-actions {
      display: flex;
      gap: 0.5rem;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .status-select {
      padding: 0.5rem;
      border: 1px solid var(--neutral-medium);
      border-radius: var(--border-radius);
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .modal-content {
      background-color: var(--surface-light);
      padding: 2rem;
      border-radius: var(--border-radius);
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;

      h2 {
        margin-bottom: 2rem;
        color: var(--accent);
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
      }

      .file-preview {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--bg-secondary);
        border-radius: var(--border-radius-small);
      }

      .preview-image {
        max-width: 200px;
        max-height: 200px;
        margin-top: 0.5rem;
        border-radius: var(--border-radius-small);
      }

      .images-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .image-item {
        border: 1px solid var(--neutral-medium);
        border-radius: var(--border-radius-small);
        overflow: hidden;
        background: white;

        img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          display: block;
        }

        .btn {
          width: 100%;
          border-radius: 0;
          margin-top: 0.5rem;
        }
      }
    }

    .admin-filters {
      margin-bottom: 2rem;
      padding: 1.5rem;
    }

    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-end;
    }

    .filter-group {
      flex: 1;
      min-width: 150px;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-secondary);
      }
    }

    .search-input,
    .filter-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--neutral-medium);
      border-radius: var(--border-radius-small);
      font-size: 0.95rem;
      font-family: 'Roboto', sans-serif;
    }

    .products-stats {
      margin-bottom: 1rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .product-sku {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0.25rem 0;
    }

    .product-details {
      margin: 0.5rem 0;
      font-size: 0.95rem;
    }

    .price {
      color: var(--accent);
      font-weight: 600;
    }

    .stock-low {
      color: var(--warning);
    }

    .stock-out {
      color: var(--error);
    }

    .featured-badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-gold) 100%);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: var(--border-radius-small);
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: 0.5rem;
    }

    .product-category {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .btn-danger {
      background-color: var(--error);
      color: white;
      border-color: var(--error);

      &:hover {
        background-color: #d32f2f;
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .admin-page {
        padding: 1.5rem 0;
      }

      .admin-tabs {
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .admin-filters {
        padding: 1rem;
      }

      .filter-row {
        flex-direction: column;
        gap: 1rem;
      }

      .filter-group {
        min-width: 100%;
      }

      .product-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .product-actions {
        width: 100%;
        flex-direction: column;
      }

      .order-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .modal-content {
        padding: 1.5rem;
        width: 95%;
      }
    }

    @media (max-width: 480px) {
      .admin-tabs {
        .tab-btn {
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
        }
      }

      .product-item {
        padding: 1rem;
      }

      .product-preview {
        width: 60px;
        height: 60px;
      }

      .order-item {
        padding: 1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab = 'products';
  tabs = [
    { id: 'products', name: 'Products' },
    { id: 'orders', name: 'Orders' }
  ];

  products: Product[] = [];
  categories: Category[] = [];
  orders: Order[] = [];
  loading = true;


  // Filtering
  productSearchQuery = '';
  productCategoryFilter = '';
  productStockFilter = '';
  productFeaturedFilter = '';
  filteredProducts: Product[] = [];

  showDeleteConfirm = false;
  productToDelete: number | null = null;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadOrders();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      // Search filter
      if (this.productSearchQuery) {
        const query = this.productSearchQuery.toLowerCase();
        const matchesSearch = 
          product.name?.toLowerCase().includes(query) ||
          product.name_en?.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (this.productCategoryFilter) {
        if (product.category_id !== Number(this.productCategoryFilter)) return false;
      }

      // Stock filter
      if (this.productStockFilter) {
        if (this.productStockFilter === 'in_stock' && product.stock === 0) return false;
        if (this.productStockFilter === 'low_stock' && (product.stock >= 10 || product.stock === 0)) return false;
        if (this.productStockFilter === 'out_of_stock' && product.stock > 0) return false;
      }

      // Featured filter
      if (this.productFeaturedFilter !== '') {
        const isFeatured = this.productFeaturedFilter === 'true';
        if (product.is_featured !== isFeatured) return false;
      }

      return true;
    });
  }

  clearFilters(): void {
    this.productSearchQuery = '';
    this.productCategoryFilter = '';
    this.productStockFilter = '';
    this.productFeaturedFilter = '';
    this.filterProducts();
  }


  getProductImage(product: Product): string | null {
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0].url;
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      // Construct absolute URL using backend API base URL
      const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      const baseUrl = environment.apiUrl.replace('/api', ''); // Remove /api to get base URL
      return `${baseUrl}${cleanUrl}`;
    }
    return null;
  }


  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
          this.filterProducts();
        }
      }
    });
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

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.data;
        }
      }
    });
  }

  confirmDeleteProduct(product: Product): void {
    this.productToDelete = product.id;
    this.showDeleteConfirm = true;
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;

    this.productService.deleteProduct(this.productToDelete).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Product deleted successfully');
        this.showDeleteConfirm = false;
        this.productToDelete = null;
        this.loadProducts();
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to delete product');
        this.showDeleteConfirm = false;
        this.productToDelete = null;
      }
    });
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Order status updated successfully');
        this.loadOrders();
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to update order status');
      }
    });
  }
}

