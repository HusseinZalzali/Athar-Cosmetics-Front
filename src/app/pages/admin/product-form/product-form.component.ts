import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product, Category } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmModalComponent],
  template: `
    <div class="product-form-page">
      <div class="container">
        <div class="form-header">
          <button (click)="goBack()" class="back-btn">
            <span>←</span> Back to Products
          </button>
          <h1>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h1>
        </div>

        <form (ngSubmit)="saveProduct()" class="product-form card">
          <!-- Basic Information -->
          <section class="form-section">
            <h2 class="section-title">Basic Information</h2>
            
            <div class="form-group">
              <label>Product Name <span class="required">*</span></label>
              <input 
                type="text" 
                [(ngModel)]="productForm.name_en" 
                name="name_en" 
                required
                placeholder="Enter product name"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>SKU <span class="required">*</span></label>
              <input 
                type="text" 
                [(ngModel)]="productForm.sku" 
                name="sku" 
                required
                placeholder="e.g., PROD-001"
                class="form-input"
              />
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Category <span class="required">*</span></label>
                <select 
                  [(ngModel)]="productForm.category_id" 
                  name="category_id" 
                  required
                  class="form-select"
                >
                  <option value="">Select a category</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="productForm.is_featured" 
                    name="is_featured"
                    class="checkbox-input"
                  />
                  <span>Featured Product</span>
                </label>
              </div>
            </div>
          </section>

          <!-- Pricing & Inventory -->
          <section class="form-section">
            <h2 class="section-title">Pricing & Inventory</h2>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Price ($) <span class="required">*</span></label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  [(ngModel)]="productForm.price" 
                  name="price" 
                  required
                  placeholder="0.00"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>Stock Quantity <span class="required">*</span></label>
                <input 
                  type="number" 
                  min="0"
                  [(ngModel)]="productForm.stock" 
                  name="stock" 
                  required
                  placeholder="0"
                  class="form-input"
                />
              </div>
            </div>
          </section>

          <!-- Descriptions -->
          <section class="form-section">
            <h2 class="section-title">Description</h2>
            
            <div class="form-group">
              <label>Product Description</label>
              <textarea 
                [(ngModel)]="productForm.description_en" 
                name="description_en" 
                rows="4"
                placeholder="Enter product description"
                class="form-textarea"
              ></textarea>
            </div>
          </section>

          <!-- Product Images -->
          <section class="form-section">
            <h2 class="section-title">Product Images</h2>
            
            <div class="image-upload-area">
              <input 
                type="file" 
                #imageInput 
                accept="image/*" 
                (change)="onImageSelected($event)"
                multiple
                class="file-input"
                id="image-upload"
              />
              <label for="image-upload" class="upload-label">
                <div class="upload-icon">📷</div>
                <div class="upload-text">
                  <strong>Click to upload images</strong>
                  <span>or drag and drop</span>
                  <small>PNG, JPG, GIF up to 10MB each</small>
                </div>
              </label>
            </div>

            <!-- Selected Images Preview -->
            <div *ngIf="productFormImages.length > 0" class="selected-images-grid">
              <div *ngFor="let img of productFormImages; let i = index" class="image-preview-card">
                <div class="image-wrapper">
                  <img [src]="img.preview" [alt]="img.file.name" />
                  <button 
                    type="button" 
                    (click)="removeImage(i)" 
                    class="remove-image-btn"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
                <p class="image-name">{{ img.file.name }}</p>
                <p class="image-size">{{ formatFileSize(img.file.size) }}</p>
              </div>
            </div>

            <!-- Existing Images (Edit Mode) -->
            <div *ngIf="isEditMode && existingImages.length > 0" class="existing-images-section">
              <h3>Current Images</h3>
              <div class="existing-images-grid">
                <div *ngFor="let img of existingImages" class="existing-image-card">
                  <img [src]="getImageUrl(img.url)" [alt]="img.alt_text || 'Product image'" />
                  <button 
                    type="button" 
                    (click)="deleteExistingImage(img.id)" 
                    class="delete-image-btn"
                    title="Delete image"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" (click)="goBack()" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Confirm Delete Modal -->
      <app-confirm-modal
        *ngIf="showDeleteConfirm"
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        [danger]="true"
        (confirm)="confirmDeleteImage()"
        (cancel)="showDeleteConfirm = false; imageToDelete = null"
      ></app-confirm-modal>
    </div>
  `,
  styles: [`
    .product-form-page {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }

    .form-header {
      margin-bottom: 2rem;
      
      h1 {
        margin: 1rem 0 0 0;
        color: var(--text-primary);
      }
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: 1px solid var(--neutral-medium);
      color: var(--text-secondary);
      padding: 0.75rem 1.5rem;
      border-radius: var(--border-radius-small);
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      margin-bottom: 1rem;

      &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border-color: var(--primary);
      }

      span {
        font-size: 1.2rem;
      }
    }

    .product-form {
      padding: 2.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .form-section {
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--neutral-medium);

      &:last-of-type {
        border-bottom: none;
      }
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--primary);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary);
        font-size: 0.95rem;
      }

      .required {
        color: var(--error);
      }
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid var(--neutral-medium);
      border-radius: var(--border-radius-small);
      font-size: 0.95rem;
      font-family: 'Roboto', sans-serif;
      transition: all 0.2s ease;
      background: white;

      &:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(44, 95, 95, 0.1);
      }

      &::placeholder {
        color: var(--text-muted);
      }
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .checkbox-input {
      margin-right: 0.5rem;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    /* Image Upload Styles */
    .image-upload-area {
      border: 2px dashed var(--neutral-medium);
      border-radius: var(--border-radius);
      padding: 3rem 2rem;
      text-align: center;
      transition: all 0.3s ease;
      margin-bottom: 2rem;
      background: var(--bg-secondary);

      &:hover {
        border-color: var(--primary);
        background: rgba(44, 95, 95, 0.02);
      }
    }

    .file-input {
      display: none;
    }

    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
    }

    .upload-icon {
      font-size: 3rem;
    }

    .upload-text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      strong {
        color: var(--text-primary);
        font-size: 1.1rem;
      }

      span {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      small {
        color: var(--text-muted);
        font-size: 0.85rem;
      }
    }

    .selected-images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .image-preview-card {
      border: 1px solid var(--neutral-medium);
      border-radius: var(--border-radius-small);
      overflow: hidden;
      background: white;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow);
      }
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      padding-top: 100%; /* Square aspect ratio */
      overflow: hidden;
      background: var(--bg-secondary);
    }

    .image-wrapper img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-image-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--error);
      color: white;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 1.5rem;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.1);
      }
    }

    .image-name {
      padding: 0.75rem;
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-primary);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .image-size {
      padding: 0 0.75rem 0.75rem;
      margin: 0;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .existing-images-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--neutral-medium);

      h3 {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
      }
    }

    .existing-images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .existing-image-card {
      border: 1px solid var(--neutral-medium);
      border-radius: var(--border-radius-small);
      overflow: hidden;
      background: white;
      position: relative;
      padding-top: 100%;

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .delete-image-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(244, 67, 54, 0.95);
      color: white;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: background 0.2s ease;

      &:hover {
        background: var(--error);
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--neutral-medium);

      .btn {
        min-width: 150px;
      }
    }

    @media (max-width: 768px) {
      .product-form {
        padding: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
      }

      .section-title {
        font-size: 1.25rem;
      }

      .image-upload-area {
        padding: 2rem 1rem;
      }

      .selected-images-grid,
      .existing-images-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column;
        
        .btn {
          width: 100%;
          min-width: auto;
        }
      }
    }

    @media (max-width: 480px) {
      .product-form {
        padding: 1rem;
      }

      .form-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
      }

      .section-title {
        font-size: 1.1rem;
      }

      .image-upload-area {
        padding: 1.5rem 1rem;
      }

      .upload-icon {
        font-size: 2rem;
      }

      .selected-images-grid,
      .existing-images-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
        gap: 1rem;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  isEditMode = false;
  productId: number | null = null;
  categories: Category[] = [];
  saving = false;

  productForm: any = {
    name_en: '',
    name_ar: '', // Auto-filled with name_en
    description_en: '',
    description_ar: '', // Auto-filled with description_en
    price: 0,
    stock: 0,
    sku: '',
    category_id: null,
    is_featured: false
  };

  productFormImages: Array<{ file: File; preview: string }> = [];
  existingImages: any[] = [];
  showDeleteConfirm = false;
  imageToDelete: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
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

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const product = response.data;
          this.productForm = {
            name_en: product.name_en,
            name_ar: product.name_ar || product.name_en, // Fallback to English if Arabic missing
            description_en: product.description_en || '',
            description_ar: product.description_ar || product.description_en || '', // Fallback to English
            price: product.price,
            stock: product.stock,
            sku: product.sku,
            category_id: product.category_id,
            is_featured: product.is_featured
          };
          this.existingImages = product.images || [];
        }
      },
      error: () => {
        this.notificationService.error('Error', 'Failed to load product');
        this.goBack();
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
          this.notificationService.warning('File Too Large', `${file.name} is larger than 10MB`);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.productFormImages.push({
            file: file,
            preview: e.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.productFormImages.splice(index, 1);
  }

  deleteExistingImage(imageId: number): void {
    this.imageToDelete = imageId;
    this.showDeleteConfirm = true;
  }

  confirmDeleteImage(): void {
    if (!this.imageToDelete || !this.productId) return;

    this.productService.deleteProductImage(this.productId, this.imageToDelete).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Success', 'Image deleted successfully');
          this.existingImages = this.existingImages.filter(img => img.id !== this.imageToDelete);
          this.showDeleteConfirm = false;
          this.imageToDelete = null;
        } else {
          this.notificationService.error('Error', 'Failed to delete image');
        }
      },
      error: (err) => {
        this.notificationService.error('Error', err.error?.message || 'Failed to delete image');
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Construct absolute URL using backend API base URL
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    const baseUrl = environment.apiUrl.replace('/api', ''); // Remove /api to get base URL
    return `${baseUrl}${cleanUrl}`;
  }

  saveProduct(): void {
    // Validate
    if (!this.productForm.name_en || !this.productForm.sku || !this.productForm.category_id) {
      this.notificationService.error('Validation Error', 'Please fill in all required fields');
      return;
    }

    this.saving = true;

    // Auto-fill Arabic fields with English values if empty
    const productData = {
      ...this.productForm,
      name_ar: this.productForm.name_ar || this.productForm.name_en,
      description_ar: this.productForm.description_ar || this.productForm.description_en || '',
      category_id: Number(this.productForm.category_id),
      price: Number(this.productForm.price),
      stock: Number(this.productForm.stock) || 0
    };

    if (this.isEditMode && this.productId) {
      // Update
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: (response) => {
          if (response.success) {
            if (this.productFormImages.length > 0) {
              this.uploadProductImages(this.productId!);
            } else {
              this.saving = false;
              this.notificationService.success('Success', 'Product updated successfully');
              this.goBack();
            }
          } else {
            this.saving = false;
            this.notificationService.error('Error', response.message || 'Failed to update product');
          }
        },
        error: (err) => {
          this.saving = false;
          this.notificationService.error('Error', err.error?.message || 'Failed to update product');
        }
      });
    } else {
      // Create
      this.productService.createProduct(productData).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const newProductId = response.data.id;
            if (this.productFormImages.length > 0) {
              this.uploadProductImages(newProductId);
            } else {
              this.saving = false;
              this.notificationService.success('Success', 'Product created successfully');
              this.goBack();
            }
          } else {
            this.saving = false;
            const errorMsg = (response as any).message || (response as any).errors?.join(', ') || 'Failed to create product';
            this.notificationService.error('Error', errorMsg);
          }
        },
        error: (err) => {
          this.saving = false;
          let errorMsg = 'Failed to create product';
          if (err.error) {
            if (err.error.errors && Array.isArray(err.error.errors)) {
              errorMsg = err.error.errors.join(', ');
            } else if (err.error.message) {
              errorMsg = err.error.message;
            }
          }
          this.notificationService.error('Error', errorMsg);
        }
      });
    }
  }

  uploadProductImages(productId: number): void {
    if (this.productFormImages.length === 0) {
      this.saving = false;
      this.goBack();
      return;
    }

    let uploadCount = 0;
    const totalImages = this.productFormImages.length;
    let hasError = false;

    this.productFormImages.forEach((imageData, index) => {
      this.productService.uploadProductImage(productId, imageData.file).subscribe({
        next: () => {
          uploadCount++;
          if (uploadCount === totalImages) {
            this.saving = false;
            if (hasError) {
              this.notificationService.warning('Partial Success', 'Product saved but some images failed to upload');
            } else {
              this.notificationService.success('Success', this.isEditMode ? 'Product updated successfully' : 'Product created successfully');
            }
            this.goBack();
          }
        },
        error: (err) => {
          hasError = true;
          uploadCount++;
          if (uploadCount === totalImages) {
            this.saving = false;
            this.notificationService.warning('Partial Success', 'Product saved but some images failed to upload');
            this.goBack();
          }
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}

